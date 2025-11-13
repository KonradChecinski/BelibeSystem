import {useSnackbar} from "notistack";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {Summarize} from "@mui/icons-material";

export default function CartSummary({props, data, paymentDiscount}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const ProductsNet = props.cartPriceSummary.total_net;
    const ProductsGross = props.cartPriceSummary.total_gross;

    const ProductsOriginalNet = props.cartPriceSummary.total_original_net;
    const ProductsOriginalGross = props.cartPriceSummary.total_original_gross;

    const deliveryNet = data.delivery ? ProductsNet > data.delivery.free_from ? 0 : data.delivery.price_net : 0;
    const deliveryGross = data.delivery ? ProductsNet > data.delivery.free_from ? 0 : data.delivery.price_gross : 0;

    const cartGroupedByVat = Object.groupBy(props.cart, (entries, index) => {
        return entries.vat_rate;
    })
    const discountedPriceSummaryGroupByVat = []
    for (const vat_rate in cartGroupedByVat) {
        let totalNet = cartGroupedByVat[vat_rate].reduce((acc, item) => {
            acc += (Math.round(item.price_net * (100 - paymentDiscount) / 100) * item.quantity)
            return acc
        }, 0)
        let totalGross = Math.round(totalNet * (1 + vat_rate / 100));

        discountedPriceSummaryGroupByVat[vat_rate] = {
            totalNet: totalNet,
            totalGross: totalGross,
            vatRate: vat_rate
        }
    }
    const discountedPriceSummary = discountedPriceSummaryGroupByVat.reduce((acc, item) => {
        acc.totalNet += item.totalNet
        acc.totalGross += item.totalGross
        return acc
    }, {totalNet: 0, totalGross: 0})

    const paymentNet = paymentDiscount === 0 ? 0 : discountedPriceSummary.totalNet - ProductsNet
    const paymentGross = paymentDiscount === 0 ? 0 : discountedPriceSummary.totalGross - ProductsGross

    const totalNet = discountedPriceSummary.totalNet
    const totalGross = discountedPriceSummary.totalGross

    const totalNetWithDelivery = totalNet + deliveryNet;
    const totalGrossWithDelivery = totalGross + deliveryGross;

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
                            {ProductsNet !== ProductsOriginalNet &&
                                (<Typography variant="body1"
                                             sx={{
                                                 textDecoration: "line-through",
                                                 opacity: 0.8,
                                             }}
                                >
                                    {toLocaleString(ProductsOriginalNet / 100)}
                                </Typography>)}
                            <Typography variant="body1">
                                {toLocaleString(ProductsNet / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            {ProductsNet !== ProductsOriginalNet &&
                                (<Typography variant="body1"
                                             sx={{
                                                 textDecoration: "line-through",
                                                 opacity: 0.8,
                                             }}
                                >
                                    {toLocaleString((ProductsOriginalGross - ProductsOriginalNet) / 100)}
                                </Typography>)}
                            <Typography variant="body1">
                                {toLocaleString((ProductsGross - ProductsNet) / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            {ProductsNet !== ProductsOriginalNet &&
                                (<Typography variant="body1"
                                             sx={{
                                                 textDecoration: "line-through",
                                                 opacity: 0.8,
                                             }}
                                >
                                    {toLocaleString(ProductsOriginalGross / 100)}
                                </Typography>)}
                            <Typography variant="body1">
                                {toLocaleString(ProductsGross / 100)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow hover>
                        <TableCell>
                            <Typography variant="body1">
                                Płatność {paymentDiscount !== 0 && `(${paymentDiscount}%)`}
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
                                {toLocaleString(totalNetWithDelivery / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString((totalGrossWithDelivery - totalNetWithDelivery) / 100)}
                            </Typography>
                        </TableCell>
                        <TableCell align={"center"}>
                            <Typography variant="body1">
                                {toLocaleString(totalGrossWithDelivery / 100)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
