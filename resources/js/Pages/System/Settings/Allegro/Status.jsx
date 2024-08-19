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
                t("Allegro Status")
            }
        >
            <Head title={t("Allegro Status")}/>
            <Paper sx={{height: 1, width: 1}}>
                {props.allegroToken ?
                    (
                        <>
                        </>
                    )
                    :
                    (
                        <Link href={route('system.settings.allegro.getToken')}>

                            <Button variant="outlined">
                                Zaloguj się
                            </Button>
                        </Link>
                    )
                }


            </Paper>

        </UserLayout>
    );
}
