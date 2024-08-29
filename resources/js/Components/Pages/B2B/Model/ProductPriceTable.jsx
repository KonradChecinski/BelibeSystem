import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useState} from "react";


export default function ProductPriceTable({model}) {
    const [hoveredColumn, setHoveredColumn] = useState(null);

    function currencyNumberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2}) + " " + model.price.currency);
    }

    const HoveringCell = ({children, column, priceDiscount = false}) => {
        return (
            <TableCell
                align={"center"}
                sx={{
                    bgcolor: hoveredColumn === column ? "rgba(0, 0, 0, 0.04)" : "",
                    textDecoration: priceDiscount ? "line-through" : "",
                }}
                onMouseEnter={() => setHoveredColumn(column)}
                onMouseLeave={() => setHoveredColumn(null)}
            >
                {children}
            </TableCell>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <HoveringCell column={1}>Netto</HoveringCell>
                        <HoveringCell column={2}>Brutto</HoveringCell>
                        <HoveringCell column={3}>VAT</HoveringCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {model.price.show_discount_on_invoice &&
                        (
                            <TableRow>
                                <HoveringCell column={1} priceDiscount={true}>
                                    {currencyNumberPrice(model.price.original_price_net)}
                                </HoveringCell>
                                <HoveringCell column={2} priceDiscount={true}>
                                    {currencyNumberPrice(model.price.original_price_gross)}
                                </HoveringCell>
                                <HoveringCell column={3} priceDiscount={true}>
                                    {model.price.vat_rate} %
                                </HoveringCell>
                            </TableRow>
                        )}
                    <TableRow>
                        <HoveringCell column={1}>
                            {currencyNumberPrice(model.price.price_net)}
                        </HoveringCell>
                        <HoveringCell column={2}>
                            {currencyNumberPrice(model.price.price_gross)}
                        </HoveringCell>
                        <HoveringCell column={3}>
                            {model.price.vat_rate} %
                        </HoveringCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

    );
}
