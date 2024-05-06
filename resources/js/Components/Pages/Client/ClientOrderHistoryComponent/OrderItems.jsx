import {
    Box, debounce,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {sortBySizesSortFunction} from "@/Functions/sortBySizes";
import {router} from "@inertiajs/react";
import toLocaleString from "@/Functions/toLocaleString";
import {Delete} from "@mui/icons-material";
import {useSnackbar} from "notistack";

export default function OrderItems({data}) {

    let index = 1;
    return (
        <Paper>

            <Box
                sx={{
                    overflowY: "auto",
                    overflowX: "auto",
                    width: 1,
                    minHeight: 200,
                    maxHeight: 800
                }}>


                <TableContainer component={Paper} sx={{overflowX: "initial", width: 1}}>
                    <Table
                        aria-label="simple table"
                        stickyHeader={true}
                        sx={{
                            "& th": {
                                top: 0,
                            },
                            "& th:first-of-type": {
                                borderRadius: 1,
                                borderBottomRightRadius: 0,
                                borderTopRightRadius: 0,

                                borderTopLeftRadius: 0,
                            },
                            "& th:last-of-type": {
                                borderRadius: 1,
                                borderBottomLeftRadius: 0,
                                borderTopLeftRadius: 0,

                                borderTopRightRadius: 0,
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align={"center"} sx={{width: 20}}>Lp.</TableCell>
                                <TableCell align={"center"}>Rozmiar</TableCell>
                                <TableCell align={"center"}>Cena Netto</TableCell>
                                <TableCell align={"center"}>Cena Brutto</TableCell>
                                <TableCell align={"center"}>Ilość</TableCell>
                                <TableCell align={"center"}>Suma Netto</TableCell>
                                <TableCell align={"center"}>Suma Brutto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.productModels.map((model) => {

                                return (
                                    <Fragment key={"model" + model.id}>
                                        <TableRow>
                                            <th colSpan={8}
                                                // style={{position: "sticky", top: 120}}
                                            >
                                                <Box sx={{
                                                    mt: 2,
                                                    px: 2,
                                                    borderBottom: "1px solid",
                                                    borderColor: "divider",
                                                    // bgcolor: "green"
                                                }}>
                                                    <Typography variant="h4" align={"left"}>
                                                        Model {model.symbol}
                                                    </Typography>
                                                </Box>

                                            </th>
                                        </TableRow>


                                        {data.productColors.filter(color => color.product_model_id === model.id).sort(sortByColorShortcut).map((color) => {
                                            return (
                                                <Fragment key={"color" + color.id}>
                                                    <TableRow>
                                                        <td colSpan={8}
                                                            // style={{position: "sticky", top: 150}}
                                                        >
                                                            <Box sx={{
                                                                mt: 2,
                                                                px: 3,
                                                                pb: 2,
                                                                borderBottom: "1px solid",
                                                                borderColor: "divider",
                                                                display: "flex",
                                                                // bgcolor: "blue",
                                                                // zIndex: 500

                                                            }}>
                                                                <Box component={"img"}
                                                                     src={route("images.webp", {path: color.images[0].path})}
                                                                     width={50}
                                                                     sx={{
                                                                         // m: "auto",
                                                                         // cursor: "pointer",
                                                                         mr: 2
                                                                     }}
                                                                />
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    justifyContent: "center",
                                                                }}>
                                                                    <Typography variant="h6" gutterBottom>
                                                                        Kolor {color.shortcut}
                                                                    </Typography>
                                                                    <Typography variant="h6" gutterBottom>
                                                                        {color.name}
                                                                    </Typography>
                                                                </Box>


                                                            </Box>

                                                        </td>
                                                    </TableRow>


                                                    {data?.products.filter(product => product.product_model_color_id === color.id).sort((a, b) => sortBySizesSortFunction(a.size.name, b.size.name)).map((product, i) => {
                                                        const item = data.orderProducts.find(item => item.product_id === product.id);
                                                        return (
                                                            <Fragment key={"product" + product.id}>
                                                                <TableRow hover>

                                                                    <TableCell align={"center"}>
                                                                        <Typography variant="body1">
                                                                            {index++}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align={"center"}>
                                                                        <Typography variant="body1">
                                                                            {product.size.name}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell align={"center"}>
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_net / 100)}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align={"center"}>
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_gross / 100)}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align={"center"} sx={{p: 0}}>
                                                                        <Typography variant="body1">
                                                                            {item.quantity}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align={"center"}>
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_net / 100 * item.quantity)}
                                                                        </Typography>

                                                                    </TableCell>
                                                                    <TableCell align={"center"}>
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_gross / 100 * item.quantity)}
                                                                        </Typography>

                                                                    </TableCell>
                                                                </TableRow>
                                                            </Fragment>

                                                        );
                                                    })}
                                                </Fragment>
                                            );
                                        })
                                        }
                                    </Fragment>
                                );
                            })}

                        </TableBody>
                    </Table>

                </TableContainer>
            </Box>
        </Paper>
    );
}
