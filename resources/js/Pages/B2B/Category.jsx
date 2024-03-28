import {Head, Link, router} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia, Divider,
    Grid, Pagination, PaginationItem,
    Paper,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";

export default function B2bCategory(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            header={
                props.category.name
            }
        >
            <Head title={props.category.name}/>

            <Grid container spacing={3} sx={{minHeight: "95%", p: 1}}>

                {props.models.data.map((model) => {
                    return (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={model.id}>
                            <Card variant="outlined">
                                <CardActionArea
                                    onClick={() => {
                                        router.visit(route('b2b.model', {slug: model.slug}))
                                    }}
                                    sx={{
                                        height: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-end",
                                    }}>

                                    <Box sx={{
                                        width: 1,
                                        aspectRatio: 2 / 3,
                                    }}>
                                        {model.mainImages.length === 2 ?
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
                                                    opacity: 0,
                                                },

                                            }}>
                                                {model.mainImages?.map((image, id) => {
                                                    // console.log(image, id)
                                                    return (
                                                        <CardMedia
                                                            key={id}
                                                            component="img"
                                                            image={route('images.thumbnail', {path: image.path ? image.path : "brak.jpg"})}
                                                            alt="Zdjęcie produktu"
                                                            // sx={{
                                                            //     width: 1
                                                            // }}
                                                        />
                                                    )
                                                })}
                                            </Box>
                                            :
                                            model.mainImages.length === 1 ?
                                                model.mainImages?.map((image, id) => {
                                                    return (
                                                        <CardMedia
                                                            key={id}
                                                            component="img"
                                                            image={route('images.thumbnail', {path: image.path ? image.path : "brak.jpg"})}
                                                            alt="Zdjęcie produktu"
                                                            // sx={{
                                                            //     width: 1
                                                            // }}
                                                        />
                                                    )
                                                })
                                                :
                                                <CardMedia
                                                    component="img"
                                                    image={route('images.thumbnail', {path: "brak.jpg"})}
                                                    alt="Zdjęcie produktu"
                                                />
                                        }
                                    </Box>
                                    <Box sx={{width: 1}}>
                                        <Divider sx={{mt: 0}}/>
                                    </Box>

                                    <CardContent sx={{height: "150px", width: 1, pt: 1, pb: 0, px: 2}}>
                                        <Box sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: 1,
                                            width: 1,
                                            mb: 1
                                        }}>
                                            {Array(6).fill(0).map((_, id) => (
                                                    <Box
                                                        key={id}
                                                        sx={{
                                                            borderRadius: 1,
                                                            width: 20,
                                                            height: 20,
                                                            bgcolor: "green"
                                                        }}
                                                    />
                                                )
                                            )}

                                        </Box>

                                        <Typography variant="body2" component={"h3"}>
                                            Model: {model.symbol}
                                        </Typography>
                                        <Typography variant="body1" component={"h2"}>
                                            {model.name}
                                        </Typography>
                                        {/*<Typography variant="body1" component={"h2"}>*/}
                                        {/*    Cena katalogowa: {toLocaleString(model.price.wholesale_net_price / 100)}*/}
                                        {/*</Typography>*/}
                                        <Typography variant="body1" component={"h2"}>
                                            Cena dla
                                            ciebie: {toLocaleString(model.price.discounted_wholesale_net_price / 100)}
                                        </Typography>
                                        <Typography variant="body1" component={"h2"}>
                                            Stan: {model.quantity}
                                        </Typography>
                                    </CardContent>
                                    {/*<CardActions>*/}
                                    {/*    <Button size="small">Zobacz</Button>*/}
                                    {/*</CardActions>*/}
                                </CardActionArea>
                            </Card>
                        </Grid>

                    )
                })
                }
            </Grid>
            <Box sx={{
                width: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // mt: 3,
                py: 3
            }}>


                <Box>
                    <Pagination
                        count={props.models.last_page}
                        page={props.models.current_page}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                href={`${props.models.path}${item.page === 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )
                        }
                    />

                </Box>
            </Box>
        </ClientLayout>
    );
}
