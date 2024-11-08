import {useEffect, useMemo, useState} from "react";
import {Box, Divider, Grid, Paper, Skeleton, Typography} from "@mui/material";
import ModelComponent from "@/Components/Pages/B2B/ModelComponent";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, FreeMode, Navigation} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import {useLaravelReactI18n} from "laravel-react-i18n";
import ModelSkeletonComponent from "@/Components/Pages/B2B/ModelSkeletonComponent";

export default function B2BBestsellers({quantity}) {
    const {t} = useLaravelReactI18n();
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(route("b2b.main.extra.bestsellers"), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            params: {
                quantity: quantity
            }
        })
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [quantity]);

    // Memoizacja danych w celu uniknięcia ponownego przetwarzania
    const memoizedData = useMemo(() => {
        return data;
    }, [data]);


    return (
        <Paper elevation={4} sx={{p: 1, my: 1}}>
            <Box sx={{}}>

                <Typography variant="h3">
                    {t("Bestsellers")}
                </Typography>
                <Divider/>

            </Box>
            <Box sx={{
                width: 1,
                p: 1,
                "& .swiper-slide": {
                    width: "fit-content",
                    height: "unset",
                    mb: 1
                },
                "& .swiper-wrapper": {
                    height: "unset"
                },
            }}>

                <Swiper
                    // autoHeight={true}
                    slidesPerView={"auto"}
                    spaceBetween={30}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: true,
                    }}
                    navigation={true}
                    modules={[FreeMode, Navigation, Autoplay]}
                >
                    {memoizedData && memoizedData.length !== 0 ?
                        (
                            <>
                                {memoizedData.map((bestseller, id) => {
                                        return (
                                            <SwiperSlide key={id}>
                                                <Box sx={{width: 200, height: 1}}>
                                                    <ModelComponent model={bestseller.productModel}
                                                                    key={bestseller.productModel.id}/>
                                                </Box>
                                            </SwiperSlide>
                                        )
                                    }
                                )}
                            </>
                        )
                        :
                        (
                            <>
                                {Array(quantity).fill(0).map((item, id) => {
                                    return (
                                        <SwiperSlide key={"skeleton" + id}>
                                            <Box sx={{width: 200, height: 1}}>
                                                <ModelSkeletonComponent key={id}/>
                                            </Box>
                                        </SwiperSlide>
                                    )
                                })
                                }
                            </>

                        )
                    }

                </Swiper>


            </Box>
        </Paper>

    )
}
