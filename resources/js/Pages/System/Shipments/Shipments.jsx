import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import DeliveryAddDialog from "@/Components/Dialogs/DeliveriesDialog/DeliveryAddDialog";
import {Button} from "@mui/material";
import {useState} from "react";
import ShipmentsTable from "@/Components/Table/Shipments";

export default function Shipments(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Shipments")
            }
        >
            <Head title={t("Shipments")}/>

            {/*<Button variant="contained" onClick={() => setOpen(true)}>*/}
            {/*    {t("Add Delivery")}*/}
            {/*</Button>*/}
            <ShipmentsTable {...props}/>

        </UserLayout>
    );
}
