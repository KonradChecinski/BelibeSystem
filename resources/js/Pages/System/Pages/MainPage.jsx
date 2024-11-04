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

import {PDivider, PHeading, PParagraph, PTypography, PColumns, PContainer} from 'puck-mui';
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";
import {ColumnResponsive} from "@/Pages/System/Pages/blocks/ColumnResponsive";
import {Bestsellers} from "@/Pages/System/Pages/blocks/Bestsellers";

export default function MainPage(props) {
    const [pageData, setPageData] = useState(props?.dynamicMainPage);
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
            verticalSpace: {
                ...VerticalSpace,
                "label": "Pionowy odstęp",
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
            columnResponsive: {
                ...ColumnResponsive,
                "label": "Kolumny - responsywne",
            },
            container: {
                ...PContainer,
                "label": "Kontener",
            },
            link: PuckLink,
            bestsellers: Bestsellers,
        },
        categories: {
            "text": {
                title: 'Tekst',
                components: ["heading", "paragraph", "typography"]
            },
            "link": {
                title: 'Link',
                components: ["link"]
            },
            "spacing": {
                title: 'Odstep',
                components: ["divider", "verticalSpace"]
            },
            "data-display": {
                title: 'Ułożenie',
                components: ["column", "columnResponsive", "container"]
            },
            "extra": {
                title: 'Specjalne',
                components: ["bestsellers"]
            },
        },
        root: {fields: {},}
    });

// Describe the initial data
    const [initialData, setInitialData] = useState({
        content: pageData?.content ? pageData?.content : [],
        zones: pageData?.zones ? pageData?.zones : [],
        root: {
            props: {
                title: t("Dashboard")
            }
        },
    });
// Save the data to your database
    const save = (data) => {
        // console.log(data, pageData.id)
        router.patch(route("system.pages.main.update"), data, {
            onSuccess: () => {
                enqueueSnackbar("Stopka została zaktualizowana", {variant: "success"})
                router.visit(route("system.pages.main.edit"));
            },
            onError: (error) => {
                console.error(error)
                enqueueSnackbar("Wystąpił błąd podczas aktualizacji strony", {variant: "error"})
            }

        })
    };

    return (
        <>
            <Head title={t("Dashboard")}/>
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
