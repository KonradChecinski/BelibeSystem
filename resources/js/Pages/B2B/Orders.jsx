import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import moment from "moment";
import toLocaleString from "@/Functions/toLocaleString";
import B2bOrdersTable from "@/Components/Table/B2B/Orders";

export default function B2bOrders(props) {
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
            clientId={props.clientId}
            blacklist={props.blacklist}
            header={
                t("Orders")
            }
        >
            <Head title={t("Orders")}/>
            <B2bOrdersTable orders={props.orders} props={props}/>

        </ClientLayout>
    );
}
