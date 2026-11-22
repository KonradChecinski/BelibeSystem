import {useState} from "react";
import {enqueueSnackbar} from "notistack";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Checkbox,
    Chip,
    Divider,
    Tooltip,
    Typography
} from "@mui/material";
import {router} from "@inertiajs/react";
import {sortBySizes} from "@/Functions/sortBySizes";
import toLocaleString from "@/Functions/toLocaleString";
import {Favorite, FavoriteBorder, LocalOffer} from "@mui/icons-material";

export default function ModelComponent({model}) {

    const [isFavorited, setIsFavorited] = useState(model.isFavorited)
    const handleFavorite = () => {
        axios.patch(route('b2b.favorite.update', {productModel: model.id}))
            .then(response => {
                if (!isFavorited) enqueueSnackbar("Dodano do ulubionych", {variant: 'success'})
                else
                    enqueueSnackbar("Usunięto z ulubionych", {variant: 'info'})

                setIsFavorited(!isFavorited)
            })
            .catch(error => {
                enqueueSnackbar("Błąd dodaniu/usunięciu ulubionego", {variant: 'error'})
                console.error(error)
            });
    }

    const isPromotion = Boolean(model.price?.is_promotion);
    const hasVariablePrices = Boolean(model.price?.has_variable_prices);
    const promotedColorIconIds = model.price?.promoted_color_icon_ids || [];
    const displayNetPrice = hasVariablePrices
        ? (model.price?.min_discounted_wholesale_net_price ?? model.price?.discounted_wholesale_net_price)
        : model.price?.discounted_wholesale_net_price;
    const originalNetPrice = model.price?.original_wholesale_net_price;
    const showStrikethrough = !hasVariablePrices &&
        originalNetPrice &&
        displayNetPrice < originalNetPrice &&
        (isPromotion || model.price?.show_discount_on_invoice);

    return (

        <Card variant="outlined" sx={{
            position: "relative",
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: 1,
            height: 1,
            boxSizing: "border-box",
            borderColor: isPromotion ? "error.main" : undefined,
        }}>
            {isPromotion && (
                <Chip
                    icon={<LocalOffer sx={{fontSize: "14px !important"}}/>}
                    label="PROMOCJA"
                    color="error"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 60,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        boxShadow: 2,
                    }}
                />
            )}

            <CardActionArea
                onClick={() => {
                    router.visit(route('b2b.model', {slug: model.slug}))
                }}
                sx={{
                    height: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}>
                <Box sx={{
                    width: 1, height: 1,
                    display: "flex",
                    flexDirection: "column"
                }}>


                    <Box sx={{
                        width: 1,
                        height: "auto",
                        aspectRatio: 2 / 3,
                    }}>
                        <Box sx={{
                            position: "relative",
                            width: "100%",
                            height: 1,

                            "& img": {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                transition: "opacity 0.3s linear",
                                height: 1,
                                objectFit: "contain"
                            },
                            "& img:first-of-type": {
                                zIndex: 50,
                                opacity: 1,
                            },
                            "&:hover img:first-of-type": {
                                opacity: model.mainImages?.length === 2 ? 0 : 1,
                            },

                        }}>
                            {model.mainImages?.length === 2 ?
                                <>
                                    {model.mainImages?.map((image, id) => {
                                        return (
                                            <CardMedia
                                                key={id}
                                                component="img"
                                                image={route('images.webp', {slug: image.slug ? image.slug : "brak.jpg"})}
                                                alt="Zdjęcie produktu"
                                            />
                                        )
                                    })}
                                </>
                                :
                                model.mainImages?.length === 1 ?
                                    model.mainImages?.map((image, id) => {
                                        return (
                                            <CardMedia
                                                key={id}
                                                component="img"
                                                image={route('images.webp', {slug: image.slug ? image.slug : "brak.jpg"})}
                                                alt="Zdjęcie produktu"
                                            />
                                        )
                                    })
                                    :
                                    <CardMedia
                                        component="img"
                                        image={route('images.webp', {slug: "brak.jpg"})}
                                        alt="Zdjęcie produktu"
                                    />
                            }
                        </Box>
                    </Box>
                    <Box sx={{width: 1, height: "auto",}}>
                        <Divider sx={{mt: 0}}/>
                    </Box>

                    <CardContent sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        width: 1,
                        pt: 1,
                        pb: 0,
                        px: 1,
                        boxSizing: "border-box",
                        "&:last-child": {
                            pb: 1
                        }
                    }}>


                        <Box>
                            <Typography variant="body1" sx={{fontWeight: 600}}>
                                {model.symbol}
                            </Typography>
                            <Typography variant="body2">
                                {model.name}
                            </Typography>
                        </Box>


                        <Box
                            sx={{
                                width: 1,
                                display: "flex",
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>


                            <Box
                                sx={{
                                    mt: 1
                                }}>
                                <Typography
                                    variant="body1"
                                    textAlign={"center"}
                                    sx={{
                                        textAlign: "center",
                                        my: 1
                                    }}>
                                    Kolory
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mb: 1,

                                    minHeight: "1.4rem",
                                    width: 1,
                                }}>
                                    {model.icons.map((icon, id) => {
                                        const isColorPromoted = promotedColorIconIds.includes(icon.id);
                                        const iconBox = icon.type === 1 ? (
                                            <Box
                                                component={"img"}
                                                src={route("colorIcons", {path: icon.path})}
                                                sx={{
                                                    width: "1.4rem",
                                                    height: "1.4rem",
                                                    borderRadius: "100%",
                                                    border: isColorPromoted ? "2px solid" : 1,
                                                    borderColor: isColorPromoted ? "error.main" : "inherit",
                                                    boxShadow: isColorPromoted ? "0 0 0 2px rgba(211, 47, 47, 0.35)" : "none",
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: "1.4rem",
                                                    height: "1.4rem",
                                                    borderRadius: "100%",
                                                    bgcolor: icon.hex,
                                                    border: isColorPromoted ? "2px solid" : 1,
                                                    borderColor: isColorPromoted ? "error.main" : "inherit",
                                                    boxShadow: isColorPromoted ? "0 0 0 2px rgba(211, 47, 47, 0.35)" : "none",
                                                }}
                                            />
                                        );

                                        return (
                                            <Box key={id}>
                                                {isColorPromoted ? (
                                                    <Tooltip title="Kolor / rozmiar w promocji">
                                                        {iconBox}
                                                    </Tooltip>
                                                ) : (
                                                    iconBox
                                                )}
                                            </Box>
                                        )
                                    })}

                                </Box>
                            </Box>

                            <Box sx={{
                                mt: 0
                            }}>
                                <Typography
                                    variant="body1"
                                    textAlign={"center"}
                                    sx={{
                                        textAlign: "center",
                                        my: 1
                                    }}>
                                    Rozmiary
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mb: 1,

                                    minHeight: "1.4rem",
                                    width: 1,
                                }}>
                                    {sortBySizes(model.sizes).map((size, id) => {
                                        return (
                                            <Box key={id}>
                                                <Box
                                                    sx={{
                                                        width: "1.4rem",
                                                        height: "1.4rem",
                                                        borderRadius: "100%",
                                                        border: 1,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}>
                                                    <Typography variant="caption" sx={{
                                                        textAlign: "center",
                                                    }}>
                                                        {size}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </Box>
                            <Box sx={{mt: 1, textAlign: "center"}}>
                                {showStrikethrough && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{textDecoration: "line-through", display: "block"}}
                                    >
                                        {toLocaleString(originalNetPrice / 100)}
                                    </Typography>
                                )}
                                <Typography
                                    variant="h6"
                                    color={isPromotion ? "error.main" : "text.primary"}
                                    sx={{textAlign: "center", fontWeight: isPromotion ? 700 : 500}}
                                >
                                    {hasVariablePrices ? "od " : ""}
                                    {toLocaleString(displayNetPrice / 100)}
                                </Typography>
                                {hasVariablePrices && (
                                    <Typography variant="caption" color="error.main" sx={{display: "block", fontSize: "0.7rem"}}>
                                        Wybrane warianty w promocji
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Box>
                <CardActions sx={{width: 1}}>
                    <Box
                        sx={{
                            width: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Button variant="contained" sx={{mt: 1}} component={"div"}>
                            Zobacz
                        </Button>
                    </Box>


                </CardActions>


            </CardActionArea>
            <Checkbox
                icon={<FavoriteBorder color={"error"}/>}
                checkedIcon={<Favorite color={"error"}/>}
                checked={Boolean(isFavorited)}
                onChange={handleFavorite}
                sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    zIndex: 60
                }}
            />
        </Card>
    )
}
