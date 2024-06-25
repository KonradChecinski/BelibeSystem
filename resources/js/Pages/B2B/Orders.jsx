import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import moment from "moment";
import toLocaleString from "@/Functions/toLocaleString";

export default function B2bOrders(props) {
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
                t("Orders")
            }
        >
            <Head title={t("Orders")}/>
            <Paper sx={{width: 1, height: 1}}>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Numer zamówienia</TableCell>
                                <TableCell>Status</TableCell>

                                <TableCell>Ilość produktów</TableCell>
                                <TableCell>Miejsce dostawy</TableCell>
                                <TableCell>Dostawa</TableCell>
                                <TableCell>Płatność</TableCell>

                                <TableCell>Wartość Netto</TableCell>
                                <TableCell>Wartość Burtto</TableCell>

                                <TableCell>Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((order) => {

                                let statusText = "";
                                let statusColor = "";
                                switch (order.status) {
                                    case 1:
                                        statusText = "Złożone";
                                        statusColor = "success.main";
                                        break;
                                    case 2:
                                        statusText = "Zaakceptowane do realizacji";
                                        statusColor = "info.main";
                                        break;
                                    case 3:
                                        statusText = "W realizacji";
                                        statusColor = "info.main";
                                        break;
                                    case 4:
                                        statusText = "W realizacji";
                                        statusColor = "info.main";
                                        break;
                                    case 5:
                                        statusText = "Zrealizowane";
                                        statusColor = "";
                                        break;
                                    case 6:
                                        statusText = "Anulowane";
                                        statusColor = "error.main";
                                        break;
                                }

                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>{moment(order.created_at).format("DD.MM.YYYY HH:mm")}</TableCell>
                                        <TableCell>{order.number}</TableCell>
                                        <TableCell>

                                            <Typography variant="body2" color={statusColor}>
                                                {statusText}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{order.total_quantity}</TableCell>
                                        <TableCell>Dostawa</TableCell>
                                        <TableCell>{order.delivery.name}</TableCell>
                                        <TableCell>{order.payment.name}</TableCell>
                                        <TableCell>{toLocaleString(order.total_net / 100)}</TableCell>
                                        <TableCell>{toLocaleString(order.total_gross / 100)}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

        </ClientLayout>
    );
}
