import {Box, Divider, Paper, Typography} from "@mui/material";
import {Email, Phone} from "@mui/icons-material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function ClientBasicInfo(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    return (
        <Paper sx={{minHeight: 300, height: 1, p: 2}}>
            <Box>
                <Typography variant="h3" component="h4">
                    {props.client.name}
                </Typography>
                <Typography variant="body1" gutterBottom component="h4">
                    NIP: {props.client.nip}
                </Typography>

                <Divider sx={{my: 2}}/>

                <Typography variant="body1" gutterBottom component="h4">
                    {props.client.street} {props.client.building_number}{props.client.apartment_number ? "/" + props.client.apartment_number : ""}
                </Typography>
                <Typography variant="body1" gutterBottom component="h4">
                    {props.client.postal_code}, {props.client.city}
                </Typography>
                <Typography variant="body1" gutterBottom component="h4">
                    {props.client.country.name}
                </Typography>

                <Divider sx={{my: 2}}/>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                        <Email fontSize="large"/>
                        <Typography variant="body1" component="h4">
                            {props.client.email}
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                        <Phone fontSize="large"/>
                        <Typography variant="body1" component="h4">
                            {props.client.phone}
                        </Typography>
                    </Box>
                </Box>


            </Box>
        </Paper>
    )
}
