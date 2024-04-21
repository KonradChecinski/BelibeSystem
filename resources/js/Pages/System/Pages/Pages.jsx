import {Head, Link, useForm} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Button, Card, Tooltip} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Puck} from "@measured/puck";
import "@measured/puck/puck.css";
import {ButtonGroup} from "./blocks/ButtonGroup";
import {Hero} from "./blocks/Hero";
import {Heading,} from "./blocks/Heading";
import {FeatureList} from "./blocks/FeatureList";
import {Logos} from "./blocks/Logos";
import {Text} from "./blocks/Text";
import {VerticalSpace} from "./blocks/VerticalSpace";
import ClientLayout from "@/Layouts/ClientLayout";
import {ArrowBack} from "@mui/icons-material";

export default function Pages(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();
    const {data, setData, post, put, loading, errors} = useForm();

    const config = {
        components: {
            ButtonGroup,
            Hero,
            Heading,
            FeatureList,
            Logos,
            Text,
            VerticalSpace,
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
                        fixed={false}
                        header={title}
                    >
                        {children}
                    </ClientLayout>
                );
            }
        }
    };

// Describe the initial data
    const initialData = {
        content: [],
        root: {title: "Tytuł"},
    };

// Save the data to your database
    const save = (data) => {
        console.log(data)
    };

    return (
        <>
            {/*// <UserLayout*/}
            {/*//     auth={props.auth}*/}
            {/*//     errors={props.errors}*/}
            {/*//     header={*/}
            {/*//         t("Pages")*/}
            {/*//     }*/}
            {/*// >*/}
            <Head title={t("Nowa strona")}/>
            {/*//     <Card sx={{height: "100%", width: 1}}>*/}
            {/*//*/}
            {/*//     </Card>*/}
            {/*// </UserLayout>*/}
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
                                    window.history.back();
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
                    // onChange={(value) => setData(value)}
                    style={{
                        border: "none",
                        boxShadow: "none",
                    }}/>
            </Box>
        </>
    );
}
