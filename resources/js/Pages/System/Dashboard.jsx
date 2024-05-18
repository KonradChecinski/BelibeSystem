import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Button, Card, CardActions, CardContent, Grid, Paper, Typography} from "@mui/material";
import CountTodayOrders from "@/Components/Pages/Dashboard/CountTodayOrders";
import CountTodayB2bOrders from "@/Components/Pages/Dashboard/CountTodayB2bOrders";
import CountTodayOtherOrders from "@/Components/Pages/Dashboard/CountTodayOtherOrders";
import OrdersPlot from "@/Components/Pages/Dashboard/OrdersPlot";

export default function Dashboard(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Dashboard")
            }
        >
            <Head title={t("Dashboard")}/>
            <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                    <CountTodayOrders {...props} />
                </Grid>
                <Grid item xs={6} md={4}>
                    <CountTodayB2bOrders {...props} />
                </Grid>
                <Grid item xs={6} md={4}>
                    <CountTodayOtherOrders {...props} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <OrdersPlot {...props} />
                </Grid>
            </Grid>


        </UserLayout>
    );
}
