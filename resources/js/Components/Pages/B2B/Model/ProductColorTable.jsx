import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { LocalOffer } from "@mui/icons-material";
import { sortByColorShortcut } from "@/Functions/sortByColorShortcut";
import { useState } from "react";
import toLocaleString from "@/Functions/toLocaleString";


export default function ProductColorTable({ model, lightbox, imageArray }) {
    const [hoveredColumn, setHoveredColumn] = useState(null);

    const HoveringCell = ({ children, column, sx = {}, ...rest }) => {
        return (
            <TableCell
                align={"center"}
                sx={{
                    bgcolor: column !== undefined && hoveredColumn === column ? "rgba(0, 0, 0, 0.04)" : "",
                    ...sx
                }}
                onMouseEnter={() => column !== undefined && setHoveredColumn(column)}
                onMouseLeave={() => column !== undefined && setHoveredColumn(null)}
                {...rest}
            >
                {children}
            </TableCell>
        )
    }

    const modelVariants = (model.models?.length > 0 ? model.models : [model]).map((variant) => ({
        ...variant,
        colors: variant.colors || (model.colors || []).filter((c) => !c.product_model_id || c.product_model_id === variant.id),
    }));
    const hasMultipleModels = modelVariants.length > 1;

    const renderVariantTable = (variant) => {
        const sortedColors = [...(variant.colors || [])].sort(sortByColorShortcut);
        const vPrice = variant.price;

        return (
            <Paper key={variant.id} sx={{ overflow: "hidden" }}>
                {hasMultipleModels && (
                    <Box sx={{ p: 1, pb: 0 }}>
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
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    Model {variant.symbol}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {variant.name}
                                </Typography>
                            </Box>
                            {vPrice?.is_promotion && (
                                <Chip
                                    icon={<LocalOffer sx={{ fontSize: "12px !important" }} />}
                                    label={vPrice.has_variable_prices ? "Warianty w promocji" : "PROMOCJA"}
                                    color="error"
                                    size="small"
                                    sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700 }}
                                />
                            )}
                        </Box>
                    </Box>
                )}
                <TableContainer sx={{ overflowX: "auto" }}>
                    <Table aria-label="color table">
                        <TableHead>
                            <TableRow>
                                {sortedColors.map(color => (
                                    <HoveringCell column={color.id} key={color.id}>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                            <span>{color.shortcut}</span>
                                            {color.price?.is_promotion && (
                                                <Chip
                                                    icon={<LocalOffer sx={{ fontSize: "12px !important" }} />}
                                                    label={color.price?.has_variable_prices ? "Warianty w promocji" : "PROMOCJA"}
                                                    color="error"
                                                    size="small"
                                                    sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                                                />
                                            )}
                                        </Box>
                                    </HoveringCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {sortedColors.map(color => (
                                    <HoveringCell column={color.id} key={color.id}>
                                        <Typography variant="body2">{color.name}</Typography>
                                        {color.price?.is_promotion && (
                                            <Typography variant="caption" color="error.main" sx={{ fontWeight: 700, display: "block" }}>
                                                {color.price?.has_variable_prices
                                                    ? `od ${toLocaleString(color.price.min_price_net / 100)} netto`
                                                    : `${toLocaleString(color.price.price_net / 100)} netto`}
                                            </Typography>
                                        )}
                                    </HoveringCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                {sortedColors.map(color => {
                                    const image = color.images?.find(i => i.order === 0);
                                    const imageIndex = image ? imageArray?.findIndex(i => i.id === image.id) : null;

                                    return (
                                        <HoveringCell column={color.id} key={color.id}>
                                            {image ?
                                                (
                                                    <Box component={"img"}
                                                        src={route("images.webp", { slug: image.slug })}
                                                        width={50}
                                                        onClick={() => lightbox.loadAndOpen(imageIndex)}
                                                        sx={{
                                                            m: "auto",
                                                            cursor: "pointer",
                                                            minWidth: 50
                                                        }}
                                                    />
                                                )
                                                :
                                                (
                                                    <Box component={"img"}
                                                        src={route("images.webp", { slug: "brak.jpg" })}
                                                        width={50}
                                                        sx={{
                                                            m: "auto",
                                                            minWidth: 50
                                                        }}
                                                    />
                                                )
                                            }
                                        </HoveringCell>
                                    )
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        );
    };

    if (!hasMultipleModels) {
        return renderVariantTable(modelVariants[0]);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {modelVariants.map((variant) => renderVariantTable(variant))}
        </Box>
    );
}
