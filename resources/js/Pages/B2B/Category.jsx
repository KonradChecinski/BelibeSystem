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
    CardMedia, Checkbox, CircularProgress, Divider,
    Grid, IconButton, Pagination, PaginationItem,
    Paper,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {sortBySizes} from "@/Functions/sortBySizes";
import {Delete, Favorite, FavoriteBorder} from "@mui/icons-material";
import InfiniteScroll from 'react-infinite-scroll-component';
import {useEffect, useState} from "react";

export default function B2bCategory(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    const [items, setItems] = useState(props.models.data);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(props.models.current_page);
    const [totalPages, setTotalPages] = useState(props.models.last_page);
    const [totalItems, setTotalItems] = useState(props.models.total);
    const [path, setPath] = useState(props.models.path);

    const fetchMoreData = () => {
        fetch(path + `?page=${page + 1}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.data.length === 0) setHasMore(false)

                setPage(result.current_page)
                setItems([...items, ...result.data])

                if (totalPages === page) setHasMore(false)
            })
    }


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
            <InfiniteScroll
                dataLength={items.length}
                next={fetchMoreData}
                hasMore={hasMore}
                style={{
                    overflow: "hidden",
                }}
                scrollThreshold={"300px"}
                loader={
                    <Box
                        sx={{
                            width: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 1,
                            mb: 1

                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1

                        }}>
                            <CircularProgress/>
                            <Typography variant="body1" gutterBottom textAlign={"center"}>
                                Widziałeś/-aś {items.length} z {totalItems}
                            </Typography>
                        </Box>

                    </Box>
                }
                endMessage={
                    <>
                        <Typography variant="h6" gutterBottom textAlign={"center"}>
                            Widziałeś/-aś wszystkie produkty
                        </Typography>
                        <Typography variant="body1" gutterBottom textAlign={"center"}>
                            {items.length} z {totalItems}
                        </Typography>
                    </>
                }
            >
                <Grid container spacing={3} sx={{minHeight: "95%", p: 1}} alignItems="stretch">
                    {items.map((model) => {
                        return (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={model.id} sx={{display: "flex"}}>
                                <Card variant="outlined" sx={{
                                    position: "relative",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    width: 1,
                                }}>
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
                                                                    image={route('images.webp', {path: image.path ? image.path : "brak.jpg"})}
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
                                                                    image={route('images.webp', {path: image.path ? image.path : "brak.jpg"})}
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
                                                            image={route('images.webp', {path: "brak.jpg"})}
                                                            alt="Zdjęcie produktu"
                                                        />
                                                }
                                            </Box>
                                            <Box sx={{width: 1, height: "auto",}}>
                                                <Divider sx={{mt: 0}}/>
                                            </Box>

                                            <CardContent sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                // height: 1,
                                                flex: 1,
                                                width: 1,
                                                pt: 1,
                                                pb: 0,
                                                px: 1
                                            }}>


                                                <Box>
                                                    <Typography variant="body1" sx={{fontWeight: 600}}>
                                                        {/*Model:*/} {model.symbol}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {model.name}
                                                    </Typography>
                                                </Box>


                                                <Box
                                                    sx={{
                                                        width: 1,
                                                        // height: 1,
                                                        display: "flex",
                                                        flex: 1,
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}>


                                                    <Box
                                                        sx={{
                                                            mt: 2
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

                                                                return (
                                                                    <Box key={id}>
                                                                        {icon.type === 1 ?
                                                                            <Box
                                                                                component={"img"}
                                                                                src={route("colorIcons", {path: icon.path})}
                                                                                sx={{
                                                                                    width: "1.4rem",
                                                                                    height: "1.4rem",
                                                                                    borderRadius: "100%",
                                                                                    border: 1
                                                                                }}/>
                                                                            :
                                                                            <Box
                                                                                sx={{
                                                                                    width: "1.4rem",
                                                                                    height: "1.4rem",
                                                                                    borderRadius: "100%",
                                                                                    bgcolor: icon.hex,
                                                                                    border: 1
                                                                                }}/>
                                                                        }
                                                                    </Box>
                                                                )
                                                            })}

                                                        </Box>
                                                    </Box>

                                                    <Box sx={{
                                                        mt: 2
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
                                                    <Box sx={{mt: 2}}>
                                                        {/*<Typography variant="body1" component={"h2"}>*/}
                                                        {/*    Cena*/}
                                                        {/*    katalogowa: {toLocaleString(model.price.wholesale_net_price / 100)}*/}
                                                        {/*</Typography>*/}
                                                        <Typography variant="h6" sx={{textAlign: "center"}}>
                                                            {toLocaleString(model.price.discounted_wholesale_net_price / 100)}
                                                        </Typography>
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
                                        sx={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            zIndex: 60
                                        }}
                                    />
                                </Card>
                            </Grid>

                        )
                    })
                    }
                </Grid>

            </InfiniteScroll>
            {/*<Box sx={{*/}
            {/*    width: 1,*/}
            {/*    display: "flex",*/}
            {/*    justifyContent: "center",*/}
            {/*    alignItems: "center",*/}
            {/*    // mt: 3,*/}
            {/*    py: 3*/}
            {/*}}>*/}


            {/*    <Box>*/}
            {/*        <Pagination*/}
            {/*            count={props.models.last_page}*/}
            {/*            page={props.models.current_page}*/}
            {/*            renderItem={(item) => (*/}
            {/*                <PaginationItem*/}
            {/*                    component={Link}*/}
            {/*                    href={`${props.models.path}${item.page === 1 ? '' : `?page=${item.page}`}`}*/}
            {/*                    {...item}*/}
            {/*                />*/}
            {/*            )*/}
            {/*            }*/}
            {/*        />*/}

            {/*    </Box>*/}
            {/*</Box>*/}
        </ClientLayout>
    );
}
