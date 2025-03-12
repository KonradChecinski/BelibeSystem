import ReactDOMServer from 'react-dom/server';
import {createInertiaApp} from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import route from '../../vendor/tightenco/ziggy/dist/index.m.js';
import moment from "moment/moment";
import {createRoot} from "react-dom/client";
import {LaravelReactI18nProvider} from "laravel-react-i18n";
import {closeSnackbar, SnackbarProvider} from "notistack";
import {IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";

const appName = "Belibe";

const htmlLang = "en";

moment.locale(htmlLang)

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob("./Pages/**/*(*.ts|*.tsx|*.js|*.jsx)")
            ),
        setup({el, App, props}) {
            const root = createRoot(el);


            root.render(
                <LaravelReactI18nProvider
                    lang={htmlLang}
                    fallbackLang={"en"}
                    files={import.meta.glob("/lang/*.json")}>
                    <SnackbarProvider
                        // dense
                        maxSnack={7}
                        autoHideDuration={3000}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        action={(snackbarId) => (
                            <IconButton aria-label="close" onClick={() => closeSnackbar(snackbarId)}>
                                <Close/>
                            </IconButton>
                        )}
                        preventDuplicate={true}
                    >
                        <App {...props} />
                    </SnackbarProvider>
                </LaravelReactI18nProvider>
            );
        },
        progress: {
            color: "#4B5563"
        }
    })
);
