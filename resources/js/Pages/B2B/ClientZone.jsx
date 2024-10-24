import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Avatar,
    Box,
    Divider,
    Grid,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Typography
} from "@mui/material";
import {Email, History, Payment, Phone, PhoneAndroid, ReceiptLong} from "@mui/icons-material";

export default function B2bMainPage(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            props={props}
            header={
                t("Client zone")
            }
        >
            <Head title={t("Client zone")}/>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{minHeight: 300, p: 2}}>
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
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{height: 1, p: 2}}>

                        <Typography variant="h5" gutterBottom sx={{pl: 1}}>
                            Skróty
                        </Typography>
                        <MenuList sx={{height: 1, display: "flex", flexDirection: "column"}}>
                            <Link href={route("b2b.orders")}>
                                <MenuItem sx={{height: 1, m: 1}}>
                                    <ListItemIcon>
                                        <History fontSize="large"/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        {t("Orders")}
                                    </ListItemText>
                                </MenuItem>
                            </Link>
                            <Link href={route("b2b.invoices")}>
                                <MenuItem sx={{height: 1, m: 1}}>
                                    <ListItemIcon>
                                        <ReceiptLong fontSize="large"/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        {t("Invoices")}
                                    </ListItemText>
                                </MenuItem>
                            </Link>
                            <Link href={route("b2b.settlements")}>
                                <MenuItem sx={{height: 1, m: 1}}>
                                    <ListItemIcon>
                                        <Payment fontSize="large"/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        {t("Settlements")}
                                    </ListItemText>
                                </MenuItem>
                            </Link>
                        </MenuList>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Paper sx={{height: 300, p: 2}}>

                        <Typography variant="h5" gutterBottom component="h5">
                            Twój opiekun
                        </Typography>
                        <Box
                            sx={{
                                width: 1,
                                height: 1,
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
                </Grid>
            </Grid>


        </ClientLayout>
    );
}
