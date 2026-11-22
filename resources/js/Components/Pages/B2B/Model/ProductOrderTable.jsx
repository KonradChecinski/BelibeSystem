import {
    Box,
    Chip,
    debounce,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {LocalOffer} from "@mui/icons-material";
import {sortBySizesName} from "@/Functions/sortBySizes";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import toLocaleString from "@/Functions/toLocaleString";
import {enqueueSnackbar} from "notistack";
import {useTheme} from "@mui/material/styles";
import {useCallback, useMemo, useRef, useState, Fragment} from "react";
import {keyframes} from "@emotion/css";
import useMediaQuery from "@mui/material/useMediaQuery";


export default function ProductOrderTable({model, cart, lightbox, imageArray, accountManager = false, props}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <>
            {!isMobile ?
                (
                    <DesktopTable model={model} cart={cart} lightbox={lightbox} imageArray={imageArray}
                                  accountManager={accountManager} props={props}/>
                )
                :
                (
                    <MobileTable model={model} cart={cart} lightbox={lightbox} imageArray={imageArray}
                                 accountManager={accountManager} props={props}/>
                )
            }

        </>
    )


}

const VariantSectionHeaderContent = ({variant}) => {
    const vPrice = variant.price;
    const hasDiscount = vPrice?.original_price_net &&
        vPrice.price_net < vPrice.original_price_net &&
        (vPrice.show_discount_on_invoice || vPrice.is_promotion);

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            px: 2,
            py: 1,
            bgcolor: "action.hover",
            borderLeft: "4px solid",
            borderColor: vPrice?.is_promotion ? "error.main" : "primary.main",
            borderRadius: 1,
        }}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap"}}>
                <Typography variant="h6" sx={{fontWeight: 700}}>
                    Model {variant.symbol}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {variant.name}
                </Typography>
                {vPrice?.is_promotion && (
                    <Chip
                        icon={<LocalOffer sx={{fontSize: "14px !important"}}/>}
                        label={vPrice.has_variable_prices ? "PROMOCJA NA WYBRANE WARIANTY" : "PROMOCJA"}
                        color="error"
                        size="small"
                        sx={{fontWeight: 700}}
                    />
                )}
            </Box>
            {vPrice && (
                <Box sx={{display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap"}}>
                    <Typography variant="body2" color="text.secondary">
                        Cena:
                    </Typography>
                    {hasDiscount && !vPrice.has_variable_prices && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{textDecoration: "line-through"}}
                        >
                            {toLocaleString(vPrice.original_price_net / 100)} netto
                        </Typography>
                    )}
                    <Typography
                        variant="subtitle1"
                        color={vPrice.is_promotion ? "error.main" : "text.primary"}
                        sx={{fontWeight: 700}}
                    >
                        {vPrice.has_variable_prices
                            ? `od ${toLocaleString(vPrice.min_price_net / 100)} netto`
                            : `${toLocaleString(vPrice.price_net / 100)} netto`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        ({vPrice.has_variable_prices
                            ? `od ${toLocaleString(vPrice.min_price_gross / 100)} brutto`
                            : `${toLocaleString(vPrice.price_gross / 100)} brutto`})
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

const ColorPromotionBadge = ({color, modelPrice}) => {
    if (!color.price?.is_promotion) return null;

    const hasVariableInColor = Boolean(color.price?.has_variable_prices);
    const showColorPrice = !hasVariableInColor && (
        modelPrice?.has_variable_prices || color.price.price_net !== modelPrice?.price_net
    );

    return (
        <Box sx={{mt: 0.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25}}>
            <Chip
                icon={<LocalOffer sx={{fontSize: "12px !important"}}/>}
                label={hasVariableInColor ? "Wybrane rozmiary w promocji" : "PROMOCJA"}
                color="error"
                size="small"
                sx={{height: 20, fontSize: "0.68rem", fontWeight: 700}}
            />
            {showColorPrice && (
                <Typography variant="caption" color="error.main" sx={{fontWeight: 700}}>
                    {toLocaleString(color.price.price_net / 100)} netto
                </Typography>
            )}
            {hasVariableInColor && (
                <Typography variant="caption" color="error.main" sx={{fontWeight: 700}}>
                    od {toLocaleString(color.price.min_price_net / 100)} netto
                </Typography>
            )}
        </Box>
    );
};

const DesktopTable = ({model, cart, lightbox, imageArray, accountManager = false, props}) => {
    const modelVariants = model.models?.length > 0 ? model.models : [model];
    const hasMultipleModels = modelVariants.length > 1;
    const allSizes = sortBySizesName(model.sizes);

    return (
        <TableContainer sx={{overflowX: "initial", borderRadius: 1}} component={Paper}>
            <Table
                aria-label="simple table"
                stickyHeader={true}
                sx={{
                    "& th": {
                        top: 141,
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
                        {allSizes.map(size => (
                            <HoveringCell column={2 + size.id} header={true} key={size.id}>{size.name}</HoveringCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {modelVariants.map((variant) => (
                        <Fragment key={"variant-desktop-" + variant.id}>
                            {hasMultipleModels && (
                                <TableRow>
                                    <TableCell colSpan={2 + allSizes.length} sx={{p: 1.5, bgcolor: "background.paper"}}>
                                        <VariantSectionHeaderContent variant={variant}/>
                                    </TableCell>
                                </TableRow>
                            )}
                            {[...(variant.colors || [])].sort(sortByColorShortcut).map(color => {
                                const image = color.images?.find(i => i.order === 0);
                                const imageIndex = image ? imageArray.findIndex(i => i.id === image.id) : null;

                                const colorIcon = color?.color_icon;

                                return (
                                    <TableRow hover key={color.id} sx={{height: 105}}>
                                        <HoveringCell column={1}>
                                            <Typography variant="h5" textAlign={"center"} gutterBottom>
                                                {color.shortcut}
                                            </Typography>
                                            <Typography variant="body2" textAlign={"center"}>
                                                {color.name}
                                            </Typography>
                                            <ColorPromotionBadge color={color} modelPrice={variant.price}/>
                                        </HoveringCell>
                                        <HoveringCell column={2}>

                                            <Stack
                                                my={1}
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                spacing={2}
                                            >
                                                {image ?
                                                    (
                                                        <Box component={"img"}
                                                             src={route("images.webp", {slug: image.slug})}
                                                             width={50}
                                                             onClick={() => lightbox.loadAndOpen(imageIndex)}
                                                             sx={{
                                                                 m: "auto",
                                                                 cursor: "pointer",
                                                             }}
                                                        />
                                                    )
                                                    :

                                                    (
                                                        <Box component={"img"}
                                                             src={route("images.webp", {slug: "brak.jpg"})}
                                                             width={50}
                                                             sx={{
                                                                 m: "auto",
                                                             }}
                                                        />
                                                    )
                                                }

                                                {colorIcon ?
                                                    (
                                                        <Box>
                                                            {colorIcon.type === 1 ?
                                                                <Box
                                                                    component={"img"}
                                                                    src={route("colorIcons", {path: colorIcon.path})}
                                                                    sx={{
                                                                        width: "1.9rem",
                                                                        height: "1.9rem",
                                                                        borderRadius: "100%",
                                                                        maxWidth: "none",
                                                                        border: color.price?.is_promotion ? "2px solid" : 1,
                                                                        borderColor: color.price?.is_promotion ? "error.main" : "inherit",
                                                                    }}/>
                                                                :
                                                                <Box
                                                                    sx={{
                                                                        width: "1.9rem",
                                                                        height: "1.9rem",
                                                                        borderRadius: "100%",
                                                                        maxWidth: "none",
                                                                        bgcolor: colorIcon.hex,
                                                                        border: color.price?.is_promotion ? "2px solid" : 1,
                                                                        borderColor: color.price?.is_promotion ? "error.main" : "inherit",
                                                                    }}/>
                                                            }
                                                        </Box>
                                                    )
                                                    :
                                                    (
                                                        <></>
                                                    )
                                                }
                                            </Stack>


                                        </HoveringCell>
                                        {allSizes.map((size, id) => {
                                            const product = color.products.find(p => p.size.id === size.id);
                                            let quantity = product?.available_without_order_to_edit;

                                            return (
                                                <HoveringCell column={2 + size.id} key={id} disabled={quantity === 0}>
                                                    {product ?
                                                        <ProductInput product={product} color={color} model={variant} cart={cart}
                                                                      maxQuantity={quantity}
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
                        </Fragment>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
}

const MobileTable = ({model, cart, lightbox, imageArray, accountManager = false, props}) => {
    const modelVariants = model.models?.length > 0 ? model.models : [model];
    const hasMultipleModels = modelVariants.length > 1;
    const allSizes = sortBySizesName(model.sizes);

    return (
        <TableContainer sx={{overflowX: "initial", borderRadius: 1}} component={Paper}>
            <Table
                aria-label="simple table"
                sx={{
                    "& th": {
                        top: 141,
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
                        <HoveringCell column={1} header={true}>Produkt</HoveringCell>
                        <HoveringCell column={2} header={true}>Ilość</HoveringCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {modelVariants.map((variant) => (
                        <Fragment key={"variant-mobile-" + variant.id}>
                            {hasMultipleModels && (
                                <TableRow>
                                    <TableCell colSpan={2} sx={{p: 1.5, bgcolor: "background.paper"}}>
                                        <VariantSectionHeaderContent variant={variant}/>
                                    </TableCell>
                                </TableRow>
                            )}
                            {[...(variant.colors || [])].sort(sortByColorShortcut).map(color => {
                                const image = color.images?.find(i => i.order === 0);
                                const imageIndex = image ? imageArray.findIndex(i => i.id === image.id) : null;
                                return (
                                    <TableRow key={color.id}>
                                        <TableCell colSpan={2}>
                                            <Table
                                                aria-label="simple table"
                                                stickyHeader={true}
                                                sx={{
                                                    "& th": {
                                                        top: 75,
                                                    },
                                                    "& th:first-of-type": {
                                                        borderRadius: 1,
                                                    },
                                                }}
                                            >
                                                <TableHead>
                                                    <TableRow hover key={color.id} sx={{height: 105}}>
                                                        <HoveringCell colSpan={2}>
                                                            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                                                <Box>
                                                                    {image ?
                                                                        (
                                                                            <Box component={"img"}
                                                                                 src={route("images.webp", {slug: image.slug})}
                                                                                 width={50}
                                                                                 onClick={() => lightbox.loadAndOpen(imageIndex)}
                                                                                 sx={{
                                                                                     m: "auto",
                                                                                     cursor: "pointer",
                                                                                 }}
                                                                            />
                                                                        )
                                                                        :
                                                                        (
                                                                            <Box component={"img"}
                                                                                 src={route("images.webp", {slug: "brak.jpg"})}
                                                                                 width={50}
                                                                                 onClick={() => lightbox.loadAndOpen(1)}
                                                                                 sx={{
                                                                                     m: "auto",
                                                                                     cursor: "pointer",
                                                                                 }}
                                                                            />
                                                                        )
                                                                    }
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="h5" textAlign={"center"} gutterBottom>
                                                                        {color.shortcut}
                                                                    </Typography>
                                                                    <Typography variant="body2" textAlign={"center"}>
                                                                        {color.name}
                                                                    </Typography>
                                                                    <ColorPromotionBadge color={color} modelPrice={variant.price}/>
                                                                </Box>
                                                            </Box>


                                                        </HoveringCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {allSizes.map((size, id) => {
                                                        const product = color.products.find(p => p.size.id === size.id);
                                                        let quantity = product?.available_without_order_to_edit;

                                                        return (
                                                            <TableRow hover key={color.id + "-" + size.id} sx={{height: 105}}>
                                                                <HoveringCell>
                                                                    {size.name}
                                                                </HoveringCell>
                                                                <HoveringCell column={2 + size.id} key={id}
                                                                              disabled={quantity === 0}>
                                                                    {product ?
                                                                        <ProductInput product={product} color={color}
                                                                                      model={variant} cart={cart}
                                                                                      maxQuantity={quantity}
                                                                                      enqueueSnackbar={enqueueSnackbar}
                                                                                      accountManager={accountManager}
                                                                                      props={props}
                                                                        />
                                                                        :
                                                                        ""
                                                                    }
                                                                </HoveringCell>

                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                    </TableRow>

                                )
                            })}
                        </Fragment>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
}

const ProductInput = ({product, color, model, cart, maxQuantity, enqueueSnackbar, accountManager, props}) => {

    const [value, setValue] = useState(cart.find(c => c.product_id === product?.id)?.quantity || 0);
    const [runAnimation, setRunAnimation] = useState(false);
    const inputRef = useRef(null);

    Echo.private("cart." + props.clientId + ".product." + product.id).listen("CartProductUpdated", (e) => {
        setRunAnimation(true);
        inputRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: 'center',
            inline: 'center'
        });
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

    const isProductPromo = Boolean(product.price?.is_promotion);
    const isSpecificProductLevelPromo = product.price?.promotion_level === 1;
    const showProductPriceBadge = isProductPromo && (
        isSpecificProductLevelPromo ||
        model?.price?.has_variable_prices ||
        color?.price?.has_variable_prices
    );

    return (
        <Box sx={{
            animation: runAnimation ? `${animation} 0.8s linear 1s 2 both` : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            {showProductPriceBadge && (
                <Box sx={{mb: 0.5, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Chip
                        icon={<LocalOffer sx={{fontSize: "11px !important"}}/>}
                        label={`${toLocaleString(product.price.price_net / 100)} netto`}
                        color="error"
                        size="small"
                        sx={{height: 20, fontSize: "0.7rem", fontWeight: 700}}
                    />
                    {product.price.original_price_net > product.price.price_net && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{textDecoration: "line-through", fontSize: "0.68rem", lineHeight: 1.1}}
                        >
                            {toLocaleString(product.price.original_price_net / 100)}
                        </Typography>
                    )}
                </Box>
            )}
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
                    "& .MuiOutlinedInput-root": isSpecificProductLevelPromo ? {
                        "& fieldset": {
                            borderColor: "error.main",
                            borderWidth: 2,
                        }
                    } : {},
                }}
                ref={inputRef}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.5,
                mt: 0.5,

            }}>
                <Typography variant="body2" sx={{color: quantityColor}}>
                    {quantityText}
                    {accountManager && (" (" + product.available_without_order_to_edit + ")")}
                </Typography>
            </Box>

        </Box>
    );
}

const HoveringCell = ({children, colSpan = 1, disabled = false, header = false, sx}) => {
    return (
        <TableCell
            colSpan={colSpan}
            align={"center"}
            sx={{
                bgcolor: disabled ? "disabled.background" : "",
                fontWeight: header ? "bold" : "normal",
                ...sx
            }}
        >
            {children}
        </TableCell>
    )
}
