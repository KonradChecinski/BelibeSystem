import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    debounce,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, Typography
} from "@mui/material";
import {sortBySizes, sortBySizesModelColorObject, sortBySizesName} from "@/Functions/sortBySizes";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import OrderTable from "@/Components/Pages/B2B/Model/OrderTable";
import {useEffect, useState} from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import 'photoswipe/style.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, FreeMode, Navigation, Pagination, Thumbs} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function B2bModel(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const imageArray = props.model.colors.sort(sortByColorShortcut).map((color) => {
        return color.images.sort((imageA, imageB) => imageA.order - imageB.order)
    }).flat();
    console.log(imageArray)

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        let lightbox = new PhotoSwipeLightbox({
            gallery: "#" + "pswp-gallery", //props.galleryID,
            children: "a",
            pswpModule: () => import("photoswipe")
        });

        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, []);

    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            header={
                t("Model") + " " + props.model.symbol + ": " + props.model.name
            }
        >
            <Head title={t("Model") + " " + props.model.symbol}/>

            <Box sx={{width: 1, minHeight: 600}}>
                <Paper elevation={4} sx={{p: 5, display: "flex"}}>
                    <Box
                        sx={{
                            width: 400,
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
                                // style={{
                                //     '--swiper-navigation-color': '#fff',
                                //     '--swiper-pagination-color': '#fff',
                                // }}
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
                                loop={true}
                                thumbs={{swiper: thumbsSwiper}}
                                modules={[Autoplay, Pagination, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {imageArray.map((image) => {
                                    return (
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
                                })}


                            </Swiper>
                        </Box>
                        <Box sx={{
                            "& .swiper-slide": {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: 100,
                                width: "auto"
                            }
                        }}>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={true}
                                spaceBetween={5}
                                slidesPerView={'auto'}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {imageArray.map((image) => {
                                    return (
                                        <SwiperSlide key={image.id}>
                                            <Box sx={{
                                                "& .product-image": {
                                                    height: 100,
                                                    maxWidth: "fit-content",
                                                    width: 1
                                                }
                                            }}>
                                                <img
                                                    src={route("images.thumbnail", {path: image.path})}
                                                    alt={"brak"}
                                                    className={"product-image"}
                                                    loading="lazy"
                                                />
                                            </Box>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </Box>
                    </Box>
                    <Box>
                        <Typography
                            variant="body1"
                            gutterBottom
                            dangerouslySetInnerHTML={{__html: props.model.description_b2b}}
                        />
                    </Box>
                </Paper>
            </Box>
            <Box my={2} sx={{overflowX: "initial"}}>
                <Typography variant="h5" gutterBottom>
                    Zamówienie
                </Typography>
                <OrderTable model={props.model}/>
            </Box>
        </ClientLayout>
    );
}
