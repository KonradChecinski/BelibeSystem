import {
    Box,
    Button,
    debounce,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {sortBySizesSortFunction} from "@/Functions/sortBySizes";
import {router} from "@inertiajs/react";
import toLocaleString from "@/Functions/toLocaleString";
import {Delete} from "@mui/icons-material";
import {useSnackbar} from "notistack";

export default function CartItems({props, discount}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    let index = 1;
    return (
        <Paper>

            <Box
                sx={{
                    overflowY: "auto",
                    overflowX: "auto",
                    width: 1,
                    minHeight: 200,
                    // maxHeight: 800,
                    height: "100%", // Dopasowanie do rodzica
                    maxHeight: "calc(100vh - 300px)", // Opcjonalnie, ograniczenie wysokości
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
                                <TableCell align={"center"}>Usuwanie</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.cartModels.map((model) => {

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


                                        {props.cartColors.filter(color => color.product_model_id === model.id).sort(sortByColorShortcut).map((color) => {
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
                                                                {color.images[0] ?
                                                                    (
                                                                        <Box component={"img"}
                                                                             src={route("images.webp", {slug: color.images[0].slug})}
                                                                             width={50}
                                                                             sx={{
                                                                                 // m: "auto",
                                                                                 // cursor: "pointer",
                                                                                 mr: 2
                                                                             }}
                                                                        />
                                                                    )
                                                                    :
                                                                    (
                                                                        <Box component={"img"}
                                                                             src={route("images.webp", {slug: "brak.jpg"})}
                                                                             width={50}
                                                                             sx={{
                                                                                 // m: "auto",
                                                                                 // cursor: "pointer",
                                                                                 mr: 2
                                                                             }}
                                                                        />
                                                                    )

                                                                }

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


                                                    {props.cart.filter(item => item.product_model_color.id === color.id).sort((a, b) => sortBySizesSortFunction(a.product.size.name, b.product.size.name)).map((item, i) => {
                                                        const product = item.product;
                                                        const deleteItem = () => {
                                                            router.post(route('b2b.cart.update', {product: product?.id}), {
                                                                quantity: 0
                                                            }, {
                                                                preserveScroll: true,
                                                                onSuccess: (response) => {
                                                                    enqueueSnackbar("Usunięto " + product.symbol + " z koszyka", {variant: "success"})
                                                                },
                                                                onError: (error) => {
                                                                    enqueueSnackbar("Błąd przy usuwaniu produktu " + product.symbol + " z koszyka", {variant: 'error'})
                                                                    console.error(error)
                                                                }
                                                            });
                                                        }
                                                        return (
                                                            <Fragment key={"product" + product.id}>
                                                                <TableRow hover
                                                                          sx={{bgcolor: item.quantity > product.available_without_order_to_edit ? "errorBg.main" : "inherit"}}>

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
                                                                        {item.price_net !== item.original_price_net &&
                                                                            (
                                                                                <Typography variant="body1"
                                                                                            sx={{
                                                                                                textDecoration: "line-through",
                                                                                                opacity: 0.8,
                                                                                            }}
                                                                                >
                                                                                    {toLocaleString(item.original_price_net / 100)}
                                                                                </Typography>
                                                                            )
                                                                        }
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_net / 100)}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align={"center"}>
                                                                        {item.price_net !== item.original_price_net &&
                                                                            (
                                                                                <Typography variant="body1"
                                                                                            sx={{
                                                                                                textDecoration: "line-through",
                                                                                                opacity: 0.8,
                                                                                            }}
                                                                                >
                                                                                    {toLocaleString(item.original_price_net * (1 + item.vat_rate / 100) / 100)}
                                                                                </Typography>
                                                                            )
                                                                        }
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_net * (1 + item.vat_rate / 100) / 100)}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align={"center"} sx={{p: 0}}>
                                                                        <ProductInput
                                                                            product={product}
                                                                            maxQuantity={product.available_without_order_to_edit}
                                                                            accountManager={props.accountManager}
                                                                            initialValue={item.quantity}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align={"center"}>
                                                                        {item.price_net !== item.original_price_net &&
                                                                            (
                                                                                <Typography variant="body1"
                                                                                            sx={{
                                                                                                textDecoration: "line-through",
                                                                                                opacity: 0.8,
                                                                                            }}
                                                                                >
                                                                                    {toLocaleString(item.original_price_net / 100 * item.quantity)}
                                                                                </Typography>
                                                                            )
                                                                        }
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_net / 100 * item.quantity)}
                                                                        </Typography>

                                                                    </TableCell>
                                                                    <TableCell align={"center"}>
                                                                        {item.price_net !== item.original_price_net &&
                                                                            (
                                                                                <Typography variant="body1"
                                                                                            sx={{
                                                                                                textDecoration: "line-through",
                                                                                                opacity: 0.8,
                                                                                            }}
                                                                                >
                                                                                    {toLocaleString(item.original_price_net * (1 + item.vat_rate / 100) / 100 * item.quantity)}
                                                                                </Typography>
                                                                            )
                                                                        }
                                                                        <Typography variant="body1">
                                                                            {toLocaleString(item.price_net * (1 + item.vat_rate / 100) / 100 * item.quantity)}
                                                                        </Typography>

                                                                    </TableCell>
                                                                    <TableCell align={"center"}>

                                                                        <IconButton aria-label="delete"
                                                                                    onClick={deleteItem}>
                                                                            <Delete color={"error"}/>
                                                                        </IconButton>
                                                                        {/*<IconButton aria-label="edit">*/}
                                                                        {/*    <Edit/>*/}
                                                                        {/*</IconButton>*/}

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
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: 15,
                py: 1,
                px: 2
            }}>
                <Typography variant="h6" sx={{color: "warning.main"}}>
                    Produkty nie są rezerwowane. Mogą zostać zamówione przez innych użytkowników do momentu złożenia
                    zamówienia.
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Delete/>}
                    onClick={() => {
                        router.delete(route('b2b.cart.delete'),
                            {
                                preserveScroll: true,
                                onSuccess: (response) => {
                                    enqueueSnackbar("Wyczyszczono koszyk", {variant: "success"})
                                },
                                onError: (errors) => {
                                    console.error(errors)
                                    enqueueSnackbar("Błąd przy czyszczeniu koszyka", {variant: 'error'})
                                    for (const errorsKey in errors) {
                                        enqueueSnackbar(errors[errorsKey].toString(), {variant: 'error'})
                                    }
                                }
                            });
                    }
                    }
                >
                    Wyczyść koszyk
                </Button>

            </Box>

        </Paper>
    );
}


const ProductInput = ({product, maxQuantity, accountManager, initialValue}) => {
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
        router.post(route('b2b.cart.update', {product: product?.id}), {
            quantity: value
        }, {
            preserveScroll: true,
            onSuccess: (response) => {
                enqueueSnackbar("Zmieniono ilość produktu " + product.symbol + " w koszyku na " + value, {variant: "success"})
            },
            onError: (error) => {
                enqueueSnackbar("Błąd przy zmienianiu ilości produktu " + product.symbol + " w koszyku na " + value, {variant: 'error'})
                console.error(error)
                if (error.quantity) enqueueSnackbar(error.quantity, {variant: 'warning'})
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
                error={value > maxQuantity}
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
                // mt: 0.5,

            }}>
                {/*<Typography variant="caption">*/}
                {/*    Dostępność:*/}
                {/*</Typography>*/}
                <Typography variant="body2" sx={{color: quantityColor, width: "20ch"}}>
                    {quantityText}
                    {/*({quantity})*/}
                    {accountManager && (" (" + product.available_without_order_to_edit + ")")}
                </Typography>
            </Box>

        </Box>
    );
}
