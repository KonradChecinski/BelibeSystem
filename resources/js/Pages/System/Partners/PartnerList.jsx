import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import ClientsTable from "@/Components/Table/Client/ClientsTable";

export default function PartnerList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Partners")}>
            <Head title={t("Partners")}/>

            <Card sx={{height: "100%", width: 1}}>
                {/*<ClientsTable {...props} />*/}
            </Card>
        </UserLayout>
    );
}
