import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Button, Card, CardActions, CardContent, Grid, Paper, Typography} from "@mui/material";
import ClientEmailHistoryTable from "@/Components/Table/Client/ClientEmailHistoryTable";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {useState} from "react";

export default function EmailHistory(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const [selectedDate, setSelectedDate] = useState(null);
    const [type, setType] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [filtered, setFiltered] = useState(props.emails);

    const handleFilter = () => {
        let result = props.emails;

        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split("T")[0];
            result = result.filter((e) => e.sent_at.startsWith(dateStr));
        }
        if (type) {
            result = result.filter((e) => e.type === type);
        }
        if (classFilter) {
            result = result.filter((e) => e.class.includes(classFilter));
        }
        setFiltered(result);
    };

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
                    {/*<Paper sx={{height: "100%", display: "flex"}} elevation={1}>*/}
                        {/*<ClientEmailHistoryTable emails={props.emails} props={props}/>*/}
                    {/*</Paper>*/}
                    <Paper sx={{height: "100%"}} elevation={1}>
                        {/* LISTA MAILI */}
                        <Grid container sx={{gap:2}}>
                            {filtered.map((email) => (
                                <Grid item xs={12} spacing={0} key={email.id}>
                                    <Paper sx={{ p: 2 }} elevation={4}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {email.sent_at}
                                        </Typography>
                                        <Typography variant="h6">{email.subject}</Typography>
                                        <Typography variant="body2">From: {email.from.map(f => f.address).join(", ")}</Typography>
                                        <Typography variant="body2">To: {email.to.map(t => t.address).join(", ")}</Typography>
                                        <Typography variant="body2">Type: {email.type}</Typography>
                                        <Typography variant="body2">Class: {email.class}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
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
