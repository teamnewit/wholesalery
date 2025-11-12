import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob('./pages/**/*.tsx');

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => {
            const normalized = name.replace(/\\/g, '/');
            const exact = `./pages/${normalized}.tsx`;
            if (pages[exact]) return resolvePageComponent(exact, pages);

            const lower = `./pages/${normalized.toLowerCase()}.tsx`;
            for (const key of Object.keys(pages)) {
                if (key === lower || key.toLowerCase() === exact.toLowerCase() || key.toLowerCase().endsWith(`/${normalized.toLowerCase()}.tsx`)) {
                    return resolvePageComponent(key, pages);
                }
            }
            throw new Error(`Page not found: ./pages/${name}.tsx`);
        },
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
