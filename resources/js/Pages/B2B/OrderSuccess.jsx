import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button, Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {DeliveryAnimation} from "@/Icons/DeliveryAnimation";
import {CheckCircle, Home} from "@mui/icons-material";
import toLocaleString from "@/Functions/toLocaleString";

export default function B2bOrderSuccess(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            accountManager={props.accountManager}
            cart={props.cartSummary}
            clientId={props.clientId}
            blacklist={props.blacklist}
            header={
                t("Zamówienie: ") + 1 + " " + t("zostało złożone")
            }
        >
            <Head title={t("Zamówienie: ") + 1 + " " + t("zostało złożone")}/>
            <Paper sx={{minWidth: 1, minHeight: 1, mb: 1}}>
                <Box sx={{
                    width: 1,
                    height: 1,
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <Box sx={{
                        width: 1,
                        my: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}>
                        <CheckCircle sx={{fontSize: 95, mt: 4, mb: 2}} color={"success"}/>
                        <Typography variant="h4">
                            Twoje zamówienie zostało złożone
                        </Typography>
                    </Box>
                    <Divider flexItem sx={{my: 2}}/>
                    <Box sx={{my: 1}}>
                        <Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>
                            Numer zamówienia: {props.order.number}
                        </Typography>
                        <TableContainer component={Paper} elevation={8}>
                            <Table aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Ilość produktów</TableCell>
                                        <TableCell>{props.order.total_quantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Wartość produktów</TableCell>
                                        <TableCell>{toLocaleString(props.order.discounted_total_net / 100)} ({toLocaleString(props.order.discounted_total_gross / 100)} Brutto)</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Dostawa</TableCell>
                                        <TableCell>{toLocaleString(props.order.delivery_net / 100)} ({toLocaleString(props.order.delivery_gross / 100)} Brutto)</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>
                    <Box sx={{my: 1}}>
                        <Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>
                            Dziękujemy za złożenie zamówienia.
                        </Typography>
                        <Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>
                            Nasz zespoł zaraz zajmie się twoim zamówieniem.
                        </Typography>
                        <Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>
                            Po zaakceptowaniu zamówienia otrzymasz potwierdzenie na twój adres email.
                        </Typography>
                        <Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>
                            W razie pytań prosimy o kontakt z twoim opiekunem.
                        </Typography>
                    </Box>

                    <Box sx={{
                        width: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}>
                        <DeliveryAnimation style={{width: "100%", height: "100%", transform: "scale(1)"}}/>
                        <Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>
                            {}
                            Czas realizacji wraz z dostawą wynosi 3-5 dni roboczych.
                        </Typography>
                    </Box>

                    <Box>
                        <Button variant="outlined" startIcon={<Home/>}>Wróć do strony głównej</Button>
                    </Box>
                </Box>

            </Paper>


        </ClientLayout>
    );
}
