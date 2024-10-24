import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import B2bInvoicesTable from "@/Components/Table/B2B/Invoices";

export default function B2bInvoices(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            props={props}
            header={
                t("Invoices")
            }
        >
            <Head title={t("Invoices")}/>
            <B2bInvoicesTable invoices={props.invoices} props={props}/>

        </ClientLayout>
    );
}
