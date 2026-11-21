import React from "react";
import {Box, Paper, Typography} from "@mui/material";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, FreeMode, Navigation, Pagination} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

import {
    alignOptions,
    aspectRatioOptions,
    hoverEffectOptions,
    objectFitOptions,
    objectPositionOptions,
    PuckImageItemProps,
    RenderSingleImage,
} from "../Image";
import {ImagePickerField, LinkPickerField} from "../Image/helpers";

export type PuckImageSliderProps = {
    slides: PuckImageItemProps[];
    slidesPerView: number | "auto";
    spaceBetween: number;
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    navigation: boolean;
    pagination: boolean;
    freeMode: boolean;
    sliderHeight: string;
    slideAspectRatio: string;
    borderRadius: number;
    elevation: number;
    hoverEffect: string;
    marginY: number;
    padding: number;
};

export const PuckImageSlider = {
    label: "Slider ze zdjęciami",
    fields: {
        slides: {
            type: "array",
            label: "Slajdy (Zdjęcia)",
            getItemSummary: (slide: PuckImageItemProps, index = 0) => {
                const name = slide?.alt || (typeof slide?.image === "string" ? slide.image : "") || `Slajd ${index + 1}`;
                const linkLabel = slide?.link?.label ? ` → ${slide.link.label}` : "";
                return `${index + 1}. ${name}${linkLabel}`;
            },
            defaultItemProps: {
                image: "",
                alt: "",
                link: null,
                width: "100%",
                height: "100%",
                align: "center",
                objectFit: "cover",
                objectPosition: "center center",
                opacity: 100,
                brightness: 100,
                contrast: 100,
                grayscale: 0,
                blur: 0,
                overlayColor: "#000000",
                overlayOpacity: 0,
            },
            arrayFields: {
                image: {
                    type: "custom",
                    label: "Zdjęcie",
                    render: ({value, onChange}: any) => (
                        <ImagePickerField value={value} onChange={onChange}/>
                    ),
                },
                alt: {
                    type: "text",
                    label: "Tekst alternatywny / nazwa slajdu",
                },
                link: {
                    type: "custom",
                    label: "Link po kliknięciu",
                    render: ({value, onChange}: any) => (
                        <LinkPickerField value={value} onChange={onChange} label="Strona docelowa (opcjonalnie)"/>
                    ),
                },
                objectFit: {
                    type: "select",
                    label: "Dopasowanie zdjęcia (object-fit)",
                    options: objectFitOptions,
                },
                objectPosition: {
                    type: "select",
                    label: "Pozycja kadrowania (object-position)",
                    options: objectPositionOptions,
                },
                align: {
                    type: "select",
                    label: "Wyrównanie w slajdzie",
                    options: alignOptions,
                },
                width: {
                    type: "text",
                    label: "Szerokość zdjęcia w slajdzie (np. 100%)",
                },
                opacity: {
                    type: "number",
                    label: "Widoczność / przezroczystość % (0 - 100)",
                    min: 0,
                    max: 100,
                },
                brightness: {
                    type: "number",
                    label: "Jasność % (100 = oryginał, <100 ciemniej, >100 jaśniej)",
                    min: 0,
                    max: 200,
                },
                contrast: {
                    type: "number",
                    label: "Kontrast % (0 - 200, 100 = oryginał)",
                    min: 0,
                    max: 200,
                },
                grayscale: {
                    type: "number",
                    label: "Skala szarości % (0 - 100)",
                    min: 0,
                    max: 100,
                },
                blur: {
                    type: "number",
                    label: "Rozmycie (px, 0 - 20)",
                    min: 0,
                    max: 20,
                },
                overlayColor: {
                    type: "text",
                    label: "Kolor nakładki (np. #000000)",
                },
                overlayOpacity: {
                    type: "number",
                    label: "Siła nakładki koloru % (0 - 100)",
                    min: 0,
                    max: 100,
                },
            },
        },
        slidesPerView: {
            type: "select",
            label: "Ilość widocznych slajdów na raz",
            options: [
                {label: "1 slajd (pełny baner)", value: 1},
                {label: "2 slajdy", value: 2},
                {label: "3 slajdy", value: 3},
                {label: "4 slajdy", value: 4},
                {label: "5 slajdów", value: 5},
                {label: "6 slajdów", value: 6},
                {label: "Automatycznie (auto)", value: "auto"},
            ],
        },
        spaceBetween: {
            type: "number",
            label: "Odstęp między slajdami (px)",
            min: 0,
            max: 100,
        },
        sliderHeight: {
            type: "text",
            label: "Wysokość slidera (np. 400px, 50vh, auto)",
        },
        slideAspectRatio: {
            type: "select",
            label: "Proporcje slajdów (gdy wysokość = auto)",
            options: aspectRatioOptions,
        },
        autoplay: {
            type: "radio",
            label: "Automatyczne przewijanie (Autoplay)",
            options: [
                {label: "Włączone", value: true},
                {label: "Wyłączone", value: false},
            ],
        },
        autoplayDelay: {
            type: "number",
            label: "Czas wyświetlania slajdu (ms, np. 3500)",
            min: 500,
            max: 30000,
        },
        loop: {
            type: "radio",
            label: "Zapętlenie (Loop)",
            options: [
                {label: "Tak", value: true},
                {label: "Nie", value: false},
            ],
        },
        navigation: {
            type: "radio",
            label: "Strzałki nawigacji",
            options: [
                {label: "Pokaż", value: true},
                {label: "Ukryj", value: false},
            ],
        },
        pagination: {
            type: "radio",
            label: "Kropki nawigacji na dole (Pagination)",
            options: [
                {label: "Pokaż", value: true},
                {label: "Ukryj", value: false},
            ],
        },
        freeMode: {
            type: "radio",
            label: "Swobodne przewijanie (FreeMode)",
            options: [
                {label: "Włączone", value: true},
                {label: "Wyłączone", value: false},
            ],
        },
        hoverEffect: {
            type: "select",
            label: "Animacja po najechaniu na klikalny slajd",
            options: hoverEffectOptions,
        },
        borderRadius: {
            type: "number",
            label: "Zaokrąglenie rogów slajdów (0 - 20)",
            min: 0,
            max: 20,
        },
        elevation: {
            type: "number",
            label: "Cień kontenera slidera (0 - 24)",
            min: 0,
            max: 24,
        },
        padding: {
            type: "number",
            label: "Wewnętrzny odstęp (padding)",
            min: 0,
            max: 10,
        },
        marginY: {
            type: "number",
            label: "Odstęp pionowy (margin Y)",
            min: 0,
            max: 15,
        },
    },
    defaultProps: {
        slides: [
            {
                image: "",
                alt: "Slajd 1",
                link: null,
                width: "100%",
                height: "100%",
                align: "center",
                objectFit: "cover",
                objectPosition: "center center",
                opacity: 100,
                brightness: 100,
                contrast: 100,
                grayscale: 0,
                blur: 0,
                overlayColor: "#000000",
                overlayOpacity: 0,
            },
        ],
        slidesPerView: 1,
        spaceBetween: 16,
        sliderHeight: "400px",
        slideAspectRatio: "auto",
        autoplay: true,
        autoplayDelay: 4000,
        loop: true,
        navigation: true,
        pagination: true,
        freeMode: false,
        hoverEffect: "zoom-lift",
        borderRadius: 2,
        elevation: 0,
        padding: 0,
        marginY: 1,
    },
    render: ({
        slides = [],
        slidesPerView = 1,
        spaceBetween = 16,
        sliderHeight = "400px",
        slideAspectRatio = "auto",
        autoplay = true,
        autoplayDelay = 4000,
        loop = true,
        navigation = true,
        pagination = true,
        freeMode = false,
        hoverEffect = "zoom-lift",
        borderRadius = 2,
        elevation = 0,
        padding = 0,
        marginY = 1,
    }: PuckImageSliderProps) => {
        const parsedSlidesPerView =
            slidesPerView === "auto" ? "auto" : Number(slidesPerView) || 1;

        const canLoop = Boolean(loop) && slides.length > (typeof parsedSlidesPerView === "number" ? parsedSlidesPerView : 1);

        const swiperKey = [
            slides.length,
            parsedSlidesPerView,
            spaceBetween,
            Boolean(autoplay),
            autoplayDelay,
            canLoop,
            Boolean(navigation),
            Boolean(pagination),
            Boolean(freeMode),
            sliderHeight,
            slideAspectRatio,
        ].join("-");

        const breakpoints =
            typeof parsedSlidesPerView === "number" && parsedSlidesPerView > 1
                ? {
                      0: {
                          slidesPerView: 1,
                      },
                      600: {
                          slidesPerView: Math.min(2, parsedSlidesPerView),
                      },
                      900: {
                          slidesPerView: parsedSlidesPerView,
                      },
                  }
                : undefined;

        return (
            <Paper
                elevation={elevation ?? 0}
                sx={{
                    width: 1,
                    p: padding ?? 0,
                    my: marginY ?? 1,
                    bgcolor: (elevation ?? 0) > 0 ? "background.paper" : "transparent",
                    borderRadius: borderRadius ?? 2,
                    overflow: "hidden",
                    "& .swiper": {
                        width: "100%",
                        height: sliderHeight && sliderHeight !== "auto" ? sliderHeight : "auto",
                        pb: pagination ? (sliderHeight && sliderHeight !== "auto" ? 0 : 4) : 0,
                    },
                    "& .swiper-slide": {
                        height: sliderHeight && sliderHeight !== "auto" ? "100%" : "auto",
                        width: parsedSlidesPerView === "auto" ? "fit-content" : "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                }}
            >
                {slides && slides.length > 0 ? (
                    <Swiper
                        key={swiperKey}
                        slidesPerView={parsedSlidesPerView}
                        spaceBetween={Number(spaceBetween) || 0}
                        breakpoints={breakpoints}
                        loop={canLoop}
                        freeMode={Boolean(freeMode)}
                        navigation={Boolean(navigation)}
                        pagination={pagination ? {clickable: true} : false}
                        autoplay={
                            autoplay
                                ? {
                                      delay: Number(autoplayDelay) || 4000,
                                      disableOnInteraction: false,
                                      pauseOnMouseEnter: true,
                                  }
                                : false
                        }
                        modules={[FreeMode, Navigation, Pagination, Autoplay]}
                    >
                        {slides.map((slide, idx) => (
                            <SwiperSlide key={idx}>
                                <RenderSingleImage
                                    {...slide}
                                    inSlider={true}
                                    height={sliderHeight && sliderHeight !== "auto" ? "100%" : "auto"}
                                    aspectRatio={slideAspectRatio || "auto"}
                                    borderRadius={borderRadius ?? 2}
                                    elevation={0}
                                    hoverEffect={hoverEffect || "zoom-lift"}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: "center",
                            color: "text.secondary",
                            border: "2px dashed",
                            borderColor: "divider",
                            borderRadius: borderRadius ?? 2,
                        }}
                    >
                        <Typography>Dodaj slajdy w ustawieniach bloku Slider</Typography>
                    </Box>
                )}
            </Paper>
        );
    },
};

export default PuckImageSlider;
