import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { LaravelReactI18nProvider } from "laravel-react-i18n";
import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";

// const [isDarkThemea, setIsDarkThemea] = useState(false);

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

const themeLight = {
    palette: {
        mode: "light",
    },
};
const themeDark = {
    palette: {
        mode: "dark",
    },
};

const useThemeDetector = () => {
    const getCurrentTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
    const mqListener = (e) => {
        setIsDarkTheme(e.matches);
    };

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addListener(mqListener);
        return () => darkThemeMq.removeListener(mqListener);
    }, []);
    return isDarkTheme;
};

// const isDarkTheme = useThemeDetector();

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
                <ThemeProvider
                    theme={
                        window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? createTheme(themeDark)
                            : createTheme(themeLight)
                    }
                >
                    <App {...props} />
                </ThemeProvider>
            </LaravelReactI18nProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
