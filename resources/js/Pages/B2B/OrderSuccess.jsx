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
import moment from "moment";

export default function B2bOrderSuccess(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const dayNames = [
        "niedziela",
        "poniedziałek",
        "wtorek",
        "środa",
        "czwartek",
        "piątek",
        "sobota",
    ];

    const processTime = {
        min: moment(props.order.created_at).add(props.processTime.min, 'days'),
        max: moment(props.order.created_at).add(props.processTime.max, 'days')
    }


    return (
        <ClientLayout
            props={props}

            // header={
            //     t("Zamówienie: ") + 1 + " " + t("zostało złożone")
            // }
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
                            Nasz zespół już zajmuje się twoim zamówieniem.
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
                        {/*<Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>*/}
                        {/*    Czas realizacji tego zamówienia wraz z dostawą*/}
                        {/*    wynosi {props.processTime.min}-{props.processTime.max} dni.*/}
                        {/*</Typography>*/}
                        {/*<Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>*/}
                        {/*    A to oznacza, że twoja paczka powinna być w wyznaczonym przez Ciebie punkcie*/}
                        {/*    w {dayNames[moment(props.order.created_at).add(props.processTime.min, 'days').day()]} - {dayNames[moment(props.order.created_at).add(props.processTime.max, 'days').day()]}.*/}
                        {/*</Typography>*/}
                        <Typography variant="h5" sx={{mb: 2}} textAlign={"center"}>
                            Przewidywana dostawa:
                        </Typography>
                        <Typography variant="h6" sx={{mb: 2}} textAlign={"center"}>
                            {dayNames[processTime.min.day()]} - {dayNames[processTime.max.day()]}, {processTime.min.format("LL").slice(0, -5)} - {processTime.max.format("LL").slice(0, -5)}

                        </Typography>
                    </Box>

                    <Box>
                        <Link href={route("b2b.main")}>
                            <Button variant="outlined" startIcon={<Home/>}>Wróć do strony głównej</Button>
                        </Link>
                    </Box>
                </Box>

            </Paper>


        </ClientLayout>
    );
}
