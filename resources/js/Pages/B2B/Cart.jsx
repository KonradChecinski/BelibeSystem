import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function B2bCart(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            header={
                t("Cart")
            }
        >
            <Head title={t("Cart")}/>


        </ClientLayout>
    );
}
