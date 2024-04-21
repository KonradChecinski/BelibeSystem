import {Head, Link, router} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import ModelList from "@/Components/Pages/B2B/ModelList";

export default function B2bCategory(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)


    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            accountManager={props.accountManager}
            cart={props.cartSummary}
            header={
                props.category.name
            }
        >
            <Head title={props.category.name}/>
            <ModelList {...props} />
        </ClientLayout>
    );
}
