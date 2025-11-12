# Multi-stage Dockerfile for Laravel + React (Inertia) on Kinsta/Dokploy

# 1) Build frontend assets
FROM node:18-alpine AS nodebuild
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) PHP base with Composer and PHP extensions
FROM php:8.2-fpm-alpine AS phpbase
WORKDIR /var/www/html

# System deps: nginx + supervisor + build deps for PHP extensions
RUN apk add --no-cache \
    nginx supervisor bash git curl icu-dev oniguruma-dev libzip-dev libpng-dev postgresql-dev \
  && docker-php-ext-configure intl \
  && docker-php-ext-install -j$(nproc) intl pdo pdo_pgsql zip gd \
  && rm -rf /var/cache/apk/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy PHP dependencies manifest and install (no-dev)
COPY composer.json composer.lock* ./
RUN composer install --no-interaction --no-ansi --no-scripts --no-progress --prefer-dist --no-dev \
    && composer clear-cache

# Copy application code
COPY . .

# Copy built assets
COPY --from=nodebuild /app/public/build ./public/build

# Nginx config
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Ensure storage permissions
RUN mkdir -p storage bootstrap/cache \
  && chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

# Environment tuning (opcache for production)
ENV PHP_OPCACHE_VALIDATE_TIMESTAMPS=0 \
    PHP_OPCACHE_ENABLE=1 \
    PHP_OPCACHE_ENABLE_CLI=0

# Add startup script
COPY docker/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# Expose HTTP on port 8080 (Kinsta expects containers to listen here)
EXPOSE 8080

# Run startup (migrate + caches) then launch Supervisor (nginx + php-fpm)
CMD ["/usr/local/bin/startup.sh"]
