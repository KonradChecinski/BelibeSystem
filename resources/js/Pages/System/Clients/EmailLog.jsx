import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Button, Card, CardActions, CardContent, Grid, Paper, Typography} from "@mui/material";
import ClientEmailHistoryTable from "@/Components/Table/Client/ClientEmailHistoryTable";

export default function EmailHistory(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Client's email history") + ": " + props.client.name
            }
        >
            <Head title={t("Client's email history") + ": " + props.client.name}/>
            <Grid container spacing={2} sx={{flex: 1}}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{height: "100%", display: "flex"}} elevation={1}>
                        <ClientEmailHistoryTable emails={props.emails} props={props}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{height: "100%"}} elevation={1}>
                        <iframe
                            src={route("system.emailLogs.show", {emailLog: props.emails[0].id})}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                borderRadius: "12px",
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>


        </UserLayout>
    );
}
