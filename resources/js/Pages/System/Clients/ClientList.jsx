import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import ClientsTable from "@/Components/Table/Client/ClientsTable";

export default function ClientList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Clients")}>
            <Head title={t("Clients")}/>

            <Card sx={{height: "100%", width: 1, display: "flex"}}>
                <ClientsTable {...props} />
            </Card>
        </UserLayout>
    );
}
