#!/usr/bin/env sh
set -eu

cd /var/www/html

# Optional: ensure storage symlink (safe to re-run)
php artisan storage:link >/dev/null 2>&1 || true

# Wait for DB and run migrations with retries
retries=10
sleep_between=5

for i in $(seq 1 $retries); do
  if php artisan migrate --force; then
    echo "Migrations completed"
    break
  fi
  if [ "$i" -eq "$retries" ]; then
    echo "Migrations failed after $retries attempts" >&2
    exit 1
  fi
  echo "Migrations failed, retrying in ${sleep_between}s ($i/$retries)" >&2
  sleep "$sleep_between"
done

# Cache config/routes/views each start (safe and quick)
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Start process manager (nginx + php-fpm)
exec /usr/bin/supervisord -n -c /etc/supervisord.conf
