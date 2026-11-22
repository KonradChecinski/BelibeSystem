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

    if (hasMultipleModels) {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="price table">
                    <TableHead>
                        <TableRow>
                            <HoveringCell column={0} sx={{fontWeight: 700}}>Model</HoveringCell>
                            <HoveringCell column={1} sx={{fontWeight: 700}}>Netto</HoveringCell>
                            <HoveringCell column={2} sx={{fontWeight: 700}}>Brutto</HoveringCell>
                            <HoveringCell column={3} sx={{fontWeight: 700}}>VAT</HoveringCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modelVariants.map((variant) => {
                            const vPrice = variant.price;
                            const hasDiscount = vPrice.original_price_net &&
                                vPrice.price_net < vPrice.original_price_net &&
                                (vPrice.show_discount_on_invoice || vPrice.is_promotion);

                            return (
                                <Fragment key={variant.id}>
                                    <TableRow hover>
                                        <HoveringCell column={0}>
                                            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5}}>
                                                <Typography variant="subtitle2" sx={{fontWeight: 700}}>
                                                    {variant.symbol}
                                                </Typography>
                                                {vPrice.is_promotion && (
                                                    <Chip
                                                        icon={<LocalOffer sx={{fontSize: "12px !important"}}/>}
                                                        label={vPrice.has_variable_prices ? "Warianty w promocji" : "PROMOCJA"}
                                                        color="error"
                                                        size="small"
                                                        sx={{height: 20, fontSize: "0.65rem", fontWeight: 700}}
                                                    />
                                                )}
                                            </Box>
                                        </HoveringCell>
                                        <HoveringCell column={1}>
                                            {hasDiscount && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{textDecoration: "line-through", display: "block"}}
                                                >
                                                    {currencyNumberPrice(vPrice.original_price_net, vPrice.currency)}
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="body2"
                                                sx={vPrice.is_promotion && !vPrice.has_variable_prices ? {color: "error.main", fontWeight: 700} : {fontWeight: 600}}
                                            >
                                                {currencyNumberPrice(vPrice.price_net, vPrice.currency)}
                                            </Typography>
                                        </HoveringCell>
                                        <HoveringCell column={2}>
                                            {hasDiscount && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{textDecoration: "line-through", display: "block"}}
                                                >
                                                    {currencyNumberPrice(vPrice.original_price_gross, vPrice.currency)}
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="body2"
                                                sx={vPrice.is_promotion && !vPrice.has_variable_prices ? {color: "error.main", fontWeight: 700} : {fontWeight: 600}}
                                            >
                                                {currencyNumberPrice(vPrice.price_gross, vPrice.currency)}
                                            </Typography>
                                        </HoveringCell>
                                        <HoveringCell column={3}>
                                            {vPrice.vat_rate} %
                                        </HoveringCell>
                                    </TableRow>
                                    {vPrice.has_variable_prices && (
                                        <TableRow sx={{bgcolor: "rgba(211, 47, 47, 0.06)"}}>
                                            <TableCell colSpan={4} align="center" sx={{py: 0.75}}>
                                                <Chip
                                                    icon={<LocalOffer/>}
                                                    label={`${variant.symbol} — promocja na wybrane kolory / rozmiary: od ${currencyNumberPrice(vPrice.min_price_net, vPrice.currency)} netto (${currencyNumberPrice(vPrice.min_price_gross, vPrice.currency)} brutto)`}
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
