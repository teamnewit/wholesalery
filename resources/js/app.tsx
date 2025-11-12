import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const normalized = name.replace(/\\/g, '/');
        const exact = `./pages/${normalized}.tsx`;
        if (pages[exact]) return pages[exact];

        const lower = `./pages/${normalized.toLowerCase()}.tsx`;
        for (const key of Object.keys(pages)) {
            if (key === lower || key.toLowerCase() === exact.toLowerCase() || key.toLowerCase().endsWith(`/${normalized.toLowerCase()}.tsx`)) {
                return pages[key];
            }
        }
        throw new Error(`Page not found: ./pages/${name}.tsx`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster 
                    position="bottom-right"
                    toastOptions={{
                        className: 'border border-gray-200 dark:border-gray-700',
                        style: {
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
