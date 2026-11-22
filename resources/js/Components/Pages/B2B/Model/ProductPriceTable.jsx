import {Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {LocalOffer} from "@mui/icons-material";
import {Fragment, useState} from "react";


export default function ProductPriceTable({model}) {
    const [hoveredColumn, setHoveredColumn] = useState(null);
    const modelVariants = model.models?.length > 0 ? model.models : [model];
    const hasMultipleModels = modelVariants.length > 1;

    function currencyNumberPrice(number, currency = model.price.currency) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2}) + " " + currency);
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
                    {modelVariants.map((variant) => {
                        const vPrice = variant.price;
                        const hasDiscountedModelPrice = vPrice.original_price_net &&
                            vPrice.price_net < vPrice.original_price_net &&
                            (vPrice.show_discount_on_invoice || vPrice.is_promotion);

                        return (
                            <Fragment key={variant.id}>
                                {hasMultipleModels && (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{p: 1, bgcolor: "background.paper"}}>
                                            <Box sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                flexWrap: "wrap",
                                                gap: 1,
                                                px: 1.5,
                                                py: 0.75,
                                                bgcolor: "action.hover",
                                                borderLeft: "4px solid",
                                                borderColor: vPrice?.is_promotion ? "error.main" : "primary.main",
                                                borderRadius: 1,
                                            }}>
                                                <Box sx={{display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap"}}>
                                                    <Typography variant="subtitle1" sx={{fontWeight: 700}}>
                                                        Model {variant.symbol}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {variant.name}
                                                    </Typography>
                                                </Box>
                                                {vPrice?.is_promotion && (
                                                    <Chip
                                                        icon={<LocalOffer sx={{fontSize: "12px !important"}}/>}
                                                        label={vPrice.has_variable_prices ? "Warianty w promocji" : "PROMOCJA"}
                                                        color="error"
                                                        size="small"
                                                        sx={{height: 22, fontSize: "0.7rem", fontWeight: 700}}
                                                    />
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {hasDiscountedModelPrice && (
                                    <TableRow>
                                        <HoveringCell column={1} priceDiscount={true}>
                                            {currencyNumberPrice(vPrice.original_price_net, vPrice.currency)}
                                        </HoveringCell>
                                        <HoveringCell column={2} priceDiscount={true}>
                                            {currencyNumberPrice(vPrice.original_price_gross, vPrice.currency)}
                                        </HoveringCell>
                                        <HoveringCell column={3} priceDiscount={true}>
                                            {vPrice.vat_rate} %
                                        </HoveringCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <HoveringCell column={1} sx={vPrice.is_promotion && !vPrice.has_variable_prices ? {color: "error.main", fontWeight: 700} : {}}>
                                        {currencyNumberPrice(vPrice.price_net, vPrice.currency)}
                                    </HoveringCell>
                                    <HoveringCell column={2} sx={vPrice.is_promotion && !vPrice.has_variable_prices ? {color: "error.main", fontWeight: 700} : {}}>
                                        {currencyNumberPrice(vPrice.price_gross, vPrice.currency)}
                                    </HoveringCell>
                                    <HoveringCell column={3}>
                                        {vPrice.vat_rate} %
                                    </HoveringCell>
                                </TableRow>
                                {vPrice.has_variable_prices && (
                                    <TableRow sx={{bgcolor: "rgba(211, 47, 47, 0.06)"}}>
                                        <TableCell colSpan={3} align="center">
                                            <Chip
                                                icon={<LocalOffer/>}
                                                label={`Promocja na wybrane kolory / rozmiary: od ${currencyNumberPrice(vPrice.min_price_net, vPrice.currency)} netto (${currencyNumberPrice(vPrice.min_price_gross, vPrice.currency)} brutto)`}
                                                color="error"
                                                size="small"
                                                sx={{fontWeight: 700}}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
