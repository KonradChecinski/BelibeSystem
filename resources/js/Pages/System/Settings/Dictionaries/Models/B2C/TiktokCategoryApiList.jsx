import {Head, router} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    FormControlLabel,
    Switch,
    Typography
} from "@mui/material";
import {DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import {Add, Check, ArrowBack} from "@mui/icons-material";
import {useMemo, useState} from "react";
import {enqueueSnackbar} from "notistack";
import axios from "axios";

export default function TiktokCategoryApiList(props) {
    const {
        shop,
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

