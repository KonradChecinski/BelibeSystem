import {Head, router} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    FormControlLabel,
    Grid,
    Paper,
    Switch,
    Typography
} from "@mui/material";
import {DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import {Add, Check, ArrowBack, ContentCopy} from "@mui/icons-material";
import {useMemo, useState} from "react";
import {enqueueSnackbar} from "notistack";
import axios from "axios";

export default function TiktokCategoryApiList(props) {
    const {
        shop,
        currentConfig = {},
        warehouses = [],
        warehousesError = null,
        manufacturers = [],
        manufacturersError = null,
        responsiblePersons = [],
        responsiblePersonsError = null,
        categories = [],
        existingValues = [],
        error = null,
        authUrl = null,
        callbackUrl = null,
    } = props;

    const [addedSet, setAddedSet] = useState(() => new Set((existingValues || []).map(String)));
    const [loadingIds, setLoadingIds] = useState(() => new Set());
    const [onlyLeaf, setOnlyLeaf] = useState(true);

    const createUrl = route().has("system.settings.b2c.tiktokCategory.create")
        ? route("system.settings.b2c.tiktokCategory.create")
        : "/settings/dictionaries/models/b2c/tiktok-category";

    const backUrl = route().has("system.settings.b2c.tiktokCategory")
        ? route("system.settings.b2c.tiktokCategory")
        : "/settings/dictionaries/models/b2c/tiktok-category";

    const defaultWarehouse = warehouses.find((w) => w.is_default) || warehouses[0] || null;
    const defaultManufacturer = manufacturers[0] || null;
    const defaultResponsiblePerson = responsiblePersons[0] || null;

    const envSnippet = [
        `TIKTOK_SHOP_ID=${shop?.id || currentConfig?.shop_id || ""}`,
        `TIKTOK_WAREHOUSE_ID=${defaultWarehouse?.id || currentConfig?.warehouse_id || ""}`,
        `TIKTOK_MANUFACTURER_ID=${defaultManufacturer?.id || currentConfig?.manufacturer_id || ""}`,
        `TIKTOK_RESPONSIBLE_PERSON_ID=${defaultResponsiblePerson?.id || currentConfig?.responsible_person_id || ""}`,
    ].join("\n");

    const handleCopyText = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            enqueueSnackbar(`Skopiowano ${label} do schowka`, {variant: "success"});
        } catch {
            enqueueSnackbar("Nie udało się skopiować do schowka", {variant: "error"});
        }
    };

    const handleAddCategory = async (row) => {
        const categoryId = String(row.id);
        if (addedSet.has(categoryId) || loadingIds.has(categoryId)) {
            return;
        }

        setLoadingIds((prev) => {
            const next = new Set(prev);
            next.add(categoryId);
            return next;
        });

        try {
            await axios.post(
                createUrl,
                {
                    name: row.full_path || row.local_name,
                    value: categoryId,
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            setAddedSet((prev) => {
                const next = new Set(prev);
                next.add(categoryId);
                return next;
            });

            enqueueSnackbar(`Dodano kategorię: ${row.full_path || row.local_name}`, {
                variant: "success",
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Błąd podczas dodawania kategorii do systemu", {
                variant: "error",
            });
        } finally {
            setLoadingIds((prev) => {
                const next = new Set(prev);
                next.delete(categoryId);
                return next;
            });
        }
    };

    const filteredRows = useMemo(() => {
        if (!onlyLeaf) {
            return categories;
        }
        return categories.filter((c) => Boolean(c.is_leaf));
    }, [categories, onlyLeaf]);

    const columns = [
        {
            field: "id",
            headerName: "ID kategorii",
            width: 130,
        },
        {
            field: "full_path",
            headerName: "Drzewo kategorii (pełna ścieżka)",
            flex: 2,
            minWidth: 380,
        },
        {
            field: "local_name",
            headerName: "Nazwa kategorii",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "parent_id",
            headerName: "Parent ID",
            width: 120,
        },
        {
            field: "is_leaf",
            headerName: "Końcowa (is_leaf)",
            width: 150,
            renderCell: (params) =>
                params.value ? (
                    <Chip label="Tak (Leaf)" color="success" size="small" variant="outlined"/>
                ) : (
                    <Chip label="Nie (Nadrzędna)" color="default" size="small" variant="outlined"/>
                ),
        },
        {
            field: "action",
            headerName: "Akcja",
            width: 210,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const categoryId = String(params.row.id);
                const isAdded = addedSet.has(categoryId);
                const isSaving = loadingIds.has(categoryId);

                if (isAdded) {
                    return (
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            disabled
                            startIcon={<Check/>}
                        >
                            W systemie
                        </Button>
                    );
                }

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={isSaving}
                        startIcon={<Add/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddCategory(params.row);
                        }}
                    >
                        {isSaving ? "Dodawanie..." : "Dodaj do systemu"}
                    </Button>
                );
            },
        },
    ];

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header="Kategorie z API TikTok Shop"
        >
            <Head title="Kategorie z API TikTok Shop"/>
            <Card sx={{height: "100%", width: 1, display: "flex", flexDirection: "column", p: 2, gap: 1.5}}>
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2}}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ArrowBack/>}
                            onClick={() => router.visit(backUrl)}
                        >
                            Powrót do słownika kategorii TikTok
                        </Button>
                        {shop && (
                            <Typography variant="body2" color="text.secondary">
                                Sklep: <strong>{shop.name}</strong> (ID: {shop.id}) | Wyświetlane:{" "}
                                <strong>{filteredRows.length}</strong> z {categories.length} kategorii
                            </Typography>
                        )}
                    </Box>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyLeaf}
                                onChange={(e) => setOnlyLeaf(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Pokaż tylko kategorie końcowe (is_leaf = true)"
                    />
                </Box>

                {shop && (
                    <Paper variant="outlined" sx={{p: 1.5}}>
                        <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, flexWrap: "wrap", gap: 1}}>
                            <Typography variant="subtitle2" fontWeight="bold">
                                Kody konfiguracyjne z API TikTok Shop (do wpisania w pliku .env)
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ContentCopy/>}
                                onClick={() => handleCopyText(envSnippet, "blok .env")}
                            >
                                Kopiuj cały blok .env
                            </Button>
                        </Box>

                        <Grid container spacing={1.5}>
                            <Grid item xs={12} md={3}>
                                <Box sx={{p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, height: "100%"}}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        TIKTOK_SHOP_ID
                                    </Typography>
                                    <Typography variant="body2" sx={{fontFamily: "monospace", fontWeight: "bold", wordBreak: "break-all"}}>
                                        {shop.id}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Nazwa: {shop.name}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Box sx={{p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, height: "100%"}}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        TIKTOK_WAREHOUSE_ID (Magazyny)
                                    </Typography>
                                    {warehouses.length > 0 ? (
                                        warehouses.map((w) => (
                                            <Box key={w.id} sx={{mb: 0.5}}>
                                                <Typography variant="body2" sx={{fontFamily: "monospace", fontWeight: "bold", wordBreak: "break-all"}}>
                                                    {w.id}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {w.name} ({w.type}){w.is_default ? " — domyślny" : ""}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="warning.main">
                                            Brak magazynów z API {warehousesError ? `(${warehousesError})` : ""}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Box sx={{p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, height: "100%"}}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        TIKTOK_MANUFACTURER_ID (Producenci)
                                    </Typography>
                                    {manufacturers.length > 0 ? (
                                        manufacturers.map((m) => (
                                            <Box key={m.id} sx={{mb: 0.5}}>
                                                <Typography variant="body2" sx={{fontFamily: "monospace", fontWeight: "bold", wordBreak: "break-all"}}>
                                                    {m.id}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {m.name || "Bez nazwy"}{m.email ? ` (${m.email})` : ""}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="warning.main">
                                            Brak producentów z API {manufacturersError ? `(${manufacturersError})` : ""}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Box sx={{p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, height: "100%"}}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        TIKTOK_RESPONSIBLE_PERSON_ID (Osoba odp.)
                                    </Typography>
                                    {responsiblePersons.length > 0 ? (
                                        responsiblePersons.map((rp) => (
                                            <Box key={rp.id} sx={{mb: 0.5}}>
                                                <Typography variant="body2" sx={{fontFamily: "monospace", fontWeight: "bold", wordBreak: "break-all"}}>
                                                    {rp.id}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {rp.name || "Bez nazwy"}{rp.email ? ` (${rp.email})` : ""}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="warning.main">
                                            Brak osób odpowiedzialnych z API {responsiblePersonsError ? `(${responsiblePersonsError})` : ""}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {error && (
                    <Alert severity="error">
                        <Typography variant="subtitle2">{error}</Typography>
                        {authUrl && (
                            <Typography variant="body2" sx={{mt: 0.5}}>
                                Link autoryzacyjny: <a href={authUrl} target="_blank" rel="noreferrer">{authUrl}</a>
                            </Typography>
                        )}
                        {callbackUrl && (
                            <Typography variant="body2">
                                Callback URL: <code>{callbackUrl}</code>
                            </Typography>
                        )}
                    </Alert>
                )}

                <Box sx={{flex: 1, minHeight: 400}}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {pageSize: 50, page: 0},
                            },
                        }}
                        pageSizeOptions={[20, 50, 100, 200]}
                        slots={{toolbar: GridToolbar}}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: {debounceMs: 300},
                            },
                        }}
                        disableRowSelectionOnClick
                        localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                        sx={{
                            height: "100%",
                            boxShadow: 2,
                            border: 2,
                            borderColor: "primary.light",
                            "& .MuiDataGrid-toolbarContainer": {
                                "& .MuiButton-root": {
                                    color: "text.primary",
                                },
                            },
                        }}
                    />
                </Box>
            </Card>
        </UserLayout>
    );
}

