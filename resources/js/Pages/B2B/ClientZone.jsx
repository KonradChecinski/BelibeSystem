import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Avatar,
    Box, Button,
    Divider,
    Grid,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper, TextField,
    Typography
} from "@mui/material";
import {Email, History, Payment, Phone, PhoneAndroid, ReceiptLong} from "@mui/icons-material";
import ClientBasicInfo from "@/Components/Pages/B2B/ClientZone/ClientBasicInfo";
import Shortcut from "@/Components/Pages/B2B/ClientZone/Shortcut";
import ClientAccountManager from "@/Components/Pages/B2B/ClientZone/ClientAccountManager";
import ChangeEmail from "@/Components/Pages/B2B/ClientZone/ChangeEmail/ChangeEmail";
import ChangePassword from "@/Components/Pages/B2B/ClientZone/ChangePassword/ChangePassword";

export default function B2bMainPage(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            props={props}
            header={
                t("Client zone")
            }
        >
            <Head title={t("Client zone")}/>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <ClientBasicInfo {...props} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Shortcut {...props} />
                </Grid>

                <Grid item xs={12} md={12}>
                    <ClientAccountManager {...props} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChangeEmail {...props} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChangePassword {...props} />
                </Grid>
            </Grid>
        </ClientLayout>
    );
}
