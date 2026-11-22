import {Head, Link, router, useForm} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    Tabs,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {
    Add,
    AllInclusive,
    BrandingWatermark,
    Category,
    CheckCircle,
    ColorLens,
    Delete,
    Discount,
    Edit,
    FolderSpecial,
    Inventory2,
    LocalOffer,
    Schedule,
    Search,
    Store,
    Storefront,
    Straighten
} from "@mui/icons-material";
import {useMemo, useState} from "react";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";

const ITEM_TYPE_META = {
    1: {label: "Produkt (rozmiar)", shortLabel: "Produkty", color: "error", icon: Straighten},
    2: {label: "Kolor modelu", shortLabel: "Kolory", color: "warning", icon: ColorLens},
    3: {label: "Model", shortLabel: "Modele", color: "success", icon: Inventory2},
    4: {label: "Kategoria", shortLabel: "Kategorie", color: "info", icon: Category},
    5: {label: "Grupa", shortLabel: "Grupy", color: "primary", icon: FolderSpecial},
    6: {label: "Marka", shortLabel: "Marki", color: "secondary", icon: BrandingWatermark},
    7: {label: "Wszystko", shortLabel: "Wszystko", color: "secondary", icon: AllInclusive},
};

export function formatDiscountLabel(promotion) {
    const val = (Number(promotion.discount_value || 0) / 100).toLocaleString("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    if (promotion.discount_type === 1) {
        return `-${val}%`;
    }
    if (promotion.discount_type === 2) {
        return `-${val} zł`;
    }
    if (promotion.discount_type === 3) {
        return `Stała cena: ${val} zł`;
    }
    return val;
}

export function getPromotionStatus(promotion) {
    if (!promotion.is_active) {
        return {key: "disabled", label: "Wyłączona", color: "default"};
    }
    const now = new Date();
    if (promotion.starts_at && new Date(promotion.starts_at) > now) {
        return {key: "scheduled", label: "Zaplanowana", color: "info"};
    }
    if (promotion.ends_at && new Date(promotion.ends_at) < now) {
        return {key: "expired", label: "Zakończona", color: "warning"};
    }
    return {key: "active", label: "Aktywna", color: "success"};
}

export function formatItemSummaryText(item) {
    switch (item.type) {
        case 1: {
            const modelSymbol = item.product?.color?.model?.symbol || "";
            const colorShortcut = item.product?.color?.shortcut || "";
            const sizeName = item.product?.size?.name || "";
            const prodSymbol = item.product?.symbol || `#${item.product_id}`;
            return `${modelSymbol ? modelSymbol + " / " : ""}${colorShortcut ? "Kolor " + colorShortcut + " / " : ""}${sizeName ? "Rozm. " + sizeName + " " : ""}(${prodSymbol})`;
        }
        case 2: {
            const modelSymbol = item.product_model_color?.model?.symbol || "";
            const shortcut = item.product_model_color?.shortcut || "";
            const name = item.product_model_color?.name || "";
            return `${modelSymbol ? modelSymbol + " — " : ""}Kolor ${shortcut} (${name})`;
        }
        case 3:
            return item.product_model ? `${item.product_model.symbol} — ${item.product_model.name}` : `Model #${item.product_model_id}`;
        case 4:
            return item.product_category?.name || `Kategoria #${item.product_category_id}`;
        case 5:
            return item.product_group?.name || `Grupa #${item.product_group_id}`;
        case 6:
            return item.product_brand?.name || `Marka #${item.product_brand_id}`;
        case 7:
            return "Cały asortyment (wszystkie produkty)";
        default:
            return "";
    }
}

