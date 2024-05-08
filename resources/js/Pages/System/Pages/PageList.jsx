import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import PagesTable from "@/Components/Table/Page/PagesTable";

export default function PageList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Pages")}>
            <Head title={t("Pages")}/>

            <Card sx={{height: "100%", width: 1}}>
                <PagesTable {...props} />
            </Card>
        </UserLayout>
    );
}
