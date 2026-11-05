import {useEffect, useState} from "react";
import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {Subiekt} from "@/Icons/Subiekt";
import {B2B} from "@/Icons/B2B";
import {Belibe} from "@/Icons/Belibe";
import {Empik} from "@/Icons/Empik";
import {Tiktok} from "@/Icons/Tiktok";

export default function ShowChannelsCell({row, color, props, readOnly}) {
    const [channels, setChannels] = useState({
        show_in_subiekt: Boolean(row.show_in_subiekt),
        show_in_b2b: Boolean(row.show_in_b2b),
        show_in_b2c: Boolean(row.show_in_b2c),
        show_in_empik: Boolean(row.show_in_empik),
        show_in_tiktok: Boolean(row.show_in_tiktok),
    });

    useEffect(() => {
        setChannels({
            show_in_subiekt: Boolean(row.show_in_subiekt),
            show_in_b2b: Boolean(row.show_in_b2b),
            show_in_b2c: Boolean(row.show_in_b2c),
            show_in_empik: Boolean(row.show_in_empik),
            show_in_tiktok: Boolean(row.show_in_tiktok),
        });
    }, [
        row.id,
        row.show_in_subiekt,
        row.show_in_b2b,
        row.show_in_b2c,
        row.show_in_empik,
        row.show_in_tiktok,
    ]);

    const colorWithImages = props?.productModel?.colors_with_images?.find((c) => c.id === color?.id);

    const cannotEditSubiekt = Boolean(row.quantity_total);

    const cannotEditB2B =
        !Boolean(color?.color_icon) ||
        !Boolean(props?.productModel?.name) ||
        !Boolean(props?.productModel?.symbol) ||
        !Boolean(color?.name) ||
        !Boolean(props?.productModel?.description_b2b) ||
        !Boolean(props?.productModel?.categories?.length) ||
        !Boolean(row.size) ||
        !Boolean(row.barcodes?.length);

    const cannotEditB2C =
        !Boolean(props?.productModel?.brand) ||
        !Boolean(props?.productModel?.b2c_category) ||
        !Boolean(props?.productModel?.b2c_variant) ||
        !Boolean(props?.productModel?.description_b2c) ||
        !Boolean(colorWithImages?.b2c_color_id) ||
        !Boolean(colorWithImages?.b2c_product_name) ||
        !Boolean(row.size) ||
        !Boolean(row.barcodes?.length);

    const cannotEditEmpik =
        !Boolean(props?.productModel?.brand) ||
        !Boolean(props?.productModel?.description_b2c) ||
        !Boolean(colorWithImages?.images?.filter((i) => i.type === 1).length) ||
        !Boolean(row.name_b2c) ||
        !Boolean(row.size) ||
        !Boolean(row.barcodes?.length);

    const cannotEditTikTok =
        !Boolean(props?.productModel?.brand) ||
        !Boolean(props?.productModel?.tiktok_category) ||
        !Boolean(props?.productModel?.description_b2c) ||
        !Boolean(colorWithImages?.images?.filter((i) => i.type === 1).length) ||
        !Boolean(colorWithImages?.b2c_product_name) ||
        !Boolean(row.size) ||
        !Boolean(row.barcodes?.length);

    const channelDefinitions = [
        {
            field: "show_in_subiekt",
            label: "Subiekt",
            IconComponent: Subiekt,
            sx: {width: 21, height: 21},
            disabled: cannotEditSubiekt || readOnly,
            reason: cannotEditSubiekt
                ? "Nie można wyłączyć towaru posiadającego historię stanów w Subiekcie"
                : null,
        },
        {
            field: "show_in_b2b",
            label: "Platforma B2B",
            IconComponent: B2B,
            sx: {width: 23, height: 23},
            disabled: cannotEditB2B || readOnly,
            reason: cannotEditB2B
                ? "Wymagane: nazwa i symbol modelu, kategoria i opis B2B, nazwa i ikona koloru, rozmiar oraz kod kreskowy"
                : null,
        },
        {
            field: "show_in_b2c",
            label: "Sklep Belibe (B2C)",
            IconComponent: Belibe,
            sx: {width: 22, height: 22},
            disabled: cannotEditB2C || readOnly,
            reason: cannotEditB2C
                ? "Wymagane: marka, kategoria B2C, wariant, opis B2C, kolor i nazwa produktu do sklepu w edycji koloru, rozmiar oraz kod kreskowy"
                : null,
        },
        {
            field: "show_in_empik",
            label: "Empik",
            IconComponent: Empik,
            sx: {width: 22, height: 22},
            disabled: cannotEditEmpik || readOnly,
            reason: cannotEditEmpik
                ? "Wymagane: marka, opis B2C, zdjęcia produktowe, nazwa B2C w produkcie, rozmiar oraz kod kreskowy"
                : null,
        },
        {
            field: "show_in_tiktok",
            label: "TikTok Shop",
            IconComponent: Tiktok,
            sx: {width: 26, height: 26},
            disabled: cannotEditTikTok || readOnly,
            reason: cannotEditTikTok
                ? "Wymagane: marka, kategoria TikTok i opis B2C, nazwa produktu do sklepu (B2C) w edycji koloru, zdjęcia produktowe, rozmiar oraz kod EAN"
                : null,
        },
    ];

    const handleToggle = (field) => (e) => {
        e.stopPropagation();
        const nextValue = !channels[field];

        setChannels((prev) => ({
            ...prev,
            [field]: nextValue,
        }));

        router.post(
            route("system.products.show.update", {product: row.id}),
            {
                id: row.id,
                [field]: nextValue,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Zapisano widoczność produktu", {variant: "success"});
                },
                onError: (errors) => {
                    console.error(errors);
                    setChannels((prev) => ({
                        ...prev,
                        [field]: !nextValue,
                    }));
                    enqueueSnackbar("Błąd przy zapisie", {variant: "error"});
                },
            }
        );
    };

    const popupContent = (
        <Paper
            elevation={8}
            onClick={(e) => e.stopPropagation()}
            sx={{
                p: 1.5,
                minWidth: 280,
                maxWidth: 350,
                bgcolor: "background.paper",
                color: "text.primary",
                border: 1,
                borderColor: "divider",
            }}
        >
            <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 0.5}}>
                Kanały sprzedaży ({row.size?.name || row.symbol})
            </Typography>
            <Divider sx={{mb: 1}}/>
            <Box sx={{display: "flex", flexDirection: "column", gap: 0.5}}>
                {channelDefinitions.map((ch) => {
                    const active = Boolean(channels[ch.field]);
                    const Logo = ch.IconComponent;
                    return (
                        <Box
                            key={ch.field}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 0.5,
                                py: 0.25,
                                borderRadius: 1,
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}
                        >
                            <FormControlLabel
                                sx={{m: 0, flex: 1}}
                                control={
                                    <Checkbox
                                        size="small"
                                        disabled={ch.disabled}
                                        checked={active}
                                        onChange={handleToggle(ch.field)}
                                    />
                                }
                                label={
                                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                        <Logo
                                            sx={{
                                                width: 22,
                                                height: 22,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                filter: active ? "none" : "grayscale(100%)",
                                                opacity: active ? 1 : 0.35,
                                                transition: "all 0.15s ease-in-out",
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: active ? 600 : 400,
                                                color: ch.disabled ? "text.disabled" : "text.primary",
                                            }}
                                        >
                                            {ch.label}
                                        </Typography>
                                    </Box>
                                }
                            />
                            {ch.reason && (
                                <Tooltip title={ch.reason} arrow placement="right">
                                    <InfoOutlined fontSize="small" color="warning" sx={{ml: 1, cursor: "help"}}/>
                                </Tooltip>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );

    return (
        <Tooltip
            title={popupContent}
            enterDelay={100}
            leaveDelay={250}
            placement="left"
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: "transparent",
                        p: 0,
                        maxWidth: "none",
                    },
                },
            }}
        >
            <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.25,
                    py: 0.5,
                    px: 1,
                    cursor: "pointer",
                    width: "100%",
                }}
            >
                {channelDefinitions.map((ch) => {
                    const active = Boolean(channels[ch.field]);
                    const Logo = ch.IconComponent;
                    return (
                        <Box
                            key={ch.field}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 26,
                                height: 26,
                                filter: active ? "none" : "grayscale(100%)",
                                opacity: active ? 1 : 0.3,
                                transition: "all 0.15s ease-in-out",
                            }}
                        >
                            <Logo sx={ch.sx}/>
                        </Box>
                    );
                })}
            </Box>
        </Tooltip>
    );
}