export default function PromotionList(props) {
    const {t} = useLaravelReactI18n();
    const {enqueueSnackbar} = useSnackbar();

    const [channelFilter, setChannelFilter] = useState("all"); // all | b2b | b2c
    const [statusFilter, setStatusFilter] = useState("all");   // all | active | scheduled | expired | disabled
    const [search, setSearch] = useState("");
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredPromotions = useMemo(() => {
        return (props.promotions || []).filter((promo) => {
            if (channelFilter === "b2b" && !promo.is_b2b) return false;
            if (channelFilter === "b2c" && !promo.is_b2c) return false;

            const status = getPromotionStatus(promo);
            if (statusFilter !== "all" && status.key !== statusFilter) return false;

            if (search.trim() !== "") {
                const q = search.toLowerCase();
                const inName = promo.name?.toLowerCase().includes(q) || promo.description?.toLowerCase().includes(q);
                const inItems = (promo.items || []).some((it) => formatItemSummaryText(it).toLowerCase().includes(q));
                if (!inName && !inItems) return false;
            }

            return true;
        });
    }, [props.promotions, channelFilter, statusFilter, search]);

    const handleToggleActive = (promo) => {
        router.patch(route("system.promotions.toggleActive", {promotion: promo.id}), {}, {
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar(promo.is_active ? "Promocja została wyłączona" : "Promocja została włączona", {variant: "success"});
            },
            onError: () => {
                enqueueSnackbar("Błąd przy zmianie statusu promocji", {variant: "error"});
            }
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route("system.promotions.delete", {promotion: deleteTarget.id}), {
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar("Usunięto promocję", {variant: "success"});
                setDeleteTarget(null);
            },
            onError: () => {
                enqueueSnackbar("Błąd podczas usuwania promocji", {variant: "error"});
            }
        });
    };

    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Promocje towarów (B2B i B2C)"}>
            <Head title={"Promocje"}/>

            <Box sx={{display: "flex", flexDirection: "column", gap: 2, pb: 4}}>
                {/* Pasek narzędzi i filtrów */}
                <Paper elevation={2} sx={{p: 2}}>
                    <Stack
                        direction={{xs: "column", md: "row"}}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{xs: "stretch", md: "center"}}
                    >
                        <Tabs
                            value={channelFilter}
                            onChange={(e, val) => setChannelFilter(val)}
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab value="all" label={`Wszystkie (${props.promotions?.length || 0})`}/>
                            <Tab
                                value="b2b"
                                icon={<Store fontSize="small"/>}
                                iconPosition="start"
                                label={`Sprzedaż B2B (${(props.promotions || []).filter(p => p.is_b2b).length})`}
                            />
                            <Tab
                                value="b2c"
                                icon={<Storefront fontSize="small"/>}
                                iconPosition="start"
                                label={`Sprzedaż B2C (${(props.promotions || []).filter(p => p.is_b2c).length})`}
                            />
                        </Tabs>

                        <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems="center">
                            <FormControl size="small" sx={{minWidth: 170}}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="all">Wszystkie statusy</MenuItem>
                                    <MenuItem value="active">Aktywne teraz</MenuItem>
                                    <MenuItem value="scheduled">Zaplanowane</MenuItem>
                                    <MenuItem value="expired">Zakończone</MenuItem>
                                    <MenuItem value="disabled">Wyłączone</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                size="small"
                                placeholder="Szukaj promocji lub towaru..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{minWidth: 250}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small"/>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                variant="contained"
                                startIcon={<Add/>}
                                onClick={() => setOpenCreateDialog(true)}
                                sx={{whiteSpace: "nowrap"}}
                            >
                                Nowa promocja
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* Lista kart promocji */}
                {filteredPromotions.length === 0 ? (
                    <Paper elevation={1} sx={{p: 6, textAlign: "center"}}>
                        <Discount sx={{fontSize: 56, color: "text.disabled", mb: 1}}/>
                        <Typography variant="h6" gutterBottom>
                            Brak promocji spełniających kryteria
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                            Utwórz nową promocję dla sprzedaży B2B lub B2C, a następnie przypisz do niej wybrane kategorie, grupy, marki, modele, kolory lub pojedyncze produkty.
                        </Typography>
                        <Button variant="contained" startIcon={<Add/>} onClick={() => setOpenCreateDialog(true)}>
                            Utwórz pierwszą promocję
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {filteredPromotions.map((promo) => {
                            const status = getPromotionStatus(promo);
                            const items = promo.items || [];

                            // Grupowanie przypisanych pozycji po typie (1..7)
                            const groupedCounts = items.reduce((acc, item) => {
                                acc[item.type] = (acc[item.type] || 0) + 1;
                                return acc;
                            }, {});

                            return (
                                <Grid item xs={12} key={promo.id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderLeft: 6,
                                            borderLeftColor:
                                                status.key === "active"
                                                    ? "success.main"
                                                    : status.key === "scheduled"
                                                        ? "info.main"
                                                        : status.key === "expired"
                                                            ? "warning.main"
                                                            : "grey.500",
                                        }}
                                    >
                                        <CardContent sx={{pb: "16px !important"}}>
                                            <Stack
                                                direction={{xs: "column", md: "row"}}
                                                spacing={2}
                                                justifyContent="space-between"
                                                alignItems={{xs: "flex-start", md: "center"}}
                                            >
                                                {/* Lewa część: Nazwa, kanał, wartość, czas trwania */}
                                                <Box sx={{flex: 1}}>
                                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{mb: 1}}>
                                                        {promo.is_b2b && (
                                                            <Chip
                                                                icon={<Store/>}
                                                                label="B2B (Hurt)"
                                                                color="primary"
                                                                size="small"
                                                                 sx={{fontWeight: 700}}
                                                            />
                                                        )}
                                                        {promo.is_b2c && (
                                                            <Tooltip title="Dotyczy sprzedaży B2C (Sklep internetowy / Shoper, Allegro, Empik, TikTok)">
                                                                <Chip
                                                                    icon={<Storefront/>}
                                                                    label="B2C (Sklepy / Marketplace)"
                                                                    color="secondary"
                                                                    size="small"
                                                                    sx={{fontWeight: 700}}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                        <Chip
                                                            icon={<LocalOffer/>}
                                                            label={formatDiscountLabel(promo)}
                                                            color="error"
                                                            size="small"
                                                            sx={{fontWeight: 700}}
                                                        />
                                                        <Chip
                                                            label={status.label}
                                                            color={status.color}
                                                            size="small"
                                                            variant={status.key === "active" ? "filled" : "outlined"}
                                                        />
                                                        {promo.is_b2b && (
                                                            <Chip
                                                                label={promo.show_discount_on_invoice ? "Rabat widoczny na fakturze" : "Ukryty rabat na fakturze"}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Stack>

                                                    <Typography variant="h6" sx={{fontWeight: 700}}>
                                                        {promo.name}
                                                    </Typography>
                                                    {promo.description && (
                                                        <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                                                            {promo.description}
                                                        </Typography>
                                                    )}

                                                    <Stack direction="row" spacing={2} alignItems="center" sx={{mt: 1, color: "text.secondary"}}>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <Schedule fontSize="small"/>
                                                            <Typography variant="caption">
                                                                {promo.starts_at
                                                                    ? `Od: ${new Date(promo.starts_at).toLocaleString("pl-PL", {dateStyle: "short", timeStyle: "short"})}`
                                                                    : "Od: natychmiast"}
                                                                {" • "}
                                                                {promo.ends_at
                                                                    ? `Do: ${new Date(promo.ends_at).toLocaleString("pl-PL", {dateStyle: "short", timeStyle: "short"})}`
                                                                    : "Do odwołania (bez czasu zakończenia)"}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Box>

                                                {/* Środkowa część: Czytelne podsumowanie co jest objęte promocją */}
                                                <Box sx={{flex: 1.3, width: 1}}>
                                                    <Typography variant="caption" color="text.secondary" sx={{display: "block", mb: 0.5, fontWeight: 600}}>
                                                        Zakres promocji ({items.length} {items.length === 1 ? "pozycja" : "pozycji"}):
                                                    </Typography>
                                                    {items.length === 0 ? (
                                                        <Chip
                                                            label="Brak przypisanych towarów — kliknij 'Przypisz towary / Edytuj'"
                                                            color="warning"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    ) : (
                                                        <>
                                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{mb: 1}}>
                                                                {Object.entries(ITEM_TYPE_META).map(([typeId, meta]) => {
                                                                    const count = groupedCounts[typeId];
                                                                    if (!count) return null;
                                                                    const IconComp = meta.icon;
                                                                    return (
                                                                        <Chip
                                                                            key={typeId}
                                                                            icon={<IconComp fontSize="small"/>}
                                                                            label={Number(typeId) === 7 ? "Cały asortyment (Wszystko)" : `${meta.shortLabel}: ${count}`}
                                                                            color={meta.color}
                                                                            size="small"
                                                                        />
                                                                    );
                                                                })}
                                                            </Stack>
                                                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                                {items.slice(0, 6).map((item) => {
                                                                    const meta = ITEM_TYPE_META[item.type] || ITEM_TYPE_META[3];
                                                                    return (
                                                                        <Chip
                                                                            key={item.id}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color={meta.color}
                                                                            label={`${meta.label}: ${formatItemSummaryText(item)}`}
                                                                        />
                                                                    );
                                                                })}
                                                                {items.length > 6 && (
                                                                    <Chip
                                                                        size="small"
                                                                        variant="outlined"
                                                                        label={`+ jeszcze ${items.length - 6} więcej...`}
                                                                    />
                                                                )}
                                                            </Stack>
                                                        </>
                                                    )}
                                                </Box>

                                                {/* Prawa część: Akcje */}
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title={promo.is_active ? "Włączona (kliknij, aby wyłączyć)" : "Wyłączona (kliknij, aby włączyć)"}>
                                                        <Switch
                                                            checked={Boolean(promo.is_active)}
                                                            onChange={() => handleToggleActive(promo)}
                                                            color="success"
                                                        />
                                                    </Tooltip>

                                                    <Button
                                                        component={Link}
                                                        href={route("system.promotions.edit", {promotion: promo.id})}
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<Edit/>}
                                                    >
                                                        Przypisz towary / Edytuj
                                                    </Button>

                                                    <Tooltip title="Usuń promocję">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => setDeleteTarget(promo)}
                                                        >
                                                            <Delete/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>

            {/* Dialog tworzenia nowej promocji */}
            <CreatePromotionDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
            />

            {/* Dialog potwierdzenia usunięcia */}
            <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
                <DialogTitle>Usuń promocję</DialogTitle>
                <DialogContent>
                    <Typography>
                        Czy na pewno chcesz usunąć promocję <b>{deleteTarget?.name}</b> wraz ze wszystkimi przypisanymi do niej pozycjami?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)}>Anuluj</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </UserLayout>
    );
}

function CreatePromotionDialog({open, onClose}) {
    const {enqueueSnackbar} = useSnackbar();
    const [unlimitedTime, setUnlimitedTime] = useState(true);

    const {data, setData, post, processing, errors, reset, transform} = useForm({
        name: "",
        description: "",
        channel: "b2b", // b2b | b2c
        discount_type: 1, // 1 = %, 2 = kwota zł, 3 = stała cena zł
        discount_value_input: 10,
        show_discount_on_invoice: true,
        is_active: true,
        starts_at: "",
        ends_at: "",
    });

    transform((formData) => ({
        ...formData,
        discount_value: Math.round(Number(formData.discount_value_input || 0) * 100),
        starts_at: formData.starts_at || null,
        ends_at: unlimitedTime ? null : (formData.ends_at || null),
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("system.promotions.create"), {
            onSuccess: () => {
                enqueueSnackbar("Utworzono promocję — teraz możesz przypisać do niej towary", {variant: "success"});
                reset();
                onClose();
            },
            onError: () => {
                enqueueSnackbar("Sprawdź poprawność pól formularza", {variant: "error"});
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Nowa promocja</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2.5} sx={{mt: 0.5}}>
                        <TextField
                            label="Nazwa promocji"
                            placeholder="np. Wiosenna wyprzedaż B2B / Promocja na bieliznę"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            fullWidth
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                        />

                        <TextField
                            label="Opis / notatka wewnętrzna (opcjonalnie)"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel>Przeznaczenie promocji (Kanał sprzedaży)</InputLabel>
                            <Select
                                value={data.channel}
                                label="Przeznaczenie promocji (Kanał sprzedaży)"
                                onChange={(e) => setData("channel", e.target.value)}
                            >
                                <MenuItem value="b2b">Sprzedaż B2B (Platforma hurtowa)</MenuItem>
                                <MenuItem value="b2c">Sprzedaż B2C (Sklep internetowy / Allegro / Empik / TikTok)</MenuItem>
                            </Select>
                        </FormControl>

                        <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel>Rodzaj obniżki</InputLabel>
                                <Select
                                    value={data.discount_type}
                                    label="Rodzaj obniżki"
                                    onChange={(e) => setData("discount_type", Number(e.target.value))}
                                >
                                    <MenuItem value={1}>Rabat procentowy (%)</MenuItem>
                                    <MenuItem value={2}>Rabat kwotowy (zł)</MenuItem>
                                    <MenuItem value={3}>Stała cena promocyjna (zł)</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label={
                                    data.discount_type === 1
                                        ? "Wartość rabatu (%)"
                                        : data.discount_type === 2
                                            ? `Kwota obniżki (${data.channel === "b2b" ? "zł netto" : "zł brutto"})`
                                            : `Stała cena (${data.channel === "b2b" ? "zł netto" : "zł brutto"})`
                                }
                                type="number"
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
                                Czas obowiązywania promocji
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={unlimitedTime}
                                        onChange={(e) => setUnlimitedTime(e.target.checked)}
                                    />
                                }
                                label="Promocja bez czasu zakończenia (do odwołania)"
                            />

                            <Stack direction={{xs: "column", sm: "row"}} spacing={2} sx={{mt: 1}}>
                                <TextField
                                    label="Data rozpoczęcia (opcjonalnie)"
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) => setData("starts_at", e.target.value)}
                                    InputLabelProps={{shrink: true}}
                                    fullWidth
                                    helperText="Zostaw puste, aby działała od razu"
                                />
                                {!unlimitedTime && (
                                    <TextField
                                        label="Data zakończenia"
                                        type="datetime-local"
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
                                    />
                                }
                                label="Pokazuj rabat na fakturze (gdy klient kupuje w cenie tej promocji)"
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
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Anuluj</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        Utwórz i przejdź do przypisywania towarów
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
