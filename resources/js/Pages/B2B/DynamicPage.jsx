import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Render} from "@measured/puck";
import {useState} from "react";
import {ButtonGroup} from "@/Pages/System/Pages/blocks/ButtonGroup";
import {Hero} from "@/Pages/System/Pages/blocks/Hero";
import {Heading} from "@/Pages/System/Pages/blocks/Heading";
import {FeatureList} from "@/Pages/System/Pages/blocks/FeatureList";
import {Logos} from "@/Pages/System/Pages/blocks/Logos";
import {Text} from "@/Pages/System/Pages/blocks/Text";
import {VerticalSpace} from "@/Pages/System/Pages/blocks/VerticalSpace";

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
    };


    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            accountManager={props.accountManager}
            cart={props.cartSummary}
            clientId={props.clientId}
            header={
                t(props.page?.title)
            }
        >
            <Head title={t(props.page?.title)}/>
            <Render config={config} data={initialData}/>

        </ClientLayout>
    );
}
