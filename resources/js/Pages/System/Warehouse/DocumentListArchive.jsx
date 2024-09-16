import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import WarehouseDocumentListTable from "@/Components/Table/Warehouse/WarehouseDocumentListTable";

export default function DocumentListArchive(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const data = props.warehouseDocuments


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Warehouse") + " - " + t("Archive")}>
            <Head title={t("Warehouse") + " - " + t("Archive")}/>

            <Card sx={{height: "100%", width: 1}}>
                <WarehouseDocumentListTable documents={data} readOnly={props.readOnly}
                                            props={props}/>
            </Card>
        </UserLayout>
    );
}
