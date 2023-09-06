import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useSnackbar} from "notistack";
import ModelsTable from "@/Components/Table/ModelsTable";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function ModelList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Models")}>
            <Head title={t("Models")}/>

            <Card sx={{height: "100%", width: 1}}>
                <ModelsTable {...props} />
            </Card>
        </UserLayout>
    );
}
