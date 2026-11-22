import {Head, Link, router, useForm} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {
    AllInclusive,
    ArrowBack,
    BrandingWatermark,
    Category,
    CheckCircle,
    ColorLens,
    Delete,
    FolderSpecial,
    Inventory2,
    LocalOffer,
    PlaylistAddCheck,
    Save,
    Search,
    Store,
    Storefront,
    Straighten
} from "@mui/icons-material";
import {useEffect, useMemo, useState} from "react";
import {useSnackbar} from "notistack";
import {formatDiscountLabel, formatItemSummaryText, getPromotionStatus} from "@/Pages/System/Promotions/PromotionList";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {sortBySizesSortFunction} from "@/Functions/sortBySizes";

const TYPE_META = {
    1: {
        label: "PRODUKT (ROZMIAR)",
        hierarchyLabel: "Poziom 1 — Produkt / Rozmiar",
        description: "Promocja przypisana do konkretnego rozmiaru (pojedynczego produktu) w danym kolorze modelu",
        color: "error",
        icon: Straighten,
    },
    2: {
        label: "KOLOR MODELU",
        hierarchyLabel: "Poziom 2 — Kolor modelu",
        description: "Promocja obejmuje wszystkie rozmiary wybranego koloru w modelu",
        color: "warning",
        icon: ColorLens,
    },
    3: {
        label: "CAŁY MODEL",
        hierarchyLabel: "Poziom 3 — Cały model",
        description: "Promocja obejmuje wszystkie kolory i rozmiary danego modelu",
        color: "success",
        icon: Inventory2,
    },
    4: {
        label: "KATEGORIA",
        hierarchyLabel: "Poziom 4 — Kategoria",
        description: "Promocja obejmuje wszystkie modele należące do wybranej kategorii",
        color: "info",
        icon: Category,
    },
    5: {
        label: "GRUPA TOWAROWA",
        hierarchyLabel: "Poziom 5 — Grupa towarowa",
        description: "Promocja obejmuje wszystkie modele z wybranej grupy towarowej",
        color: "primary",
        icon: FolderSpecial,
    },
    6: {
        label: "MARKA / PRODUCENT",
        hierarchyLabel: "Poziom 6 — Marka / Producent",
        description: "Promocja obejmuje wszystkie modele danej marki",
        color: "secondary",
        icon: BrandingWatermark,
    },
    7: {
        label: "CAŁY ASORTYMENT (WSZYSTKO)",
        hierarchyLabel: "Poziom 7 — Cały asortyment",
        description: "Promocja obejmuje wszystkie towary w systemie",
        color: "secondary",
        icon: AllInclusive,
    },
};

