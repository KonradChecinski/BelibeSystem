import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    PAccordion,
    PButton,
    PButtonGroup,
    PCard,
    PColumns,
    PContainer,
    PDivider,
    PHeading,
    PPaper,
    PParagraph, PTypography
} from "puck-mui";
import {ColumnResponsive} from "@/Pages/System/Pages/blocks/ColumnResponsive";
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";
import {Render} from "@measured/puck";
import B2BBestsellers from "@/Components/Pages/B2B/ExtraMainPage/Bestsellers";
import {Bestsellers} from "@/Pages/System/Pages/blocks/Bestsellers";

export default function B2bMainPage(props) {
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
            bestsellers: Bestsellers,
        },
    };


    return (
        <ClientLayout
            props={props}
            header={
                t("Dashboard")
            }
        >
            <Head title={t("Dashboard")}/>
            <Render config={config} data={initialData}/>

        </ClientLayout>
    );
}
