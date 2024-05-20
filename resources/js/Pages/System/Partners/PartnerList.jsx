import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Card, createTheme, Typography} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {useCallback, useState} from "react";
import PartnersTable from "@/Components/Table/Partners/PartnersTable";

export default function PartnerList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Partners")}>
            <Head title={t("Partners")}/>

            <Card sx={{height: "100%", width: 1}}>
                <PartnersTable {...props} />

            </Card>
        </UserLayout>
    );
}
