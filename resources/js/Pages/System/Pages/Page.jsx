import {Head, router} from "@inertiajs/react";
import {Box, Button, Tooltip} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Puck, Config} from "@measured/puck";
import "@measured/puck/puck.css";
import ClientLayout from "@/Layouts/ClientLayout";
import {ArrowBack} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {useState} from "react";
import {
    config as PuckMuiConfig,
    PAccordion,
    PButton,
    PButtonGroup,
    PCard,
    PColumns,
    PContainer,
    PDivider, PHeading, PPaper, PParagraph, PTypography
} from 'puck-mui';
import {ColumnResponsive} from "@/Pages/System/Pages/blocks/ColumnResponsive";
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";
import ClearLayout from "@/Layouts/ClearLayout";


export default function Page(props) {
    const [pageData, setPageData] = useState(props?.page);
    console.log(props)
    const {t} = useLaravelReactI18n();


    const [config, setConfig] = useState({
        components: {
            accordion: {
                ...PAccordion,
                label: "Zwijana zakładka"
            },
            button: {
                ...PButton,
                label: "Guzik",
            },
            'button-group': {
                ...PButtonGroup,
                label: "Grupa guzików",
            },
            card: {
                ...PCard,
                label: "Karta"
            },
            columns: {
                ...PColumns,
                "label": "Kolumny",
            },
            container: {
                ...PContainer,
                "label": "Kontener",
            },
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
            paper: {
                ...PPaper,
                label: "Kartka",
            },
            columnResponsive: {
                ...ColumnResponsive,
                "label": "Kolumny - responsywne",
            },
            link: PuckLink
        },
        categories: {
            'data-display': {
                title: 'Ułożenie',
                components: ['divider', 'heading', 'paragraph', 'typography']
            },
            "link": {
                title: 'Link',
                components: ["link"]
            },
            inputs: {
                title: 'Guziki',
                components: ['button', 'button-group']
            },
            layout: {
                title: 'Layout',
                components: ['columns', 'container', 'columnResponsive']
            },
            surface: {
                title: 'Powierzchnia',
                components: ['accordion', 'card', 'paper']
            }

        },

        root: {
            fields: {
                title: {
                    type: "text",
                    label: "Tytuł",
                },
                slug: {
                    type: "text",
                    label: "Url",
                },
            },
            render: ({children, editMode, title}) => {
                return (
                    <ClientLayout props={props} header={title}>
                        {children}
                    </ClientLayout>
                );
            }
        }
    });

// Describe the initial data
    const [initialData, setInitialData] = useState({
        content: pageData?.content ? pageData?.content : [],
        root: {
            props: {
                title: pageData?.title ? pageData?.title : "",
                slug: pageData?.slug ? pageData?.slug : "",
            }
        },
    });
// Save the data to your database
    const save = (data) => {
        // console.log(data, pageData.id)
        if (pageData) {
            router.patch(route("system.pages.page.update", {dynamicPage: pageData.id}), data, {
                onSuccess: () => {
                    enqueueSnackbar("Strona została zaktualizowana", {variant: "success"})
                    router.visit(route("system.pages.page.edit", {dynamicPage: pageData.id}));
                },
                onError: (error) => {
                    console.error(error)
                    enqueueSnackbar("Wystąpił błąd podczas aktualizacji strony", {variant: "error"})
                }

            })
        } else {
            console.log("create")
            router.post(route("system.pages.page.create"), data, {
                onSuccess: (cos, cos2) => {
                    enqueueSnackbar("Strona została utworzona", {variant: "success"});
                    // router.visit(route("system.pages"));
                    console.log(cos, cos2)
                },
                onError: (error) => {
                    console.error(error)
                    enqueueSnackbar("Wystąpił błąd podczas tworzenia strony", {variant: "error"})
                }

            })
        }
    };

    return (
        <ClearLayout>
            <Head title={initialData.root.props.title === null ? initialData.root.props.title : t("New page")}/>
            <Box>
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

                <Puck
                    config={config}
                    data={initialData}
                    onPublish={save}
                    iframe={{enabled: false}}
                    style={{
                        border: "none",
                        boxShadow: "none",
                    }}/>
            </Box>
        </ClearLayout>
    );
}
