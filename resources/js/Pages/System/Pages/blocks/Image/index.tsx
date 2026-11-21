import React from "react";
import {Box, Paper, Typography} from "@mui/material";
import {Link} from "@inertiajs/react";
import {Image as ImageIcon} from "@mui/icons-material";
import {getPageImageUrl, ImagePickerField, LinkPickerField} from "./helpers";

declare function route(name?: string, params?: any, absolute?: boolean): any;

export const alignOptions = [
    {label: "Do lewej", value: "flex-start"},
    {label: "Do środka", value: "center"},
    {label: "Do prawej", value: "flex-end"},
];

export const objectFitOptions = [
    {label: "Wypełnij i przytnij (cover)", value: "cover"},
    {label: "Dopasuj całość (contain)", value: "contain"},
    {label: "Rozciągnij (fill)", value: "fill"},
    {label: "Oryginalny rozmiar (none)", value: "none"},
    {label: "Zmniejsz jeśli za duże (scale-down)", value: "scale-down"},
];

export const objectPositionOptions = [
    {label: "Środek", value: "center center"},
    {label: "Góra", value: "center top"},
    {label: "Dół", value: "center bottom"},
    {label: "Lewo", value: "left center"},
    {label: "Prawo", value: "right center"},
    {label: "Lewy górny róg", value: "left top"},
    {label: "Prawy górny róg", value: "right top"},
    {label: "Lewy dolny róg", value: "left bottom"},
    {label: "Prawy dolny róg", value: "right bottom"},
];

export const aspectRatioOptions = [
    {label: "Automatyczne (oryginalne / wg wysokości)", value: "auto"},
    {label: "16:9 (Panorama)", value: "16 / 9"},
    {label: "21:9 (Ultraszerokie / Baner)", value: "21 / 9"},
    {label: "3:1 (Niski baner)", value: "3 / 1"},
    {label: "4:3 (Standardowe)", value: "4 / 3"},
    {label: "1:1 (Kwadrat)", value: "1 / 1"},
    {label: "3:4 (Portret)", value: "3 / 4"},
    {label: "2:3 (Pionowe 2x3)", value: "2 / 3"},
];

export const hoverEffectOptions = [
    {label: "Powiększenie zdjęcia i uniesienie (Zoom + Lift)", value: "zoom-lift"},
    {label: "Powiększenie zdjęcia (Zoom)", value: "zoom"},
    {label: "Uniesienie (Lift)", value: "lift"},
    {label: "Rozjaśnienie", value: "brighten"},
    {label: "Brak", value: "none"},
];

export type PuckImageItemProps = {
    image: string;
    alt?: string;
    link?: any;
    width?: string;
    height?: string;
    aspectRatio?: string;
    align?: string;
    objectFit?: string;
    objectPosition?: string;
    borderRadius?: number;
    elevation?: number;
    opacity?: number;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    blur?: number;
    overlayColor?: string;
    overlayOpacity?: number;
    hoverEffect?: string;
    marginY?: number;
    padding?: number;
};

