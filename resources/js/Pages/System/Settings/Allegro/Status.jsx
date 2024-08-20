import {Head, Link, router} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Box, Button, Card, CardActions, CardContent, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import moment from "moment";
import {Edit, Refresh} from "@mui/icons-material";

export default function Status(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const expiresTime = props.allegroToken ? moment(props.allegroToken.expires_at) : null
    const expiresRefreshTime = props.allegroToken ? moment(props.allegroToken.updated_at).add(3, 'month') : null
    const expired = props.allegroToken ? moment().diff(expiresTime) > 0 : true;
    const refreshExpired = props.allegroToken ? moment().diff(expiresRefreshTime) > 0 : true;
    const nextClosestTime = getNextClosestTime();

    const refreshToken = () => {
        router.post(route('system.settings.allegro.refreshToken'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar("Zlecono odświeżenie tokena", {variant: "success"});
            },
            onError: (error) => {
                enqueueSnackbar(t("Error refreshing token"), {variant: "error"});
                console.error(error)
            }
        });
    }

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Allegro Status")
            }
        >
            <Head title={t("Allegro Status")}/>

            <Card variant="outlined" sx={{position: "relative", bgcolor: expired ? "errorBg.main" : "successBg.main"}}>
                <CardContent>
                    {props.allegroToken ?
                        (
                            <>
                                <Typography variant={"h4"} sx={{mb: 2}}>
                                    Token Allegro
                                </Typography>

                                <Typography variant="body1" gutterBottom>
                                    Zalogowano: {moment(props.allegroToken.created_at).format("DD-MM-YYYY HH:mm:ss")}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Odświeżono
                                    token: {moment(props.allegroToken.updated_at).format("DD-MM-YYYY HH:mm:ss")}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Wygasa: {moment(props.allegroToken.expires_at).format("DD-MM-YYYY HH:mm:ss")}
                                </Typography>
                                <br/>
                                <Typography variant="body1" gutterBottom>
                                    Ostatnie możliwe
                                    przedłużenie tego
                                    tokenu: {expiresRefreshTime.format("DD-MM-YYYY HH:mm:ss")}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Planowane
                                    odświeżenie: {expired ? "Niezaplanowano" : nextClosestTime.format("DD-MM-YYYY HH:mm:ss")}
                                </Typography>
                                {!refreshExpired &&
                                    (
                                        <Box sx={{position: "absolute", top: 10, right: 15}}>
                                            <Tooltip title="Odśwież token" arrow>
                                                <IconButton aria-label="refresh" onClick={refreshToken}>
                                                    <Refresh/>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )
                                }

                            </>
                        )
                        :
                        (
                            <Typography variant={"h4"}>
                                Brak tokena Allegro
                            </Typography>
                        )
                    }

                </CardContent>
            </Card>
            {expired &&
                (
                    <Paper elevation={12} sx={{width: 500, bgcolor: "errorBg.main", p: 2, my: 2}}>
                        <Box sx={{my: 2, display: "flex", flexDirection: "column", gap: 1}}>
                            <Typography variant="h5" gutterBottom textAlign={"center"}>
                                Token Allegro wygasł
                            </Typography>
                            <Typography variant="body1" gutterBottom textAlign={"center"}>
                                Połącz aplikację ponownie z Allegro
                            </Typography>
                            <Box sx={{display: "flex", justifyContent: "center"}}>
                                <Link href={route('system.settings.allegro.getToken')}>
                                    <Button variant="outlined">
                                        Połącz z Allegro
                                    </Button>
                                </Link>
                            </Box>

                        </Box>
                    </Paper>


                )
            }

        </UserLayout>
    );
}


function getNextClosestTime() {
    const now = moment(); // Pobierz bieżący czas

    // Definiowanie godzin docelowych
    const targetTimes = [
        moment().hours(6).minutes(0).seconds(0),
        moment().hours(12).minutes(0).seconds(0),
        moment().hours(18).minutes(0).seconds(0),
        moment().hours(24).minutes(0).seconds(0)
    ];

    // Filtrujemy godziny, które jeszcze nie minęły w bieżącym dniu
    const futureTimes = targetTimes.filter(time => time.isAfter(now));

    // Jeżeli nie ma przyszłych godzin, to wybieramy pierwszą godzinę na następny dzień
    if (futureTimes.length === 0) {
        return targetTimes[0].add(1, 'days');
    }

    // Znajdujemy najbliższą przyszłą godzinę
    const closestTime = futureTimes.reduce((prev, curr) => curr.diff(now) < prev.diff(now) ? curr : prev);

    return closestTime;
}
