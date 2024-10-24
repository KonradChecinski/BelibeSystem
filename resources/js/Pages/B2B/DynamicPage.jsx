import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Render} from "@measured/puck";
import {useState} from "react";
import {ButtonGroup} from "resources/js/Pages/System/Pages/blocks/stare/ButtonGroup";
import {Hero} from "resources/js/Pages/System/Pages/blocks/stare/Hero";
import {Heading} from "resources/js/Pages/System/Pages/blocks/stare/Heading";
import {FeatureList} from "resources/js/Pages/System/Pages/blocks/stare/FeatureList";
import {Logos} from "resources/js/Pages/System/Pages/blocks/stare/Logos";
import {Text} from "@/Pages/System/Pages/blocks/Text";
import {VerticalSpace} from "@/Pages/System/Pages/blocks/VerticalSpace";
import {config as PuckMuiConfig} from 'puck-mui';

export default function DynamicPage(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const initialData = {
        content: props.page?.content,
        root: {
            props: {
                title: props.page?.title,
                slug: props.page?.slug,
            }
        },
    };
    // const config = {
    //     components: {
    //         // ButtonGroup,
    //         // Hero,
    //         // Heading,
    //         // FeatureList,
    //         // Logos,
    //         // Text,
    //         // VerticalSpace,
    //     },
    // };


    return (
        <ClientLayout
            props={props}
            header={
                t(props.page?.title)
            }
        >
            <Head title={t(props.page?.title)}/>
            <Render config={PuckMuiConfig} data={initialData}/>

        </ClientLayout>
    );
}
