import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { LocalOffer } from "@mui/icons-material";
import { sortByColorShortcut } from "@/Functions/sortByColorShortcut";
import { useState } from "react";
import toLocaleString from "@/Functions/toLocaleString";


export default function ProductColorTable({ model, lightbox, imageArray }) {
    const [hoveredColumn, setHoveredColumn] = useState(null);

    const HoveringCell = ({ children, column }) => {
        return (
            <TableCell
                align={"center"}
                sx={{ bgcolor: hoveredColumn === column ? "rgba(0, 0, 0, 0.04)" : "" }}
                onMouseEnter={() => setHoveredColumn(column)}
                onMouseLeave={() => setHoveredColumn(null)}
            >
                {children}
            </TableCell>
        )
    }

    const modelVariants = model.models?.length > 0 ? model.models : [model];
    const hasMultipleModels = modelVariants.length > 1;
    const sortedColors = modelVariants.flatMap((variant) =>
        [...(variant.colors || [])].sort(sortByColorShortcut)
    );

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {sortedColors.map(color => (
                            <HoveringCell column={color.id} key={color.id}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                    {hasMultipleModels && color.product_model_symbol && (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
                                            {color.product_model_symbol}
                                        </Typography>
                                    )}
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

    );
}
