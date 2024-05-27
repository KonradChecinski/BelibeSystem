import {useSnackbar} from "notistack";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {Summarize} from "@mui/icons-material";

export default function OrderSummary({data}) {

    const ProductsGross = data?.order.total_gross;

    const deliveryGross = data?.order.delivery_gross;

    const totalGross = ProductsGross + deliveryGross;

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
                                {toLocaleString(ProductsGross)}
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
                                {toLocaleString(deliveryGross)}
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
                                {toLocaleString(totalGross)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
