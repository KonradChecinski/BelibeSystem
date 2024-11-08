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

export default function OrderItemsEdit({data}) {

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
                                                                     src={route("images.webp", {slug: color.images[0].slug})}
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
                                                                        <ProductInput
                                                                            product={product}
                                                                            order={data.order}
                                                                            maxQuantity={product.quantity + item.quantity}
                                                                            initialValue={item.quantity}
                                                                        />

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


const ProductInput = ({product, order, maxQuantity, initialValue}) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    let quantityText = "";
    let quantityColor = "";
    switch (true) {
        case maxQuantity === 0:
            quantityText = "Brak";
            quantityColor = "error.main";
            break;
        case maxQuantity <= 5:
            quantityText = "Ostatnie sztuki!";
            quantityColor = "warning.main";
            break;
        case maxQuantity <= 10:
            quantityText = "Mała ilość";
            quantityColor = "warning.main";
            break;
        case maxQuantity <= 20:
            quantityText = "Średnia ilość";
            quantityColor = "info.main";
            break;
        default:
            quantityText = "Duża ilość";
            quantityColor = "success.main";
            break;
    }
    const send = useCallback((value, oldValue) => {
        router.post(route('system.b2b.order.update.product', {product: product?.id, clientOrder: order.id}), {
            quantity: value
        }, {
            preserveScroll: true,
            onSuccess: (response) => {
                enqueueSnackbar("Zmieniono ilość produktu " + product.symbol + " w koszyku na " + value, {variant: "success"})
            },
            onError: (error) => {
                enqueueSnackbar("Błąd przy zmienianiu ilości produktu " + product.symbol + " w koszyku na " + value, {variant: 'error'})
                console.error(error.response.data.errors)
                if (error.response.data.errors.quantity) enqueueSnackbar(error.response.data.errors.quantity[0], {variant: 'warning'})
            }
        });


    }, []);

    const debouncedSend = useMemo(() => {
        return debounce(send, 1000);
    }, [send]);

    const handleOnChange = (e) => {
        let newValue = e.target.value;
        let oldValue = value;
        if (newValue === "") {
            e.target.value = 0;
            newValue = 0;
        }
        newValue = Number(newValue);
        if (newValue < 0) newValue = 0;
        if (newValue > maxQuantity) {
            newValue = maxQuantity;
            enqueueSnackbar("Maksymalna ilość dla " + product.symbol + " wynosi " + maxQuantity, {variant: 'warning'})
        }
        if (oldValue === newValue) return;
        setValue("" + newValue);
        debouncedSend(newValue, oldValue);
    }

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: 1,
        }}>
            <TextField
                id="outlined-basic"
                label="Ilość"
                variant="outlined"
                type={"number"}
                value={value}
                disabled={maxQuantity === 0}
                onChange={handleOnChange}
                InputProps={{
                    inputProps: {
                        min: 0,
                        max: maxQuantity,
                        style: {
                            textAlign: "center",
                            fontSize: 14,
                        }
                    }
                }}
                sx={{
                    width: "20ch",
                    transform: "scale(0.9)",
                    height: 50,
                    // zIndex: 50
                }}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                // gap: 0.5,
                // mt: 0.5
            }}>
                {/*<Typography variant="caption">*/}
                {/*    Dostępność:*/}
                {/*</Typography>*/}
                <Typography variant="body2" sx={{color: quantityColor}}>
                    {quantityText}
                    {/*({quantity})*/}
                    ({product.quantity})
                </Typography>
            </Box>

        </Box>
    );
}
