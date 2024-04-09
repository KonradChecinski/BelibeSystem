import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Paper} from "@mui/material";

export default function B2bModel(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            header={
                t("Model") + " " + props.model.symbol + ": " + props.model.name
            }
        >
            <Head title={t("Model") + " " + props.model.symbol}/>
            <Paper elevation={4}>
                cos
            </Paper>

        </ClientLayout>
    );
}
