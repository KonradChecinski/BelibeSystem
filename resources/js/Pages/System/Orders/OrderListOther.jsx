import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import OrderListOtherTable from "@/Components/Table/Orders/OrderListOtherTable";

export default function OrderListOther(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const data = props.orders


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Orders")}>
            <Head title={t("Orders")}/>

            <Card sx={{height: "100%", width: 1}}>
                <OrderListOtherTable orders={data} readOnly={props.readOnly}
                                     props={props}/>
            </Card>
        </UserLayout>
    );
}
