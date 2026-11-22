import {Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {LocalOffer} from "@mui/icons-material";
import {useState} from "react";


export default function ProductPriceTable({model}) {
    const [hoveredColumn, setHoveredColumn] = useState(null);

    function currencyNumberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2}) + " " + model.price.currency);
    }

    const HoveringCell = ({children, column, priceDiscount = false, sx = {}}) => {
        return (
            <TableCell
                align={"center"}
                sx={{
                    bgcolor: hoveredColumn === column ? "rgba(0, 0, 0, 0.04)" : "",
                    textDecoration: priceDiscount ? "line-through" : "",
                    ...sx
                }}
                onMouseEnter={() => setHoveredColumn(column)}
                onMouseLeave={() => setHoveredColumn(null)}
            >
                {children}
            </TableCell>
        )
    }

    const hasDiscountedModelPrice = model.price.original_price_net &&
        model.price.price_net < model.price.original_price_net &&
        (model.price.show_discount_on_invoice || model.price.is_promotion);

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
                    {hasDiscountedModelPrice &&
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
                        <HoveringCell column={1} sx={model.price.is_promotion && !model.price.has_variable_prices ? {color: "error.main", fontWeight: 700} : {}}>
                            {currencyNumberPrice(model.price.price_net)}
                        </HoveringCell>
                        <HoveringCell column={2} sx={model.price.is_promotion && !model.price.has_variable_prices ? {color: "error.main", fontWeight: 700} : {}}>
                            {currencyNumberPrice(model.price.price_gross)}
                        </HoveringCell>
                        <HoveringCell column={3}>
                            {model.price.vat_rate} %
                        </HoveringCell>
                    </TableRow>
                    {model.price.has_variable_prices && (
                        <TableRow sx={{bgcolor: "rgba(211, 47, 47, 0.06)"}}>
                            <TableCell colSpan={3} align="center">
                                <Chip
                                    icon={<LocalOffer/>}
                                    label={`Promocja na wybrane kolory / rozmiary: od ${currencyNumberPrice(model.price.min_price_net)} netto (${currencyNumberPrice(model.price.min_price_gross)} brutto)`}
                                    color="error"
                                    size="small"
                                    sx={{fontWeight: 700}}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>

    );
}
