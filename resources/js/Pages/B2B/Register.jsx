import {Head, Link} from "@inertiajs/react";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import BeforeLoginLayout from "@/Layouts/BeforeLoginLayout";
import {Box, Button, Typography} from "@mui/material";
import {Email, Phone, PhoneAndroid} from "@mui/icons-material";

export default function B2bRegister(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <BeforeLoginLayout background={props.backgroundImage}>

            <Head title={t("Register")}/>
            <Typography variant="body1" gutterBottom textAlign={"center"}>
                Skontaktuj sie z nami w celu rozpoczęcia współpracy
            </Typography>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2, alignItems: "center", mt: 2}}>
                <a href={"mailto:biuro@belibe.pl"}>
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        "&:hover": {transform: "scale(1.1)", color: "#eeeeee"}
                    }}>
                        <Email fontSize="large"/>
                        <Typography variant="body1" component="h4">
                            biuro@belibe.pl
                        </Typography>
                    </Box>
                </a>
                <a href={"tel:+48322676185"}>
                    <Box sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        "&:hover": {transform: "scale(1.1)", color: "#eeeeee"}
                    }}>
                        <Phone fontSize="large"/>

                        <Typography variant="body1" component="h4">
                            +48 32 267 61 85
                        </Typography>

                    </Box>
                </a>
            </Box>
            <Box sx={{mt: 3, width: 1, display: "flex", justifyContent: "center"}}>
                <Link href={route(props.routeLogin)}>
                    <Button variant="contained">{t("Already registered?")}</Button>
                </Link>
            </Box>


        </BeforeLoginLayout>
    );
}
