import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Button, Card, CardActions, CardContent, Paper, Typography} from "@mui/material";

export default function Status(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Allegro Get Token")
            }
        >
            <Head title={t("Allegro Get Token")}/>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h4" sx={{mb: 2}}>
                        Łączenie z Allegro
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        W celu połączenia aplikacji z Allegro potrzebne jest zalogowanie i potwierdzenie dostępu
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Poniższy przycisk rozpocznie procedurę łączenia
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{color: "error.main"}}>
                        Rozpocznij łączenie tylko wtedy gdy token wygasł
                    </Typography>
                    <br/>
                    <a
                        href={"https://allegro.pl/auth/oauth/authorize?" +
                            `response_type=code&client_id=${props.client_id}` +
                            `&redirect_uri=${route("system.settings.allegro.token")}` +
                            "&code_challenge_method=S256" +
                            `&code_challenge=${props.code_challenge}`}
                    >
                        <Button variant="outlined">
                            Połącz z Allegro
                        </Button>
                    </a>

                </CardContent>

            </Card>


        </UserLayout>
    );
}