function formatDateTimeForInput(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatMoneyGrosze(grosze, currency = "PLN") {
    if (grosze === null || grosze === undefined) return "—";
    return (Number(grosze) / 100).toLocaleString("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + ` ${currency}`;
}

function calculatePreviewPromoPrice(basePriceGrosze, discountType, discountValue) {
    if (!basePriceGrosze || basePriceGrosze <= 0) return 0;
    const type = Number(discountType);
    const val = Number(discountValue);
    if (type === 1) {
        return Math.max(0, Math.min(basePriceGrosze, Math.round(basePriceGrosze - (basePriceGrosze * (val / 10000)))));
    }
    if (type === 2) {
        return Math.max(0, Math.min(basePriceGrosze, basePriceGrosze - val));
    }
    if (type === 3) {
        return Math.max(0, Math.min(basePriceGrosze, val));
    }
    return basePriceGrosze;
}

export default function PromotionEdit(props) {
    const {promotion, dictionaries} = props;
    const {enqueueSnackbar} = useSnackbar();

    const status = getPromotionStatus(promotion);
    const [unlimitedTime, setUnlimitedTime] = useState(!Boolean(promotion.ends_at));

    const {data, setData, patch, processing, errors, transform} = useForm({
        name: promotion.name || "",
        description: promotion.description || "",
        channel: promotion.is_b2b ? "b2b" : "b2c",
        discount_type: promotion.discount_type || 1,
        discount_value_input: (Number(promotion.discount_value || 0) / 100),
        show_discount_on_invoice: Boolean(promotion.show_discount_on_invoice),
        is_active: Boolean(promotion.is_active),
        starts_at: formatDateTimeForInput(promotion.starts_at),
        ends_at: formatDateTimeForInput(promotion.ends_at),
    });

    useEffect(() => {
        setUnlimitedTime(!Boolean(promotion.ends_at));
    }, [promotion.ends_at]);

    transform((formData) => ({
        ...formData,
        discount_value: Math.round(Number(formData.discount_value_input || 0) * 100),
        starts_at: formData.starts_at || null,
        ends_at: unlimitedTime ? null : (formData.ends_at || null),
    }));

    const handleSaveSettings = (e) => {
        e.preventDefault();
        patch(route("system.promotions.update", {promotion: promotion.id}), {
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar("Zapisano ustawienia promocji", {variant: "success"});
            },
            onError: () => {
                enqueueSnackbar("Sprawdź poprawność pól formularza", {variant: "error"});
            }
        });
    };

    // --- Sekcja przypisywania towarów ---
    const [addTab, setAddTab] = useState("models"); // models | categories | groups | brands | everything
    const [modelAssignMode, setModelAssignMode] = useState("whole_models"); // whole_models | colors_and_products

    // Wybór wielu całych modeli
    const [selectedWholeModels, setSelectedWholeModels] = useState([]);

    // Wybór konkretnego modelu do rozwinięcia kolorów i produktów (rozmiarów)
    const [inspectedModelOption, setInspectedModelOption] = useState(null);
    const [inspectedModelDetails, setInspectedModelDetails] = useState(null);
    const [loadingModelDetails, setLoadingModelDetails] = useState(false);
    const [selectedColorIds, setSelectedColorIds] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);

    // Wybór wielu kategorii / grup / marek
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    // Zbiory już przypisanych ID w tej promocji (do szybkiego oznaczania "Już w promocji")
    const assignedSet = useMemo(() => {
        const items = promotion.items || [];
        return {
            products: new Set(items.filter(i => i.type === 1).map(i => i.product_id)),
            colors: new Set(items.filter(i => i.type === 2).map(i => i.product_model_color_id)),
            models: new Set(items.filter(i => i.type === 3).map(i => i.product_model_id)),
            categories: new Set(items.filter(i => i.type === 4).map(i => i.product_category_id)),
            groups: new Set(items.filter(i => i.type === 5).map(i => i.product_group_id)),
            brands: new Set(items.filter(i => i.type === 6).map(i => i.product_brand_id)),
            everything: items.some(i => i.type === 7),
        };
    }, [promotion.items]);

    // Pobieranie szczegółów wybranego modelu (kolory + rozmiary/produkty)
    const handleInspectModel = (modelOption) => {
        setInspectedModelOption(modelOption);
        setSelectedColorIds([]);
        setSelectedProductIds([]);
        if (!modelOption) {
            setInspectedModelDetails(null);
            return;
        }
        setLoadingModelDetails(true);
        axios.get(route("system.promotions.model.details", {productModel: modelOption.id}))
            .then((res) => {
                setInspectedModelDetails(res.data);
            })
            .catch(() => {
                enqueueSnackbar("Nie udało się pobrać kolorów i produktów modelu", {variant: "error"});
            })
            .finally(() => {
                setLoadingModelDetails(false);
            });
    };

    const addItemsToPromotion = (type, ids, successMessage, onDone) => {
        router.post(
            route("system.promotions.items.add", {promotion: promotion.id}),
            {type, ids},
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar(successMessage, {variant: "success"});
                    if (onDone) onDone();
                },
                onError: () => {
                    enqueueSnackbar("Błąd podczas dodawania pozycji do promocji", {variant: "error"});
                },
            }
        );
    };

    // Zapis zaznaczonych kolorów i/lub produktów z eksploratora modelu
    const handleAddSelectedColorsAndProducts = () => {
        if (selectedColorIds.length === 0 && selectedProductIds.length === 0) return;

        if (selectedColorIds.length > 0 && selectedProductIds.length > 0) {
            router.post(
                route("system.promotions.items.add", {promotion: promotion.id}),
                {type: 2, ids: selectedColorIds},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.post(
                            route("system.promotions.items.add", {promotion: promotion.id}),
                            {type: 1, ids: selectedProductIds},
                            {
                                preserveScroll: true,
                                onSuccess: () => {
                                    enqueueSnackbar(`Dodano ${selectedColorIds.length} kolor(ów) oraz ${selectedProductIds.length} produkt(ów) do promocji`, {variant: "success"});
                                    setSelectedColorIds([]);
                                    setSelectedProductIds([]);
                                }
                            }
                        );
                    }
                }
            );
        } else if (selectedColorIds.length > 0) {
            addItemsToPromotion(2, selectedColorIds, `Dodano wybrane kolory modelu (${selectedColorIds.length}) do promocji`, () => {
                setSelectedColorIds([]);
            });
        } else if (selectedProductIds.length > 0) {
            addItemsToPromotion(1, selectedProductIds, `Dodano wybrane produkty/rozmiary (${selectedProductIds.length}) do promocji`, () => {
                setSelectedProductIds([]);
            });
        }
    };

    // --- Sekcja listy przypisanych pozycji ---
    const [assignedFilterType, setAssignedFilterType] = useState("all"); // all | 1..7
    const [assignedSearch, setAssignedSearch] = useState("");
    const [selectedAssignedItemIds, setSelectedAssignedItemIds] = useState([]);

    const filteredAssignedItems = useMemo(() => {
        return (promotion.items || []).filter((item) => {
            if (assignedFilterType !== "all" && item.type !== Number(assignedFilterType)) {
                return false;
            }
            if (assignedSearch.trim() !== "") {
                const q = assignedSearch.toLowerCase();
                const summary = formatItemSummaryText(item).toLowerCase();
                const typeName = (TYPE_META[item.type]?.label || "").toLowerCase();
                if (!summary.includes(q) && !typeName.includes(q)) {
                    return false;
                }
            }
            return true;
        });
    }, [promotion.items, assignedFilterType, assignedSearch]);

    const assignedCountsByType = useMemo(() => {
        return (promotion.items || []).reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
        }, {});
    }, [promotion.items]);

    const handleRemoveSingleItem = (item) => {
        router.delete(route("system.promotions.items.delete", {promotion: promotion.id, promotionItem: item.id}), {
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar("Usunięto pozycję z promocji", {variant: "info"});
                setSelectedAssignedItemIds((prev) => prev.filter((id) => id !== item.id));
            }
        });
    };

    const handleRemoveBulkItems = () => {
        if (selectedAssignedItemIds.length === 0) return;
        router.delete(route("system.promotions.items.deleteBulk", {promotion: promotion.id}), {
            data: {item_ids: selectedAssignedItemIds},
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar(`Usunięto ${selectedAssignedItemIds.length} pozycji z promocji`, {variant: "info"});
                setSelectedAssignedItemIds([]);
            }
        });
    };

    const getBaseAndPromoPriceForItem = (item) => {
        let pricesObj = null;
        if (item.type === 1) {
            pricesObj = item.product?.color?.model?.prices;
        } else if (item.type === 2) {
            pricesObj = item.product_model_color?.model?.prices;
        } else if (item.type === 3) {
            pricesObj = item.product_model?.prices;
        }
        if (!pricesObj) return null;

        const basePrice = promotion.is_b2b
            ? pricesObj.wholesale_net_price
            : (pricesObj.b2c_gross_price || pricesObj.wholesale_gross_price);
        const promoPrice = calculatePreviewPromoPrice(basePrice, promotion.discount_type, promotion.discount_value);

        return {
            basePrice,
            promoPrice,
            currency: pricesObj.currency || "PLN",
            suffix: promotion.is_b2b ? "netto" : "brutto",
        };
    };

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={`Edycja promocji: ${promotion.name}`}
        >
            <Head title={`Promocja: ${promotion.name}`}/>

            <Box sx={{display: "flex", flexDirection: "column", gap: 2, pb: 5}}>
                {/* Górny pasek nawigacji i statusu */}
                <Paper elevation={2} sx={{p: 2}}>
                    <Stack
                        direction={{xs: "column", sm: "row"}}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{xs: "flex-start", sm: "center"}}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Button
                                component={Link}
                                href={route("system.promotions")}
                                variant="outlined"
                                size="small"
                                startIcon={<ArrowBack/>}
                            >
                                Powrót do listy promocji
                            </Button>
                            <Typography variant="h6" sx={{fontWeight: 700}}>
                                {promotion.name}
                            </Typography>
                            <Chip
                                icon={promotion.is_b2b ? <Store/> : <Storefront/>}
                                label={promotion.is_b2b ? "Sprzedaż B2B (Hurt)" : "Sprzedaż B2C (Sklepy / Marketplace)"}
                                color={promotion.is_b2b ? "primary" : "secondary"}
                                size="small"
                                sx={{fontWeight: 700}}
                            />
                            <Chip
                                icon={<LocalOffer/>}
                                label={formatDiscountLabel(promotion)}
                                color="error"
                                size="small"
                                sx={{fontWeight: 700}}
                            />
                            <Chip
                                label={status.label}
                                color={status.color}
                                size="small"
                            />
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                            Hierarchia ważności: <b>Produkt (rozmiar) &gt; Kolor &gt; Model &gt; Kategoria &gt; Grupa &gt; Marka &gt; Wszystko</b>
                        </Typography>
                    </Stack>
                </Paper>

                <Grid container spacing={2}>
                    {/* LEWA KOLUMNA: Ustawienia promocji */}
                    <Grid item xs={12} lg={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{fontWeight: 700}}>
                                    1. Parametry promocji
                                </Typography>
                                <Divider sx={{mb: 2}}/>

                                <form onSubmit={handleSaveSettings}>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Nazwa promocji"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            required
                                            size="small"
                                            fullWidth
                                            error={Boolean(errors.name)}
                                            helperText={errors.name}
                                        />

                                        <TextField
                                            label="Opis / notatka (opcjonalnie)"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            multiline
                                            rows={2}
                                            size="small"
                                            fullWidth
                                        />

                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Kanał sprzedaży</InputLabel>
                                            <Select
                                                value={data.channel}
                                                label="Kanał sprzedaży"
                                                onChange={(e) => setData("channel", e.target.value)}
                                            >
                                                <MenuItem value="b2b">Sprzedaż B2B (Hurt)</MenuItem>
                                                <MenuItem value="b2c">Sprzedaż B2C (Sklep internetowy, Allegro, Empik, TikTok)</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Stack direction="row" spacing={1.5}>
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>Rodzaj obniżki</InputLabel>
                                                <Select
                                                    value={data.discount_type}
                                                    label="Rodzaj obniżki"
                                                    onChange={(e) => setData("discount_type", Number(e.target.value))}
                                                >
                                                    <MenuItem value={1}>Procentowy (%)</MenuItem>
                                                    <MenuItem value={2}>Kwotowy (zł)</MenuItem>
                                                    <MenuItem value={3}>Stała cena (zł)</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <TextField
                                                label={
                                                    data.discount_type === 1
                                                        ? "Rabat (%)"
                                                        : data.discount_type === 2
                                                            ? `Obniżka (${data.channel === "b2b" ? "zł netto" : "zł brutto"})`
                                                            : `Cena (${data.channel === "b2b" ? "zł netto" : "zł brutto"})`
                                                }
                                                type="number"
                                                size="small"
                                                inputProps={{step: "0.01", min: "0.01"}}
                                                value={data.discount_value_input}
                                                onChange={(e) => setData("discount_value_input", e.target.value)}
                                                required
                                                fullWidth
                                                error={Boolean(errors.discount_value)}
                                                helperText={errors.discount_value}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {data.discount_type === 1 ? "%" : "zł"}
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>

                                        <Divider/>

                                        <Box>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Czas trwania promocji
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={unlimitedTime}
                                                        onChange={(e) => setUnlimitedTime(e.target.checked)}
                                                        size="small"
                                                    />
                                                }
                                                label="Bez czasu zakończenia (do odwołania)"
                                            />
                                            <Stack spacing={1.5} sx={{mt: 1}}>
                                                <TextField
                                                    label="Data rozpoczęcia (puste = od zaraz)"
                                                    type="datetime-local"
                                                    size="small"
                                                    value={data.starts_at}
                                                    onChange={(e) => setData("starts_at", e.target.value)}
                                                    InputLabelProps={{shrink: true}}
                                                    fullWidth
                                                />
                                                {!unlimitedTime && (
                                                    <TextField
                                                        label="Data zakończenia"
                                                        type="datetime-local"
                                                        size="small"
                                                        value={data.ends_at}
                                                        onChange={(e) => setData("ends_at", e.target.value)}
                                                        InputLabelProps={{shrink: true}}
                                                        required={!unlimitedTime}
                                                        fullWidth
                                                        error={Boolean(errors.ends_at)}
                                                        helperText={errors.ends_at}
                                                    />
                                                )}
                                            </Stack>
                                        </Box>

                                        {data.channel === "b2b" && (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={Boolean(data.show_discount_on_invoice)}
                                                        onChange={(e) => setData("show_discount_on_invoice", e.target.checked)}
                                                        size="small"
                                                    />
                                                }
                                                label="Pokazuj rabat na fakturze (gdy cena pochodzi z tej promocji)"
                                            />
                                        )}

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={Boolean(data.is_active)}
                                                    onChange={(e) => setData("is_active", e.target.checked)}
                                                    color="success"
                                                />
                                            }
                                            label="Promocja włączona (aktywna)"
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Save/>}
                                            disabled={processing}
                                            fullWidth
                                        >
                                            Zapisz parametry promocji
                                        </Button>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* PRAWA KOLUMNA: Dodawanie towarów + Lista przypisanych towarów */}
                    <Grid item xs={12} lg={8}>
                        <Stack spacing={2}>
                            {/* KARTA 2: DODAWANIE TOWARÓW DO PROMOCJI */}
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 700}}>
                                        2. Dodaj towary do promocji
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1.5}}>
                                        Wybierz co chcesz objąć promocją. Do jednej promocji możesz przypisać jednocześnie wiele modeli, poszczególnych kolorów, pojedynczych rozmiarów (produktów), kategorii, grup lub marek.
                                    </Typography>

                                    <Tabs
                                        value={addTab}
                                        onChange={(e, val) => setAddTab(val)}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        sx={{borderBottom: 1, borderColor: "divider", mb: 2}}
                                    >
                                        <Tab
                                            value="models"
                                            icon={<Inventory2 fontSize="small"/>}
                                            iconPosition="start"
                                            label="Modele / Kolory / Produkty (Rozmiary)"
                                        />
                                        <Tab
                                            value="categories"
                                            icon={<Category fontSize="small"/>}
                                            iconPosition="start"
                                            label="Kategorie"
                                        />
                                        <Tab
                                            value="groups"
                                            icon={<FolderSpecial fontSize="small"/>}
                                            iconPosition="start"
                                            label="Grupy towarowe"
                                        />
                                        <Tab
                                            value="brands"
                                            icon={<BrandingWatermark fontSize="small"/>}
                                            iconPosition="start"
                                            label="Marki"
                                        />
                                        <Tab
                                            value="everything"
                                            icon={<AllInclusive fontSize="small"/>}
                                            iconPosition="start"
                                            label="Wszystko"
                                        />
                                    </Tabs>

                                    {/* ZAKŁADKA: MODELE / KOLORY / PRODUKTY */}
                                    {addTab === "models" && (
                                        <Box>
                                            <Stack direction={{xs: "column", sm: "row"}} spacing={1} sx={{mb: 2}}>
                                                <Button
                                                    variant={modelAssignMode === "whole_models" ? "contained" : "outlined"}
                                                    color="success"
                                                    startIcon={<Inventory2/>}
                                                    onClick={() => setModelAssignMode("whole_models")}
                                                >
                                                    Przypisz całe modele (wiele naraz)
                                                </Button>
                                                <Button
                                                    variant={modelAssignMode === "colors_and_products" ? "contained" : "outlined"}
                                                    color="warning"
                                                    startIcon={<ColorLens/>}
                                                    onClick={() => setModelAssignMode("colors_and_products")}
                                                >
                                                    Wybierz poszczególne kolory lub produkty (rozmiary) modelu
                                                </Button>
                                            </Stack>

                                            {modelAssignMode === "whole_models" ? (
                                                <Paper variant="outlined" sx={{p: 2}}>
                                                    <Alert severity="success" sx={{mb: 2}}>
                                                        <b>Poziom 3 — Cały model:</b> Wszystkie kolory i rozmiary wybranych modeli zostaną objęte tą promocją.
                                                    </Alert>
                                                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems="flex-start">
                                                        <Autocomplete
                                                            multiple
                                                            fullWidth
                                                            disableCloseOnSelect
                                                            options={dictionaries.models || []}
                                                            value={selectedWholeModels}
                                                            onChange={(e, newVal) => setSelectedWholeModels(newVal)}
                                                            getOptionLabel={(opt) => `${opt.symbol} — ${opt.name}`}
                                                            isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                            renderOption={(liProps, option, {selected}) => {
                                                                const alreadyAssigned = assignedSet.models.has(option.id);
                                                                return (
                                                                    <li {...liProps} key={option.id}>
                                                                        <Checkbox checked={selected || alreadyAssigned} disabled={alreadyAssigned} sx={{mr: 1}}/>
                                                                        <Box sx={{flex: 1}}>
                                                                            <Typography variant="body2" sx={{fontWeight: 600}}>
                                                                                {option.symbol} — {option.name}
                                                                            </Typography>
                                                                        </Box>
                                                                        {alreadyAssigned && (
                                                                            <Chip label="Już przypisany" size="small" color="success" variant="outlined"/>
                                                                        )}
                                                                    </li>
                                                                );
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Wyszukaj i zaznacz modele (po symbolu lub nazwie)"
                                                                    placeholder="Wpisz symbol lub nazwę modelu..."
                                                                />
                                                            )}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            disabled={selectedWholeModels.length === 0}
                                                            onClick={() => {
                                                                const ids = selectedWholeModels.map(m => m.id);
                                                                addItemsToPromotion(3, ids, `Dodano modele (${ids.length}) do promocji`, () => {
                                                                    setSelectedWholeModels([]);
                                                                });
                                                            }}
                                                            sx={{minWidth: 210, height: 56}}
                                                        >
                                                            Dodaj modele ({selectedWholeModels.length})
                                                        </Button>
                                                    </Stack>
                                                </Paper>
                                            ) : (
                                                <Paper variant="outlined" sx={{p: 2}}>
                                                    <Alert severity="warning" sx={{mb: 2}}>
                                                        <b>Poziom 1 i 2 — Poszczególne kolory lub produkty (rozmiary) modelu:</b> Wybierz model, aby zobaczyć jego kolory i rozmiary. Możesz zaznaczyć cały kolor (wszystkie jego rozmiary) albo tylko wybrane rozmiary (produkty).
                                                    </Alert>

                                                    <Autocomplete
                                                        fullWidth
                                                        options={dictionaries.models || []}
                                                        value={inspectedModelOption}
                                                        onChange={(e, newVal) => handleInspectModel(newVal)}
                                                        getOptionLabel={(opt) => `${opt.symbol} — ${opt.name}`}
                                                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="1. Wybierz model, z którego chcesz wybrać kolory lub produkty"
                                                                placeholder="Wpisz symbol lub nazwę modelu..."
                                                            />
                                                        )}
                                                    />

                                                    {loadingModelDetails && (
                                                        <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
                                                            <CircularProgress/>
                                                        </Box>
                                                    )}

                                                    {!loadingModelDetails && inspectedModelDetails && (
                                                        <Box sx={{mt: 2}}>
                                                            <Stack
                                                                direction={{xs: "column", sm: "row"}}
                                                                justifyContent="space-between"
                                                                alignItems={{xs: "flex-start", sm: "center"}}
                                                                spacing={1}
                                                                sx={{mb: 1.5, p: 1.5, bgcolor: "action.hover", borderRadius: 1}}
                                                            >
                                                                <Box>
                                                                    <Typography variant="subtitle1" sx={{fontWeight: 700}}>
                                                                        Model: {inspectedModelDetails.symbol} — {inspectedModelDetails.name}
                                                                    </Typography>
                                                                    {inspectedModelDetails.prices && (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Cena bazowa ({promotion.is_b2b ? "B2B Netto" : "B2C Brutto"}):{" "}
                                                                            <b>
                                                                                {formatMoneyGrosze(
                                                                                    promotion.is_b2b
                                                                                        ? inspectedModelDetails.prices.wholesale_net_price
                                                                                        : (inspectedModelDetails.prices.b2c_gross_price || inspectedModelDetails.prices.wholesale_gross_price),
                                                                                    inspectedModelDetails.prices.currency
                                                                                )}
                                                                            </b>
                                                                            {" → Cena w tej promocji: "}
                                                                            <b style={{color: "#d32f2f"}}>
                                                                                {formatMoneyGrosze(
                                                                                    calculatePreviewPromoPrice(
                                                                                        promotion.is_b2b
                                                                                            ? inspectedModelDetails.prices.wholesale_net_price
                                                                                            : (inspectedModelDetails.prices.b2c_gross_price || inspectedModelDetails.prices.wholesale_gross_price),
                                                                                        promotion.discount_type,
                                                                                        promotion.discount_value
                                                                                    ),
                                                                                    inspectedModelDetails.prices.currency
                                                                                )}
                                                                            </b>
                                                                        </Typography>
                                                                    )}
                                                                </Box>

                                                                <Stack direction="row" spacing={1}>
                                                                    {assignedSet.models.has(inspectedModelDetails.id) ? (
                                                                        <Chip
                                                                            icon={<CheckCircle/>}
                                                                            label="Cały ten model jest już przypisany do promocji"
                                                                            color="success"
                                                                        />
                                                                    ) : (
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color="success"
                                                                            onClick={() => addItemsToPromotion(3, [inspectedModelDetails.id], "Dodano cały model do promocji")}
                                                                        >
                                                                            Dodaj cały model
                                                                        </Button>
                                                                    )}

                                                                    <Button
                                                                        variant="contained"
                                                                        color="warning"
                                                                        startIcon={<PlaylistAddCheck/>}
                                                                        disabled={selectedColorIds.length === 0 && selectedProductIds.length === 0}
                                                                        onClick={handleAddSelectedColorsAndProducts}
                                                                    >
                                                                        Dodaj zaznaczone (Kolory: {selectedColorIds.length}, Produkty: {selectedProductIds.length})
                                                                    </Button>
                                                                </Stack>
                                                            </Stack>

                                                            {/* Lista kolorów i ich rozmiarów (produktów) */}
                                                            <Stack spacing={1.5}>
                                                                {[...(inspectedModelDetails.colors || [])].sort(sortByColorShortcut).map((color) => {
                                                                    const isColorAssigned = assignedSet.colors.has(color.id);
                                                                    const isColorChecked = selectedColorIds.includes(color.id);
                                                                    const firstImage = color.images?.[0];
                                                                    const colorIcon = color.color_icon;
                                                                    const sortedProducts = [...(color.products || [])].sort((a, b) =>
                                                                        sortBySizesSortFunction(a.size?.name || "", b.size?.name || "")
                                                                    );

                                                                    return (
                                                                        <Paper
                                                                            key={color.id}
                                                                            variant="outlined"
                                                                            sx={{
                                                                                p: 1.5,
                                                                                borderColor: isColorChecked || isColorAssigned ? "warning.main" : "divider",
                                                                                borderWidth: isColorChecked || isColorAssigned ? 2 : 1,
                                                                            }}
                                                                        >
                                                                            <Stack
                                                                                direction={{xs: "column", sm: "row"}}
                                                                                justifyContent="space-between"
                                                                                alignItems={{xs: "flex-start", sm: "center"}}
                                                                                spacing={1.5}
                                                                            >
                                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                                    <Box
                                                                                        component="img"
                                                                                        src={route("images.webp", {slug: firstImage?.slug || "brak.jpg"})}
                                                                                        alt={color.name}
                                                                                        sx={{width: 44, height: 60, objectFit: "cover", borderRadius: 1, border: 1, borderColor: "divider"}}
                                                                                    />
                                                                                    {colorIcon && (
                                                                                        colorIcon.type === 1 ? (
                                                                                            <Box
                                                                                                component="img"
                                                                                                src={route("colorIcons", {path: colorIcon.path})}
                                                                                                sx={{width: 24, height: 24, borderRadius: "50%", border: 1}}
                                                                                            />
                                                                                        ) : (
                                                                                            <Box
                                                                                                sx={{width: 24, height: 24, borderRadius: "50%", bgcolor: colorIcon.hex, border: 1}}
                                                                                            />
                                                                                        )
                                                                                    )}
                                                                                    <Box>
                                                                                        <Typography variant="subtitle1" sx={{fontWeight: 700}}>
                                                                                            Kolor {color.shortcut} — {color.name}
                                                                                        </Typography>
                                                                                        <Typography variant="caption" color="text.secondary">
                                                                                            Liczba rozmiarów (produktów): {sortedProducts.length}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Stack>

                                                                                <Box>
                                                                                    {isColorAssigned ? (
                                                                                        <Chip
                                                                                            icon={<CheckCircle/>}
                                                                                            label="Cały kolor już w tej promocji"
                                                                                            color="warning"
                                                                                            size="small"
                                                                                        />
                                                                                    ) : (
                                                                                        <FormControlLabel
                                                                                            control={
                                                                                                <Checkbox
                                                                                                    color="warning"
                                                                                                    checked={isColorChecked}
                                                                                                    onChange={(e) => {
                                                                                                        if (e.target.checked) {
                                                                                                            setSelectedColorIds((prev) => [...prev, color.id]);
                                                                                                        } else {
                                                                                                            setSelectedColorIds((prev) => prev.filter((id) => id !== color.id));
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                            }
                                                                                            label={<b>Cały kolor w promocji (Poziom 2)</b>}
                                                                                        />
                                                                                    )}
                                                                                </Box>
                                                                            </Stack>

                                                                            <Divider sx={{my: 1}}/>

                                                                            <Typography variant="caption" color="text.secondary" sx={{display: "block", mb: 0.75}}>
                                                                                Lub zaznacz tylko poszczególne produkty (rozmiary) tego koloru (Poziom 1):
                                                                            </Typography>

                                                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                                                {sortedProducts.map((prod) => {
                                                                                    const isProdAssigned = assignedSet.products.has(prod.id);
                                                                                    const isProdChecked = selectedProductIds.includes(prod.id);

                                                                                    return (
                                                                                        <Paper
                                                                                            key={prod.id}
                                                                                            variant="outlined"
                                                                                            onClick={() => {
                                                                                                if (isProdAssigned) return;
                                                                                                setSelectedProductIds((prev) =>
                                                                                                    prev.includes(prod.id)
                                                                                                        ? prev.filter((id) => id !== prod.id)
                                                                                                        : [...prev, prod.id]
                                                                                                );
                                                                                            }}
                                                                                            sx={{
                                                                                                px: 1.25,
                                                                                                py: 0.5,
                                                                                                cursor: isProdAssigned ? "default" : "pointer",
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                gap: 0.75,
                                                                                                borderColor: isProdChecked || isProdAssigned ? "error.main" : "divider",
                                                                                                bgcolor: isProdChecked ? "rgba(211, 47, 47, 0.08)" : "transparent",
                                                                                            }}
                                                                                        >
                                                                                            <Checkbox
                                                                                                size="small"
                                                                                                color="error"
                                                                                                checked={isProdChecked || isProdAssigned}
                                                                                                disabled={isProdAssigned}
                                                                                                sx={{p: 0}}
                                                                                            />
                                                                                            <Box>
                                                                                                <Typography variant="body2" sx={{fontWeight: 700, lineHeight: 1.2}}>
                                                                                                    Rozm. {prod.size?.name || "?"}
                                                                                                </Typography>
                                                                                                <Typography variant="caption" color="text.secondary" sx={{display: "block", lineHeight: 1.1}}>
                                                                                                    {prod.symbol}
                                                                                                </Typography>
                                                                                            </Box>
                                                                                            {isProdAssigned && (
                                                                                                <Chip label="Już dodany" size="small" color="error" sx={{height: 18, fontSize: 10}}/>
                                                                                            )}
                                                                                        </Paper>
                                                                                    );
                                                                                })}
                                                                            </Stack>
                                                                        </Paper>
                                                                    );
                                                                })}
                                                            </Stack>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            )}
                                        </Box>
                                    )}

                                    {/* ZAKŁADKA: KATEGORIE */}
                                    {addTab === "categories" && (
                                        <Paper variant="outlined" sx={{p: 2}}>
                                            <Alert severity="info" sx={{mb: 2}}>
                                                <b>Poziom 4 — Kategoria:</b> Wszystkie modele przypisane do wybranych kategorii zostaną objęte tą promocją.
                                            </Alert>
                                            <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems="flex-start">
                                                <Autocomplete
                                                    multiple
                                                    fullWidth
                                                    disableCloseOnSelect
                                                    options={dictionaries.categories || []}
                                                    value={selectedCategories}
                                                    onChange={(e, newVal) => setSelectedCategories(newVal)}
                                                    getOptionLabel={(opt) => opt.name}
                                                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                    renderOption={(liProps, option, {selected}) => {
                                                        const already = assignedSet.categories.has(option.id);
                                                        return (
                                                            <li {...liProps} key={option.id}>
                                                                <Checkbox checked={selected || already} disabled={already} sx={{mr: 1}}/>
                                                                <Box sx={{flex: 1}}>{option.name}</Box>
                                                                {already && <Chip label="Już przypisana" size="small" color="info" variant="outlined"/>}
                                                            </li>
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Wybierz jedną lub wiele kategorii" placeholder="Szukaj kategorii..."/>
                                                    )}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    disabled={selectedCategories.length === 0}
                                                    onClick={() => {
                                                        const ids = selectedCategories.map(c => c.id);
                                                        addItemsToPromotion(4, ids, `Dodano kategorie (${ids.length}) do promocji`, () => {
                                                            setSelectedCategories([]);
                                                        });
                                                    }}
                                                    sx={{minWidth: 210, height: 56}}
                                                >
                                                    Dodaj kategorie ({selectedCategories.length})
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    )}

                                    {/* ZAKŁADKA: GRUPY */}
                                    {addTab === "groups" && (
                                        <Paper variant="outlined" sx={{p: 2}}>
                                            <Alert severity="info" sx={{mb: 2}}>
                                                <b>Poziom 5 — Grupa towarowa:</b> Wszystkie modele z wybranych grup towarowych zostaną objęte tą promocją.
                                            </Alert>
                                            <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems="flex-start">
                                                <Autocomplete
                                                    multiple
                                                    fullWidth
                                                    disableCloseOnSelect
                                                    options={dictionaries.groups || []}
                                                    value={selectedGroups}
                                                    onChange={(e, newVal) => setSelectedGroups(newVal)}
                                                    getOptionLabel={(opt) => opt.name}
                                                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                    renderOption={(liProps, option, {selected}) => {
                                                        const already = assignedSet.groups.has(option.id);
                                                        return (
                                                            <li {...liProps} key={option.id}>
                                                                <Checkbox checked={selected || already} disabled={already} sx={{mr: 1}}/>
                                                                <Box sx={{flex: 1}}>{option.name}</Box>
                                                                {already && <Chip label="Już przypisana" size="small" color="primary" variant="outlined"/>}
                                                            </li>
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Wybierz jedną lub wiele grup towarowych" placeholder="Szukaj grupy..."/>
                                                    )}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={selectedGroups.length === 0}
                                                    onClick={() => {
                                                        const ids = selectedGroups.map(g => g.id);
                                                        addItemsToPromotion(5, ids, `Dodano grupy (${ids.length}) do promocji`, () => {
                                                            setSelectedGroups([]);
                                                        });
                                                    }}
                                                    sx={{minWidth: 210, height: 56}}
                                                >
                                                    Dodaj grupy ({selectedGroups.length})
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    )}

                                    {/* ZAKŁADKA: MARKI */}
                                    {addTab === "brands" && (
                                        <Paper variant="outlined" sx={{p: 2}}>
                                            <Alert severity="info" sx={{mb: 2}}>
                                                <b>Poziom 6 — Marka (Producent):</b> Wszystkie modele wybranych marek zostaną objęte tą promocją.
                                            </Alert>
                                            <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems="flex-start">
                                                <Autocomplete
                                                    multiple
                                                    fullWidth
                                                    disableCloseOnSelect
                                                    options={dictionaries.brands || []}
                                                    value={selectedBrands}
                                                    onChange={(e, newVal) => setSelectedBrands(newVal)}
                                                    getOptionLabel={(opt) => opt.name}
                                                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                    renderOption={(liProps, option, {selected}) => {
                                                        const already = assignedSet.brands.has(option.id);
                                                        return (
                                                            <li {...liProps} key={option.id}>
                                                                <Checkbox checked={selected || already} disabled={already} sx={{mr: 1}}/>
                                                                <Box sx={{flex: 1}}>{option.name}</Box>
                                                                {already && <Chip label="Już przypisana" size="small" color="secondary" variant="outlined"/>}
                                                            </li>
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Wybierz jedną lub wiele marek" placeholder="Szukaj marki..."/>
                                                    )}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    disabled={selectedBrands.length === 0}
                                                    onClick={() => {
                                                        const ids = selectedBrands.map(b => b.id);
                                                        addItemsToPromotion(6, ids, `Dodano marki (${ids.length}) do promocji`, () => {
                                                            setSelectedBrands([]);
                                                        });
                                                    }}
                                                    sx={{minWidth: 210, height: 56}}
                                                >
                                                    Dodaj marki ({selectedBrands.length})
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    )}

                                    {/* ZAKŁADKA: WSZYSTKO */}
                                    {addTab === "everything" && (
                                        <Paper variant="outlined" sx={{p: 3, textAlign: "center"}}>
                                            <AllInclusive color="secondary" sx={{fontSize: 48, mb: 1}}/>
                                            <Typography variant="h6" gutterBottom>
                                                Poziom 7 — Promocja na cały asortyment (Wszystko)
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                                Objęcie promocją całego asortymentu sprawi, że każdy produkt będzie w tej promocji (chyba że ma bardziej szczegółową promocję na wyższym poziomie).
                                            </Typography>
                                            {assignedSet.everything ? (
                                                <Chip
                                                    icon={<CheckCircle/>}
                                                    label="Cały asortyment jest już przypisany do tej promocji"
                                                    color="secondary"
                                                />
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<AllInclusive/>}
                                                    onClick={() => addItemsToPromotion(7, [], "Przypisano cały asortyment do promocji")}
                                                >
                                                    Przypisz promocję na cały asortyment (Wszystko)
                                                </Button>
                                            )}
                                        </Paper>
                                    )}
                                </CardContent>
                            </Card>

                            {/* KARTA 3: LISTA PRZYPISANYCH ELEMENTÓW (CZYTELNY PODGLĄD ZAKRESU PROMOCJI) */}
                            <Card elevation={2}>
                                <CardContent>
                                    <Stack
                                        direction={{xs: "column", sm: "row"}}
                                        justifyContent="space-between"
                                        alignItems={{xs: "flex-start", sm: "center"}}
                                        spacing={1.5}
                                        sx={{mb: 1.5}}
                                    >
                                        <Box>
                                            <Typography variant="h6" sx={{fontWeight: 700}}>
                                                3. Przypisane do tej promocji ({promotion.items?.length || 0})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Każda pozycja posiada oznaczenie czy dotyczy konkretnego produktu (rozmiaru), koloru, całego modelu, kategorii, grupy czy marki.
                                            </Typography>
                                        </Box>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {selectedAssignedItemIds.length > 0 && (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<Delete/>}
                                                    onClick={handleRemoveBulkItems}
                                                >
                                                    Usuń zaznaczone ({selectedAssignedItemIds.length})
                                                </Button>
                                            )}
                                            <TextField
                                                size="small"
                                                placeholder="Filtruj przypisane..."
                                                value={assignedSearch}
                                                onChange={(e) => setAssignedSearch(e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Search fontSize="small"/>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>
                                    </Stack>

                                    {/* Zakładki filtrowania po poziomie (Produkt / Kolor / Model / Kategoria / Grupa / Marka / Wszystko) */}
                                    <Tabs
                                        value={assignedFilterType}
                                        onChange={(e, val) => setAssignedFilterType(val)}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        sx={{borderBottom: 1, borderColor: "divider", mb: 2}}
                                    >
                                        <Tab value="all" label={`Wszystkie (${promotion.items?.length || 0})`}/>
                                        <Tab value="1" label={`Produkty / Rozmiary (${assignedCountsByType[1] || 0})`}/>
                                        <Tab value="2" label={`Kolory modelu (${assignedCountsByType[2] || 0})`}/>
                                        <Tab value="3" label={`Modele (${assignedCountsByType[3] || 0})`}/>
                                        <Tab value="4" label={`Kategorie (${assignedCountsByType[4] || 0})`}/>
                                        <Tab value="5" label={`Grupy (${assignedCountsByType[5] || 0})`}/>
                                        <Tab value="6" label={`Marki (${assignedCountsByType[6] || 0})`}/>
                                        <Tab value="7" label={`Wszystko (${assignedCountsByType[7] || 0})`}/>
                                    </Tabs>

                                    {filteredAssignedItems.length === 0 ? (
                                        <Paper variant="outlined" sx={{p: 4, textAlign: "center"}}>
                                            <Typography variant="body1" color="text.secondary">
                                                Brak przypisanych towarów w tym widoku. Użyj sekcji "2. Dodaj towary do promocji" powyżej.
                                            </Typography>
                                        </Paper>
                                    ) : (
                                        <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                size="small"
                                                                checked={
                                                                    filteredAssignedItems.length > 0 &&
                                                                    filteredAssignedItems.every((i) => selectedAssignedItemIds.includes(i.id))
                                                                }
                                                                indeterminate={
                                                                    filteredAssignedItems.some((i) => selectedAssignedItemIds.includes(i.id)) &&
                                                                    !filteredAssignedItems.every((i) => selectedAssignedItemIds.includes(i.id))
                                                                }
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedAssignedItemIds(filteredAssignedItems.map((i) => i.id));
                                                                    } else {
                                                                        setSelectedAssignedItemIds([]);
                                                                    }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{fontWeight: 700}}>Typ / Poziom</TableCell>
                                                        <TableCell sx={{fontWeight: 700}}>Szczegóły przypisanego elementu</TableCell>
                                                        <TableCell sx={{fontWeight: 700}} align="right">Podgląd ceny</TableCell>
                                                        <TableCell sx={{fontWeight: 700}} align="center">Usuń</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredAssignedItems.map((item) => {
                                                        const meta = TYPE_META[item.type] || TYPE_META[3];
                                                        const IconComp = meta.icon;
                                                        const pricePreview = getBaseAndPromoPriceForItem(item);
                                                        const isChecked = selectedAssignedItemIds.includes(item.id);

                                                        return (
                                                            <TableRow key={item.id} hover selected={isChecked}>
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        size="small"
                                                                        checked={isChecked}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedAssignedItemIds((prev) => [...prev, item.id]);
                                                                            } else {
                                                                                setSelectedAssignedItemIds((prev) => prev.filter((id) => id !== item.id));
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{whiteSpace: "nowrap"}}>
                                                                    <Tooltip title={meta.description}>
                                                                        <Chip
                                                                            icon={<IconComp fontSize="small"/>}
                                                                            label={meta.label}
                                                                            color={meta.color}
                                                                            size="small"
                                                                            sx={{fontWeight: 700}}
                                                                        />
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.type === 1 && (
                                                                        <Box>
                                                                            <Typography variant="body2" sx={{fontWeight: 700}}>
                                                                                Produkt: {item.product?.symbol} — Rozmiar: {item.product?.size?.name || "?"}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                Model: <b>{item.product?.color?.model?.symbol}</b> ({item.product?.color?.model?.name}) • Kolor: <b>{item.product?.color?.shortcut}</b> ({item.product?.color?.name})
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    {item.type === 2 && (
                                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                                            {item.product_model_color?.color_icon && (
                                                                                item.product_model_color.color_icon.type === 1 ? (
                                                                                    <Box
                                                                                        component="img"
                                                                                        src={route("colorIcons", {path: item.product_model_color.color_icon.path})}
                                                                                        sx={{width: 20, height: 20, borderRadius: "50%", border: 1}}
                                                                                    />
                                                                                ) : (
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: 20,
                                                                                            height: 20,
                                                                                            borderRadius: "50%",
                                                                                            bgcolor: item.product_model_color.color_icon.hex,
                                                                                            border: 1
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            )}
                                                                            <Box>
                                                                                <Typography variant="body2" sx={{fontWeight: 700}}>
                                                                                    Kolor {item.product_model_color?.shortcut} — {item.product_model_color?.name}
                                                                                </Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    Model: <b>{item.product_model_color?.model?.symbol}</b> ({item.product_model_color?.model?.name})
                                                                                </Typography>
                                                                            </Box>
                                                                        </Stack>
                                                                    )}
                                                                    {item.type === 3 && (
                                                                        <Box>
                                                                            <Typography variant="body2" sx={{fontWeight: 700}}>
                                                                                Model: {item.product_model?.symbol}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {item.product_model?.name} (wszystkie kolory i rozmiary)
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    {item.type >= 4 && (
                                                                        <Typography variant="body2" sx={{fontWeight: 600}}>
                                                                            {formatItemSummaryText(item)}
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="right" sx={{whiteSpace: "nowrap"}}>
                                                                    {pricePreview ? (
                                                                        <Box>
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="text.secondary"
                                                                                sx={{textDecoration: "line-through", mr: 1}}
                                                                            >
                                                                                {formatMoneyGrosze(pricePreview.basePrice, pricePreview.currency)}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="body2"
                                                                                component="span"
                                                                                color="error.main"
                                                                                sx={{fontWeight: 700}}
                                                                            >
                                                                                {formatMoneyGrosze(pricePreview.promoPrice, pricePreview.currency)}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary" sx={{display: "block"}}>
                                                                                ({pricePreview.suffix})
                                                                            </Typography>
                                                                        </Box>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Wg cen przypisanych modeli ({formatDiscountLabel(promotion)})
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Tooltip title="Usuń z promocji">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => handleRemoveSingleItem(item)}
                                                                        >
                                                                            <Delete fontSize="small"/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </UserLayout>
    );
}
