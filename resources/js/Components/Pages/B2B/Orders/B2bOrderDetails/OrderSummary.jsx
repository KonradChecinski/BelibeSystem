import {useSnackbar} from "notistack";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {Summarize} from "@mui/icons-material";

export default function OrderSummary({data}) {

    const ProductsNet = data?.order.total_net;
    const ProductsGross = data?.order.total_gross;

    const deliveryNet = data?.order.delivery_net;
    const deliveryGross = data?.order.delivery_gross;

    const paymentNet = data?.order.discounted_total_net - data?.order.total_net;
    const paymentGross = data?.order.discounted_total_gross - data?.order.total_gross;

    const totalNet = ProductsNet + deliveryNet + paymentNet;
    const totalGross = ProductsGross + deliveryGross + paymentGross;

    return (
        <TableContainer component={Paper} sx={{my: 2}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", m: 2}}>
                <Summarize sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Podsumowanie koszyka
                </Typography>
            </Box>

            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                Wartość Netto
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                VAT
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                Wartość Brutto
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow hover>
                        <TableCell>
                            <Typography variant="body1">
                                Wartość koszyka
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(ProductsNet / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString((ProductsGross - ProductsNet) / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(ProductsGross / 100)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow hover>
                        <TableCell>
                            <Typography variant="body1">
                                Płatność ({data?.order.discount}%)
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(paymentNet / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString((paymentGross - paymentNet) / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(paymentGross / 100)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow hover>
                        <TableCell>
                            <Typography variant="body1">
                                Dostawa
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(deliveryNet / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString((deliveryGross - deliveryNet) / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(deliveryGross / 100)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow hover>
                        <TableCell>
                            <Typography variant="body1">
                                Razem
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(totalNet / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString((totalGross - totalNet) / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(totalGross / 100)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
