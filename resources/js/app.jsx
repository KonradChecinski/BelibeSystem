import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { LaravelReactI18nProvider } from "laravel-react-i18n";
import { SnackbarProvider } from "notistack";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        // const root = createRoot(el);
        //
        // root.render(<App {...props} />);

        const root = createRoot(el);

        root.render(
            <LaravelReactI18nProvider
                lang={"pl"}
                fallbackLang={"en"}
                resolve={async (lang) => {
                    const langs = import.meta.globEager("../../lang/*.json");
                    const fn = langs[`../../lang/${lang}.json`];

                    return await fn;
                    // if (typeof fn === 'function') {
                    //     return await fn();
                    // }
                }}
            >
                <SnackbarProvider
                    // dense
                    maxSnack={7}
                    autoHideDuration={3000}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                >
                    <App {...props} />
                </SnackbarProvider>
            </LaravelReactI18nProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
