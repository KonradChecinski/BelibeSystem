import {Avatar, Box, Paper, Typography} from "@mui/material";
import {Email, PhoneAndroid} from "@mui/icons-material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function ClientAccountManager(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    return (
        <Paper sx={{height: 1, p: 2}}>

            <Typography variant="h5" gutterBottom component="h5">
                {t("Your account manager")}
            </Typography>
            <Box
                sx={{
                    width: 1,
                    // height: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2
                }}>
                <Box>
                    <Avatar
                        alt={"Zdjęcie opiekuna"}
                        src={props.client.account_manager.icon}
                        sx={{height: 200, width: 200}}
                    />
                </Box>
                <Box>

                    <Typography variant="h2" gutterBottom component="h2">
                        {props.client.account_manager.name}
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                        <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                            <Email fontSize="large"/>
                            <Typography variant="body1" component="h4">
                                {props.client.account_manager.email}
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                            <PhoneAndroid fontSize="large"/>
                            <Typography variant="body1" component="h4">
                                {props.client.account_manager.phone}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

        </Paper>
    )
}
