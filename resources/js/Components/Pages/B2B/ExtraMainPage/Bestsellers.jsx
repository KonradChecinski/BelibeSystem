import {useState} from "react";
import {Box, Grid} from "@mui/material";
import ModelComponent from "@/Components/Pages/B2B/ModelComponent";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, FreeMode, Navigation, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export default function B2BBestsellers() {
    const [data, setData] = useState([]);
    axios.get(route("b2b.main.extra.bestsellers"))
        .then(response => {
            // console.log(response.data)
            setData(response.data)
        })
        .catch(error => {
            console.error(error)
        });

    return (
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
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                navigation={true}
                modules={[Pagination, FreeMode, Navigation, Autoplay]}
            >

                {data.map((bestseller, id) => {
                        return (
                            <SwiperSlide key={id}>
                                <Box sx={{width: 200, height: 1}}>
                                    <ModelComponent model={bestseller.productModel} key={bestseller.productModel.id}/>
                                </Box>
                            </SwiperSlide>
                        )
                    }
                )}
                {/*<SwiperSlide>Slide 1</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 2</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 3</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 3</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 3</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 3</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 3</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 3</SwiperSlide>*/}
                {/*<SwiperSlide>Slide 3</SwiperSlide>*/}
            </Swiper>
        </Box>

        // {/*<Grid container spacing={3} sx={{minHeight: "95%", p: 1}} alignItems="stretch">*/}
        // {/*    {data.map((bestseller) => {*/}
        // {/*            return (*/}
        // {/*                <ModelComponent model={bestseller.productModel} key={bestseller.productModel.id}/>*/}
        // {/*            )*/}
        // {/*        }*/}
        // {/*    )}*/}
        // {/*</Grid>*/}
    )
}
