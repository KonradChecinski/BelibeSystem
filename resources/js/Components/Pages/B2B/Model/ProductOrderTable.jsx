import {
    Box, debounce,
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
import {sortBySizesName} from "@/Functions/sortBySizes";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {enqueueSnackbar} from "notistack";
import {useTheme} from "@mui/material/styles";
import {useCallback, useMemo, useRef, useState} from "react";
import {router} from "@inertiajs/react";
import {keyframes} from "@emotion/css";


export default function ProductOrderTable({model, cart, lightbox, imageArray, accountManager = false, props}) {
    // const [hoveredColumn, setHoveredColumn] = useState(null);

    const HoveringCell = ({children, column, disabled = false, header = false, sx}) => {
        return (
            <TableCell
                align={"center"}
                sx={{
                    bgcolor: disabled ? "disabled.background" : "",
                    fontWeight: header ? "bold" : "normal",
                    ...sx
                }}
                // sx={{
                //     bgcolor: disabled ? "disabled.background" : hoveredColumn === column ? header ? "cyan" : "hoveredCell.background" : "",
                //     ...sx
                // }}
                // onMouseEnter={() => setHoveredColumn(column)}
                // onMouseLeave={() => setHoveredColumn(null)}
            >
                {children}
            </TableCell>
        )
    }


    return (
        <TableContainer sx={{overflowX: "initial", borderRadius: 1}} component={Paper}>
            <Table
                aria-label="simple table"
                stickyHeader={true}
                sx={{
                    "& th": {
                        top: 81,
                    },
                    "& th:first-of-type": {
                        borderRadius: 1,
                        borderBottomRightRadius: 0,
                        borderTopRightRadius: 0
                    },
                    "& th:last-of-type": {
                        borderRadius: 1,
                        borderBottomLeftRadius: 0,
                        borderTopLeftRadius: 0
                    },
                }}
            >

                <TableHead>
                    <TableRow sx={{
                        borderRadius: 1
                    }}>
                        <HoveringCell column={1} header={true}>Kolor</HoveringCell>
                        <HoveringCell column={2} header={true} sx={{width: 120}}>Zdjęcie</HoveringCell>
                        {sortBySizesName(model.sizes).map(size => (
                            <HoveringCell column={2 + size.id} header={true} key={size.id}>{size.name}</HoveringCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {model.colors.sort(sortByColorShortcut).map(color => {
                        const image = color.images.find(i => i.order === 0);
                        const imageIndex = imageArray.findIndex(i => i.id === image.id);
                        return (
                            <TableRow hover key={color.id} sx={{height: 105}}>
                                <HoveringCell column={1}>
                                    <Typography variant="h5" textAlign={"center"} gutterBottom>
                                        {color.shortcut}
                                    </Typography>
                                    <Typography variant="body2" textAlign={"center"}>
                                        {color.name}
                                    </Typography>
                                </HoveringCell>
                                <HoveringCell column={2}>

                                    <Box component={"img"}
                                         src={route("images.webp", {path: image.path})}
                                         width={50}
                                         onClick={() => lightbox.loadAndOpen(imageIndex)}
                                         sx={{
                                             m: "auto",
                                             cursor: "pointer",
                                         }}
                                    />

                                </HoveringCell>
                                {sortBySizesName(model.sizes).map((size, id) => {
                                    const product = color.products.find(p => p.size.id === size.id);
                                    let quantity = product?.available;
                                    // if (quantity > 30) quantity = 30;

                                    return (
                                        <HoveringCell column={2 + size.id} key={id} disabled={quantity === 0}>
                                            {product ?
                                                <ProductInput product={product} cart={cart} maxQuantity={quantity}
                                                              enqueueSnackbar={enqueueSnackbar}
                                                              accountManager={accountManager}
                                                              props={props}
                                                />
                                                :
                                                ""
                                            }
                                        </HoveringCell>


                                    )
                                })}
                            </TableRow>
                        )
                    })}

                </TableBody>
            </Table>
        </TableContainer>
    );
}

const ProductInput = ({product, cart, maxQuantity, enqueueSnackbar, accountManager, props}) => {

    const [value, setValue] = useState(cart.find(c => c.product_id === product?.id)?.quantity || 0);
    const [runAnimation, setRunAnimation] = useState(false);
    const inputRef = useRef(null);

    Echo.private("cart." + props.clientId + ".product." + product.id).listen("CartProductUpdated", (e) => {
        setRunAnimation(true);
        inputRef?.current?.scrollIntoView({behavior: "smooth"});
        setTimeout(() => {
            setRunAnimation(false);
            setValue(e.quantity);
        }, 2000);
    });

    const animation = keyframes`
        0%,
        100% {
            transform: translateX(0%);
            transform-origin: 50% 50%;
        }
        15% {
            transform: translateX(-30px) rotate(-6deg);
        }
        30% {
            transform: translateX(15px) rotate(6deg);
        }
        45% {
            transform: translateX(-15px) rotate(-3.6deg);
        }
        60% {
            transform: translateX(9px) rotate(2.4deg);
        }
        75% {
            transform: translateX(-6px) rotate(-1.2deg);
        }
    `;

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

        axios.post(route('b2b.cart.update', {product: product?.id}), {
            quantity: value
        })
            .then(response => {
                enqueueSnackbar("Zmieniono ilość produktu " + product.symbol + " w koszyku na " + value, {variant: "success"})
            })
            .catch(error => {
                setValue(oldValue)
                enqueueSnackbar("Błąd przy zmienianiu ilości produktu " + product.symbol + " w koszyku na " + value, {variant: 'error'})
                console.error(error.response.data.errors)
                if (error.response.data.errors.quantity) enqueueSnackbar(error.response.data.errors.quantity[0], {variant: 'warning'})
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
            animation: runAnimation ? `${animation} 0.8s linear 1s 2 both` : "none",
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
                            fontSize: 13
                        }
                    }
                }}
                sx={{
                    width: 1,
                    minWidth: "14ch",
                    maxWidth: "20ch",
                }}
                ref={inputRef}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.5,
                mt: 0.5,

            }}>
                {/*<Typography variant="caption">*/}
                {/*    Dostępność:*/}
                {/*</Typography>*/}
                <Typography variant="body2" sx={{color: quantityColor}}>
                    {quantityText}
                    {/*({quantity})*/}
                    {accountManager && (" (" + product.available + ")")}
                </Typography>
            </Box>

        </Box>
    );
}
