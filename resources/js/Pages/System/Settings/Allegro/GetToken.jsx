import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Button, Paper} from "@mui/material";

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
            <Paper sx={{height: 1, width: 1}}>
                <a
                    href={"https://allegro.pl/auth/oauth/authorize?" +
                        `response_type=code&client_id=${props.client_id}` +
                        `&redirect_uri=${route("system.settings.allegro.token")}` +
                        "&code_challenge_method=S256" +
                        `&code_challenge=${props.code_challenge}`}
                >
                    <Button variant="outlined">
                        Zaloguj się w Allegro
                    </Button>
                </a>

            </Paper>

        </UserLayout>
    );
}
