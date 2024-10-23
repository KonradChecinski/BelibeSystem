import {Head, Link, router, useForm} from "@inertiajs/react";
import {Box, Button, Card, Tooltip} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Puck} from "@measured/puck";
import "@measured/puck/puck.css";
import {Text} from "./blocks/Text";
import {VerticalSpace} from "./blocks/VerticalSpace";
import {ArrowBack} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {useEffect, useState} from "react";
import {Column} from "@/Pages/System/Pages/blocks/Column";

export default function Header(props) {
    const [pageData, setPageData] = useState(props?.page);
    console.log(props)
    const {t} = useLaravelReactI18n();


    const [config, setConfig] = useState({
        components: {
            Text,
            VerticalSpace,
            Column,
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
                return (<ClientLayout
                        auth={props.auth}
                        errors={props.errors}
                        categories={props.menu}
                        bgImage={props.backgroundImage}
                        cart={props.cartSummary}
                        clientId={props.clientId}
                        blacklist={false}
                        fixed={false}
                        header={title}
                    >
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
                onSuccess: () => {
                    enqueueSnackbar("Strona została utworzona", {variant: "success"});
                    router.visit(route("system.pages"));
                },
                onError: (error) => {
                    console.error(error)
                    enqueueSnackbar("Wystąpił błąd podczas tworzenia strony", {variant: "error"})
                }

            })
        }
    };

    return (
        <>
            <Head title={t("Nowa strona")}/>
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

                <Puck
                    config={config}
                    data={initialData}
                    onPublish={save}

                    style={{
                        border: "none",
                        boxShadow: "none",
                    }}/>
            </Box>
        </>
    );
}
