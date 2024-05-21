import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import OrderListTable from "@/Components/Table/Orders/OrderListTable";

export default function OrderList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const order1 = props.orders.b2b.slice().map(order => (
        {
            ...order,
            type: 0
        }))
    const order2 = props.orders.other.slice()
    const data = [...order1, ...order2]


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Orders")}>
            <Head title={t("Orders")}/>

            <Card sx={{height: "100%", width: 1}}>
                <OrderListTable orders={data} readOnly={props.readOnly}
                                props={props}/>
            </Card>
        </UserLayout>
    );
}
