import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Box, Button, Checkbox, Divider, Paper, Typography} from "@mui/material";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import ProductOrderTable from "@/Components/Pages/B2B/Model/ProductOrderTable";
import {Fragment, useEffect, useRef, useState} from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import 'photoswipe/style.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, FreeMode, Navigation, Pagination, Thumbs} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import ProductPriceTable from "@/Components/Pages/B2B/Model/ProductPriceTable";
import ProductSizeTable from "@/Components/Pages/B2B/Model/ProductSizeTable";
import ProductColorTable from "@/Components/Pages/B2B/Model/ProductColorTable";
import {ArrowDownward, Favorite, FavoriteBorder} from "@mui/icons-material";

export default function B2bModel(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    const ProductOrderTableRef = useRef(null)
    console.log(props)


    const [isFavorited, setIsFavorited] = useState(props.model.isFavorited)

    const handleFavorite = () => {
        axios.patch(route('b2b.favorite.update', {productModel: props.model.id}))
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

    const imageArray = props.model.colors.sort(sortByColorShortcut).map((color) => {
        return color.images?.sort((imageA, imageB) => imageA.order - imageB.order)
    }).flat();


    let lightbox = new PhotoSwipeLightbox({
        gallery: "#" + "pswp-gallery", //props.galleryID,
        children: "a",
        pswpModule: () => import("photoswipe")
    });

    useEffect(() => {
        lightbox = (new PhotoSwipeLightbox({
            gallery: "#" + "pswp-gallery", //props.galleryID,
            children: "a",
            pswpModule: () => import("photoswipe")
        }));

        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, []);

    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    console.log(thumbsSwiper)
    // let thumbsSwiper = new PhotoSwipeLightbox({
    //     gallery: "#" + "thumbs-swiper-container", //props.galleryID,
    //     children: "a",
    //     pswpModule: () => import("photoswipe")
    // });

    // thumbsSwiper.init()
    //
    //
    // useEffect(() => {
    //     // Zainicjuj thumbsSwiper tutaj (można wprowadzić bardziej zaawansowaną inicjalizację jeśli potrzebna)
    //     let swiper = new PhotoSwipeLightbox({
    //         gallery: "#" + "thumbs-swiper-container", //props.galleryID,
    //         children: "a",
    //         pswpModule: () => import("photoswipe")
    //     });
    //     swiper.init()
    //     setThumbsSwiper(swiper)
    //     return () => {
    //         // // Upewnij się, że zniszczysz thumbsSwiper podczas odmontowywania
    //         // if (swiper && swiper.destroy) {
    //         //     swiper.destroy(true, true);
    //         // }
    //         return () => {
    //             thumbsSwiper.destroy();
    //             setThumbsSwiper(null);
    //         };
    //     };
    // }, []);


    const scrollTo = () => {
        ProductOrderTableRef.current.scrollIntoView({behavior: "smooth"});
    }


    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            accountManager={props.accountManager}
            cart={props.cartSummary}
            clientId={props.clientId}
            blacklist={props.blacklist}
            header={
                t("Model") + " " + props.model.symbol + ": " + props.model.name
            }
        >
            <Head title={t("Model") + " " + props.model.symbol}/>

            <Box sx={{width: 1, minHeight: 400, position: "relative"}}>
                <Paper elevation={4}
                       sx={{p: 5, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-around"}}>
                    <Box
                        sx={{
                            width: 250,
                            height: 1,
                            "& .swiper-slide": {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }
                        }}>
                        <Box
                            className="pswp-gallery"
                            id={"pswp-gallery"}
                            sx={{
                                py: 1,
                                width: 1,
                                overflowY: "hidden",
                                overflowX: "auto",
                            }}>
                            <Swiper
                                style={{
                                    // '--swiper-navigation-color': '#fff',
                                    // '--swiper-pagination-color': '#fff',
                                    '--swiper-navigation-size': '25px',
                                }}
                                onBeforeDestroy={() => {
                                    console.log("before destroy1")
                                    thumbsSwiper.destroy()
                                }}

                                onDestroy={() => {
                                    console.log("destroy1")
                                    thumbsSwiper.destroy()
                                }}
                                centeredSlides={true}
                                // autoplay={{
                                //     delay: 2500,
                                //     disableOnInteraction: false,
                                // }}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                navigation={true}
                                loop={false}
                                thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
                                modules={[Autoplay, Pagination, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {
                                    imageArray.length > 0 ?
                                        (
                                            <Fragment key={(Math.random() + 1).toString(36).substring(7)}>
                                                {
                                                    imageArray.map((image) => {
                                                        return (
                                                            <>
                                                                {image &&
                                                                    (
                                                                        <SwiperSlide key={image.id}>
                                                                            <Box sx={{
                                                                                "& .product-image": {
                                                                                    // height: 600,
                                                                                    // maxWidth: "fit-content"
                                                                                    width: 1
                                                                                }
                                                                            }}>
                                                                                <a
                                                                                    href={route("images.webp", {path: image.path})}
                                                                                    data-pswp-width={image.width}
                                                                                    data-pswp-height={image.height}
                                                                                    key={"pswp-gallery" + "-" + image.id}//index
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    className={"relative"}
                                                                                >
                                                                                    <img
                                                                                        src={route("images.webp", {path: image.path})}
                                                                                        alt={"brak"}
                                                                                        className={"product-image"}
                                                                                        loading="lazy"
                                                                                    />

                                                                                </a>
                                                                            </Box>
                                                                        </SwiperSlide>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    })
                                                }

                                            </Fragment>
                                        )
                                        :
                                        (
                                            <SwiperSlide key={new Date().getTime()}>
                                                <Box sx={{
                                                    "& .product-image": {
                                                        // height: 600,
                                                        // maxWidth: "fit-content"
                                                        width: 1
                                                    }
                                                }}>
                                                    <a
                                                        href={route("images.webp", {path: "brak.jpg"})}
                                                        data-pswp-width={1280}
                                                        data-pswp-height={1920}
                                                        key={"pswp-gallery" + "-" + 1}//index
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={"relative"}
                                                    >
                                                        <img
                                                            src={route("images.webp", {path: "brak.jpg"})}
                                                            alt={"brak"}
                                                            className={"product-image"}
                                                            loading="lazy"
                                                        />

                                                    </a>
                                                </Box>
                                            </SwiperSlide>
                                        )

                                }


                            </Swiper>
                        </Box>
                        <Box
                            className="thumbs-swiper-container"
                            id={"thumbs-swiper-container"}
                            sx={{
                                "& .swiper-slide": {
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 50,
                                    width: "auto"
                                }
                            }}>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                // onBeforeDestroy={(swiper) => {
                                //     if (swiper && swiper.destroy) {
                                //         swiper.destroy(true, true);
                                //     }
                                //     thumbsSwiper.destroy()
                                // }}
                                // onDestroy={(swiper) => {
                                //     thumbsSwiper.destroy()
                                // }}
                                onBeforeDestroy={() => {
                                    console.log("before destroy2")
                                    if (thumbsSwiper && !thumbsSwiper.destroyed) {
                                        // thumbsSwiper.destroy();
                                        setThumbsSwiper(null);
                                    }
                                    // thumbsSwiper.destroy()
                                }}

                                // onDestroy={() => {
                                //     console.log("destroy2")
                                //     thumbsSwiper.destroy()
                                // }}


                                loop={true}
                                spaceBetween={5}
                                slidesPerView={'auto'}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiperThumbnails"
                            >
                                {imageArray.length > 0 ?
                                    (
                                        <>
                                            {imageArray.map((image) => {

                                                return (
                                                    <>
                                                        {image && (
                                                            <SwiperSlide key={image.id}>
                                                                <Box sx={{
                                                                    "& .product-image": {
                                                                        height: 50,
                                                                        maxWidth: "fit-content",
                                                                        width: 1,
                                                                        cursor: "pointer",
                                                                    }
                                                                }}>
                                                                    <img
                                                                        src={route("images.webp", {path: image.path})}
                                                                        alt={"brak"}
                                                                        className={"product-image"}
                                                                        loading="lazy"
                                                                    />

                                                                </Box>
                                                            </SwiperSlide>
                                                        )

                                                        }
                                                    </>
                                                )
                                            })}
                                        </>
                                    )
                                    :
                                    (
                                        <SwiperSlide key={1}>
                                            <Box sx={{
                                                "& .product-image": {
                                                    height: 50,
                                                    maxWidth: "fit-content",
                                                    width: 1,
                                                    cursor: "pointer",
                                                }
                                            }}>

                                                <img
                                                    src={route("images.webp", {path: "brak.jpg"})}
                                                    alt={"brak"}
                                                    className={"product-image"}
                                                    loading="lazy"
                                                />

                                            </Box>
                                        </SwiperSlide>
                                    )
                                }

                            </Swiper>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        gap: 2,
                        flex: 1,
                        minWidth: 400,
                        maxWidth: 1
                    }}>


                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 2,
                            flex: 1,
                            minWidth: 400,
                            maxWidth: 1
                        }}>
                            <Box sx={{
                                flex: 1,
                                minWidth: 300,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1
                                }}>
                                    <Typography variant="h6">
                                        Opis produktu
                                    </Typography>
                                    <Divider/>
                                    <Typography
                                        variant="body1"
                                        gutterBottom
                                        dangerouslySetInnerHTML={{__html: props.model.description_b2b}}
                                        sx={{
                                            "& ul": {
                                                pl: 4,
                                                // all: "unset",
                                                "& li": {
                                                    listStyleType: "disc"
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1
                                }}>
                                    <Typography variant="h6">
                                        Cena produktu
                                    </Typography>
                                    <Divider/>
                                    <ProductPriceTable model={props.model}/>

                                </Box>
                            </Box>

                            <Box sx={{
                                flex: 1,
                                minWidth: 300,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1
                                }}>
                                    <Typography variant="h6">
                                        Rozmiary
                                    </Typography>
                                    <Divider/>
                                    <ProductSizeTable model={props.model}/>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1
                                }}>
                                    <Typography variant="h6">
                                        Kolory
                                    </Typography>
                                    <Divider/>
                                    <ProductColorTable model={props.model} lightbox={lightbox} imageArray={imageArray}/>
                                </Box>
                                <Box>
                                    {Boolean(props.blacklist) === false &&
                                        (
                                            <Button variant="contained" onClick={scrollTo} sx={{my: 2, width: 1}}
                                                    startIcon={<ArrowDownward/>}>
                                                Przejdź do zamawiania produktów
                                            </Button>
                                        )
                                    }
                                </Box>
                            </Box>

                        </Box>

                    </Box>
                </Paper>
                <Checkbox
                    icon={<FavoriteBorder color={"error"}/>}
                    checkedIcon={<Favorite color={"error"}/>}
                    checked={Boolean(isFavorited)}
                    onChange={handleFavorite}
                    sx={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        zIndex: 60,
                        transform: "scale(1.5)",
                    }}
                />
            </Box>
            <Box ref={ProductOrderTableRef} mt={2} sx={{overflowX: "initial"}}>
                {Boolean(props.blacklist) === false ?
                    (
                        <>
                            <Typography variant="h4" gutterBottom sx={{ml: 1, mb: 2}}>
                                Zamówienie
                            </Typography>
                            <ProductOrderTable model={props.model} cart={props.cart} lightbox={lightbox}
                                               imageArray={imageArray} accountManager={props.accountManager}
                                               props={props}/>
                        </>
                    )
                    :
                    (
                        <>
                            <Typography variant="h6" align={"center"}>
                                Nie możesz składać zamówień w naszym sklepie
                            </Typography>
                        </>
                    )

                }

            </Box>
        </ClientLayout>
    );
}
