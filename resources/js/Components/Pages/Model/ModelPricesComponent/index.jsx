import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {useTheme} from "@mui/material/styles";

export default function ModelPricesComponent(props) {
    const theme = useTheme();
    return (
        <>
            <TableContainer component={Paper} elevation={5}>
                <Table aria-label="price table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cena</TableCell>
                            <TableCell>Cena Netto</TableCell>
                            <TableCell>Cena Brutto</TableCell>
                            <TableCell>Stawka VAT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{
                        '.MuiTableRow-root:nth-of-type(odd)': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}>
                        <TableRow>
                            <TableCell>Hurtowa</TableCell>
                            <TableCell>{Number(props.productModel.prices.wholesale_net_price / 100).toLocaleString(undefined, {minimumFractionDigits: 2})} {props.productModel.prices.currency}</TableCell>
                            <TableCell>{Number(props.productModel.prices.wholesale_gross_price / 100).toLocaleString(undefined, {minimumFractionDigits: 2})} {props.productModel.prices.currency}</TableCell>
                            <TableCell>{Number(props.productModel.prices.vat_rate).toLocaleString()} %</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Detaliczna</TableCell>
                            <TableCell>{Number(props.productModel.prices.retail_net_price / 100).toLocaleString(undefined, {minimumFractionDigits: 2})} {props.productModel.prices.currency}</TableCell>
                            <TableCell>{Number(props.productModel.prices.retail_gross_price / 100).toLocaleString(undefined, {minimumFractionDigits: 2})} {props.productModel.prices.currency}</TableCell>
                            <TableCell>{Number(props.productModel.prices.vat_rate).toLocaleString()} %</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


            <Typography></Typography>
        </>
    );

}
