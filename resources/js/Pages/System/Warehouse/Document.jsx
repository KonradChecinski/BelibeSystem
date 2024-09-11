import {Head, useForm} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Button, Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import WarehouseEditDocument from "@/Components/Pages/Warehouse/WarehouseEditDocumentComponent";

export default function DocumentList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)


    return (
        <UserLayout auth={props.auth} errors={props.errors}
                    header={t("Editing") + " " + props.warehouseDocument.number}>
            <Head title={t("Editing") + " " + props.warehouseDocument.number}/>

            <Card sx={{height: "100%", width: 1, display: "flex", flexDirection: "column"}}>
                <WarehouseEditDocument props={props}/>
            </Card>
        </UserLayout>
    );
}
