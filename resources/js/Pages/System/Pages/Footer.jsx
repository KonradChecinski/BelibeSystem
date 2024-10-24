import {Head, Link, router, useForm} from "@inertiajs/react";
import {Box, Button, Card, CssBaseline, ThemeProvider, Tooltip} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Puck} from "@measured/puck";
import "@measured/puck/puck.css";
import {Text} from "./blocks/Text";
import {VerticalSpace} from "./blocks/VerticalSpace";
import {ArrowBack} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {useEffect, useState} from "react";
import Theme from "@/Theme/Theme";
import {useTheme} from "@mui/material/styles";

import {PDivider, PHeading, PParagraph, PTypography, PColumns} from 'puck-mui';
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";

export default function Footer(props) {
    const [pageData, setPageData] = useState(props?.dynamicFooter);
    const theme = useTheme();
    console.log(props)
    const {t} = useLaravelReactI18n();


    const [config, setConfig] = useState({
        // ...PuckMuiConfig,

        components: {
            divider: {
                ...PDivider,
                "label": "Oddzielacz",
            },
            heading: {
                ...PHeading,
                "label": "Nagłówek",
            },
            paragraph: {
                ...PParagraph,
                "label": "Paragraf",
            },
            typography: {
                ...PTypography,
                "label": "Tekst",
            },
            column: {
                ...PColumns,
                "label": "Kolumny",
            },
            link: PuckLink
        },
        categories: {
            "data-display": {
                title: 'Ułożenie',
                components: ["column"]
            },
            "text": {
                title: 'Tekst',
                components: ["heading", "paragraph", "typography"]
            },
            "spacing": {
                title: 'Odstep',
                components: ["divider"]
            },
            "link": {
                title: 'Link',
                components: ["link"]
            }
        },
        root: {fields: {},}
    });

// Describe the initial data
    const [initialData, setInitialData] = useState({
        content: pageData?.content ? pageData?.content : [],
        zones: pageData?.zones ? pageData?.zones : [],
        root: {
            props: {
                title: t("Footer")
            }
        },
    });
// Save the data to your database
    const save = (data) => {
        // console.log(data, pageData.id)
        router.patch(route("system.pages.footer.update"), data, {
            onSuccess: () => {
                enqueueSnackbar("Stopka została zaktualizowana", {variant: "success"})
                router.visit(route("system.pages.footer.edit"));
            },
            onError: (error) => {
                console.error(error)
                enqueueSnackbar("Wystąpił błąd podczas aktualizacji strony", {variant: "error"})
            }

        })
    };

    return (
        <>
            <Head title={t("Footer")}/>
            <Box
                sx={{
                    "& .Puck div": {
                        // border: "none",
                        boxShadow: "none",
                        // background: "none",
                        // color: "primary.main"
                    },
                    "& .Puck>div>div>div": {
                        background: "none !important",
                        border: "none !important",
                    },
                    // "& #puck-preview>div:last-of-type": {
                    //     // bgcolor: "green"
                    // },
                    "& #puck-preview>div:last-of-type>div>div": {

                        border: 1
                    },
                }}
            >
                <Box sx={{
                    position: "absolute",
                    top: 18,
                    left: 80,
                    zIndex: 5000,
                }}>
                    <Tooltip title="Powrót do poprzedniej strony" arrow>
                        <Button
                            onClick={
                                () => {
                                    router.visit(route("system.pages"));
                                }
                            }>
                            <ArrowBack sx={{color: "black"}}/>
                        </Button>
                    </Tooltip>
                </Box>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Puck
                        config={config}
                        data={initialData}
                        onPublish={save}

                        style={{
                            border: "none",
                            boxShadow: "none",
                        }}/>
                </ThemeProvider>
            </Box>
        </>
    );
}
