import {Head} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import B2bOrdersTable from "@/Components/Table/B2B/Orders";

export default function B2bOrders(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            props={props}
            header={
                t("Orders")
            }
        >
            <Head title={t("Orders")}/>
            <B2bOrdersTable orders={props.orders} props={props}/>

        </ClientLayout>
    );
}
