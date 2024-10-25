import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Render} from "@measured/puck";
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
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";
import {ColumnResponsive} from "@/Pages/System/Pages/blocks/ColumnResponsive";

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
            accordion: PAccordion,
            button: PButton,
            'button-group': PButtonGroup,
            card: PCard,
            columns: PColumns,
            container: PContainer,
            divider: PDivider,
            heading: PHeading,
            paper: PPaper,
            paragraph: PParagraph,
            typography: PTypography,
            columnResponsive: ColumnResponsive,
            link: PuckLink,

        },
    };


    return (
        <ClientLayout
            props={props}
            header={
                t(props.page?.title)
            }
        >
            <Head title={t(props.page?.title)}/>
            <Render config={config} data={initialData}/>

        </ClientLayout>
    );
}