export const RenderSingleImage = ({
    image,
    alt = "",
    link = null,
    width = "100%",
    height = "auto",
    aspectRatio = "auto",
    align = "center",
    objectFit = "cover",
    objectPosition = "center center",
    borderRadius = 1,
    elevation = 0,
    opacity = 100,
    brightness = 100,
    contrast = 100,
    grayscale = 0,
    blur = 0,
    overlayColor = "#000000",
    overlayOpacity = 0,
    hoverEffect = "zoom-lift",
    marginY = 1,
    padding = 0,
    inSlider = false,
}: PuckImageItemProps & { inSlider?: boolean }) => {
    const imageUrl = getPageImageUrl(image);
    const hasLink = Boolean(link?.route);
    let href = "#";
    if (hasLink) {
        try {
            href = route(link.route, link.parameters);
        } catch (e) {
            console.error(e);
        }
    }

    const filterString = [
        `brightness(${brightness ?? 100}%)`,
        `contrast(${contrast ?? 100}%)`,
        `grayscale(${grayscale ?? 0}%)`,
        (blur ?? 0) > 0 ? `blur(${blur}px)` : "",
    ]
        .filter(Boolean)
        .join(" ");

    const hoverFilterString = [
        `brightness(${hoverEffect === "brighten" ? Math.min(200, (brightness ?? 100) + 15) : (brightness ?? 100)}%)`,
        `contrast(${contrast ?? 100}%)`,
        `grayscale(${grayscale ?? 0}%)`,
        (blur ?? 0) > 0 ? `blur(${blur}px)` : "",
    ]
        .filter(Boolean)
        .join(" ");

    const isZoom = hasLink && (hoverEffect === "zoom" || hoverEffect === "zoom-lift");
    const isLift = hasLink && (hoverEffect === "lift" || hoverEffect === "zoom-lift");

    const imageCard = (
        <Paper
            elevation={elevation ?? 0}
            sx={{
                width: width || "100%",
                height: height && height !== "auto" ? height : (inSlider ? "100%" : "auto"),
                aspectRatio: aspectRatio && aspectRatio !== "auto" ? aspectRatio : "unset",
                borderRadius: borderRadius ?? 1,
                overflow: "hidden",
                position: "relative",
                display: "block",
                p: padding ?? 0,
                bgcolor: "transparent",
                opacity: (opacity ?? 100) / 100,
                cursor: hasLink ? "pointer" : "default",
                transition: "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease",
                ...(hasLink ? {
                    "&:hover": {
                        transform: isLift ? "translateY(-4px)" : "none",
                        boxShadow: isLift ? 8 : undefined,
                        "& .puck-image-element": {
                            transform: isZoom ? "scale(1.04)" : "scale(1)",
                            filter: hoverFilterString,
                        },
                    },
                    "&:active": {
                        transform: "scale(0.98)",
                    }
                } : {})
            }}
        >
            {imageUrl ? (
                <>
                    <Box
                        component="img"
                        className="puck-image-element"
                        src={imageUrl}
                        alt={alt || link?.label || ""}
                        sx={{
                            width: "100%",
                            height: (height && height !== "auto") || (aspectRatio && aspectRatio !== "auto") || inSlider ? "100%" : "auto",
                            display: "block",
                            objectFit: (objectFit as any) || "cover",
                            objectPosition: objectPosition || "center center",
                            filter: filterString,
                            transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.3s ease",
                        }}
                    />
                    {(overlayOpacity ?? 0) > 0 && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                bgcolor: overlayColor || "#000000",
                                opacity: (overlayOpacity ?? 0) / 100,
                                pointerEvents: "none",
                                transition: "opacity 0.3s ease",
                            }}
                        />
                    )}
                </>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        minHeight: 180,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                        color: "text.secondary",
                        border: "2px dashed",
                        borderColor: "divider",
                        borderRadius: borderRadius ?? 1,
                        p: 3,
                    }}
                >
                    <ImageIcon sx={{fontSize: 48, mb: 1, opacity: 0.5}}/>
                    <Typography variant="body2">Wybierz lub wgraj zdjęcie w panelu edycji</Typography>
                </Box>
            )}
        </Paper>
    );

    const content = hasLink ? (
        <Box
            component={Link}
            href={href}
            sx={{
                display: "contents",
                textDecoration: "none",
                color: "inherit",
            }}
        >
            {imageCard}
        </Box>
    ) : (
        imageCard
    );

    return (
        <Box
            sx={{
                width: 1,
                height: inSlider ? "100%" : "auto",
                display: "flex",
                justifyContent: align || "center",
                alignItems: "center",
                my: inSlider ? 0 : (marginY ?? 1),
            }}
        >
            {content}
        </Box>
    );
};

export const PuckImage = {
    label: "Zdjęcie",
    fields: {
        image: {
            type: "custom",
            label: "Zdjęcie",
            render: ({value, onChange}: any) => (
                <ImagePickerField value={value} onChange={onChange}/>
            ),
        },
        alt: {
            type: "text",
            label: "Tekst alternatywny (alt)",
        },
        link: {
            type: "custom",
            label: "Link po kliknięciu",
            render: ({value, onChange}: any) => (
                <LinkPickerField value={value} onChange={onChange} label="Strona docelowa (opcjonalnie)"/>
            ),
        },
        hoverEffect: {
            type: "select",
            label: "Animacja po najechaniu (gdy jest linkiem)",
            options: hoverEffectOptions,
        },
        align: {
            type: "select",
            label: "Wyrównanie w kontenerze",
            options: alignOptions,
        },
        width: {
            type: "text",
            label: "Szerokość (np. 100%, 500px, auto)",
        },
        height: {
            type: "text",
            label: "Wysokość (np. auto, 350px, 50vh)",
        },
        aspectRatio: {
            type: "select",
            label: "Proporcje obrazu (Aspect Ratio)",
            options: aspectRatioOptions,
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
        borderRadius: {
            type: "number",
            label: "Zaokrąglenie rogów (0 - 10)",
            min: 0,
            max: 20,
        },
        elevation: {
            type: "number",
            label: "Cień (elevation 0 - 24)",
            min: 0,
            max: 24,
        },
        opacity: {
            type: "number",
            label: "Przezroczystość - widoczność % (0 - 100)",
            min: 0,
            max: 100,
        },
        brightness: {
            type: "number",
            label: "Jasność % (np. 100 = oryginał, <100 przyciemnienie, >100 rozjaśnienie)",
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
            label: "Kolor nakładki (np. #000000 lub #ffffff)",
        },
        overlayOpacity: {
            type: "number",
            label: "Siła nakładki koloru % (0 - 100)",
            min: 0,
            max: 100,
        },
        marginY: {
            type: "number",
            label: "Odstęp pionowy (margin Y)",
            min: 0,
            max: 15,
        },
    },
    defaultProps: {
        image: "",
        alt: "",
        link: null,
        hoverEffect: "zoom-lift",
        align: "center",
        width: "100%",
        height: "auto",
        aspectRatio: "auto",
        objectFit: "cover",
        objectPosition: "center center",
        borderRadius: 1,
        elevation: 2,
        opacity: 100,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        blur: 0,
        overlayColor: "#000000",
        overlayOpacity: 0,
        marginY: 1,
    },
    render: (props: PuckImageItemProps) => {
        return <RenderSingleImage {...props}/>;
    },
};

export default PuckImage;
