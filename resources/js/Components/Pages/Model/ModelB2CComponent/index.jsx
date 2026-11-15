import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Divider,
    Fade,
    FormControlLabel,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    createFilterOptions,
} from "@mui/material";
import { Category, Description, Save, Straighten, Storefront } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { enqueueSnackbar } from "notistack";
import TextEditorWebsite from "@/Components/TextEditor/Website";
import normalizeQuillHtml from "@/Components/TextEditor/normalizeQuillHtml";

const filterFreeSolo = createFilterOptions();

const TIKTOK_COUNTRY_OPTIONS = ["Polska"];

const TIKTOK_CARE_INSTRUCTIONS_OPTIONS = [
    "Tylko pranie ręczne",
    "Można prać w pralce",
    "Pranie w zimnej wodzie",
];

const TIKTOK_SPORTS_FEATURE_OPTIONS = [
    "Szybkoschnący",
    "Oddychający",
    "Odporny na chlor",
    "Ochrona przed promieniowaniem UV",
    "Elastyczny",
    "Rozciągliwy",
    "Odprowadzający wilgoć",
    "Lekki",
    "Wodoodporny",
    "Antybakteryjny",
];

const TIKTOK_SWIMWEAR_TOWEL_MATERIAL_OPTIONS = [
    "Poliamid",
    "Poliester",
    "Elastan",
    "Nylon",
    "Spandex",
    "Lycra",
    "PBT",
    "Bawełna",
    "Mikrofibra",
    "Frotte",
    "Włókno bambusowe",
];

const TIKTOK_COMPOSITION_OPTIONS = [
    "80% Poliamid, 20% Elastan",
    "82% Poliamid, 18% Elastan",
    "78% Poliamid, 22% Elastan",
    "85% Poliester, 15% Elastan",
    "100% Poliester",
    "55% PBT, 45% Poliester",
    "53% Poliester, 47% PBT",
    "100% Bawełna",
    "100% Mikrofibra",
    "88% Poliester, 12% Poliamid",
    "70% Bawełna, 30% Poliester",
];

const normalizeTiktokAttributes = (raw) => {
    const attrs = raw && typeof raw === "object" ? raw : {};
    const toArray = (v) => {
        if (Array.isArray(v)) return v.filter(Boolean).map(String);
        if (typeof v === "string" && v.trim() !== "") return [v.trim()];
        return [];
    };

    return {
        compliance_labels_confirmed:
            attrs.compliance_labels_confirmed !== undefined
                ? Boolean(attrs.compliance_labels_confirmed)
                : true,
        country_of_origin: attrs.country_of_origin || "Polska",
        quantity_per_pack:
            attrs.quantity_per_pack !== undefined && attrs.quantity_per_pack !== null && attrs.quantity_per_pack !== ""
                ? String(attrs.quantity_per_pack)
                : "1",
        care_instructions: toArray(attrs.care_instructions),
        sports_feature: toArray(attrs.sports_feature),
        material: toArray(attrs.material),
        composition: toArray(attrs.composition),
    };
};

export default function ModelB2CComponent(props) {
    const [edited, setEdited] = useState(false);
    const { data, setData, processing, transform, post } = useForm({
        id: props.productModel.id,
        description_b2c: props.productModel.description_b2c,

        product_b2c_category_id: props.productModel.product_b2c_category_id,
        b2c_category: props.productModel.b2c_category,

        product_clasp_id: props.productModel.product_clasp_id,
        clasp: props.productModel.clasp,

        product_empik_category_id: props.productModel.product_empik_category_id,
        empik_category: props.productModel.empik_category,

        product_tiktok_category_id: props.productModel.product_tiktok_category_id,
        tiktok_category: props.productModel.tiktok_category,

        product_size_chart_id: props.productModel.product_size_chart_id,
        size_chart: props.productModel.size_chart,

        tiktok_attributes: normalizeTiktokAttributes(props.productModel.tiktok_attributes),
    });

    useEffect(() => {
        setData({
            id: props.productModel.id,
            description_b2c: props.productModel.description_b2c,

            product_b2c_category_id: props.productModel.product_b2c_category_id,
            b2c_category: props.productModel.b2c_category,

            product_clasp_id: props.productModel.product_clasp_id,
            clasp: props.productModel.clasp,

            product_empik_category_id: props.productModel.product_empik_category_id,
            empik_category: props.productModel.empik_category,

            product_tiktok_category_id: props.productModel.product_tiktok_category_id,
            tiktok_category: props.productModel.tiktok_category,

            product_size_chart_id: props.productModel.product_size_chart_id,
            size_chart: props.productModel.size_chart,

            tiktok_attributes: normalizeTiktokAttributes(props.productModel.tiktok_attributes),
        });
    }, [props]);

    const updateTiktokAttr = (key, value) => {
        setData("tiktok_attributes", {
            ...(data.tiktok_attributes || normalizeTiktokAttributes({})),
            [key]: value,
        });
        setEdited(true);
    };

    const saveB2C = () => {
        transform((formData) => ({
            ...formData,
            description_b2c: normalizeQuillHtml(formData.description_b2c),
        }));
        post(route("system.products.model.update.b2c", { productModel: data.id }), {
            onSuccess: () => {
                setEdited(false);
                enqueueSnackbar("Zapisano B2C", { variant: "success" });
            },
            onError: (params) => {
                console.error(params);
                enqueueSnackbar("Błąd przy zapisywaniu B2C", { variant: "error" });
            },
            preserveScroll: true,
        });
    };

    const renderSizeChartPreview = (sizeChart) => {
        const tableData = sizeChart?.table_data;
        const headers = tableData?.headers || [];
        const rows = tableData?.rows || [];
        if (!headers.length) return null;

        return (
            <Paper sx={{ p: 1, maxWidth: "80vw", overflowX: "auto" }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5, px: 0.5 }}>
                    {sizeChart.name}
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {headers.map((h, i) => (
                                <TableCell key={i} sx={{ fontWeight: 700, py: 0.5, px: 1, whiteSpace: "nowrap" }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((r, rI) => (
                            <TableRow key={rI}>
                                {headers.map((_, cI) => (
                                    <TableCell
                                        key={cI}
                                        sx={{
                                            fontWeight: cI === 0 ? 600 : 400,
                                            py: 0.5,
                                            px: 1,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {r[cI] ?? ""}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    };

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 1fr" },
                        gap: 2.5,
                        alignItems: "stretch",
                    }}
                >
                    {/* Sekcja 1: Sklep B2C & Tabela rozmiarów */}
                    <Paper variant="outlined" sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, display: "flex", gap: 1, alignItems: "center" }}>
                            <Storefront color="primary" />
                            Sklep B2C i Rozmiary
                        </Typography>
                        <Divider />

                        <Autocomplete
                            disablePortal
                            id="b2c_category"
                            disabled={!props.editing}
                            options={(props.b2c?.category || []).map((e) => ({
                                id: e.id,
                                name: e.name,
                                label: e.name,
                            }))}
                            fullWidth
                            value={data.b2c_category}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            onChange={(e, value) => {
                                setData({
                                    ...data,
                                    b2c_category: value,
                                    product_b2c_category_id: value?.id ?? null,
                                });
                                setEdited(true);
                            }}
                            renderInput={(params) => <TextField {...params} label="Kategoria B2C (Sklep)" />}
                        />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Autocomplete
                                disablePortal
                                id="b2c_size_chart"
                                disabled={!props.editing}
                                options={(props.sizeCharts || []).map((e) => ({
                                    id: e.id,
                                    name: e.name,
                                    table_data: e.table_data,
                                    label: e.name,
                                }))}
                                fullWidth
                                value={data.size_chart}
                                getOptionLabel={(option) => option.name || ""}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                onChange={(e, value) => {
                                    setData({
                                        ...data,
                                        size_chart: value,
                                        product_size_chart_id: value?.id ?? null,
                                    });
                                    setEdited(true);
                                }}
                                renderInput={(params) => <TextField {...params} label="Tabela rozmiarów" />}
                            />
                            {data.size_chart?.table_data && (
                                <Tooltip
                                    title={renderSizeChartPreview(data.size_chart)}
                                    placement="right"
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: "transparent",
                                                maxWidth: "none",
                                            },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            p: 1,
                                            borderRadius: 1,
                                            border: 1,
                                            borderColor: "divider",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Straighten color="primary" />
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>
                    </Paper>

                    {/* Sekcja 2: Empik */}
                    <Paper variant="outlined" sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, display: "flex", gap: 1, alignItems: "center" }}>
                            <Category color="primary" />
                            Empik
                        </Typography>
                        <Divider />

                        <Autocomplete
                            disablePortal
                            id="b2c_empik_category"
                            disabled={!props.editing}
                            options={(props.empikCategories || []).map((e) => ({
                                id: e.id,
                                name: e.name,
                                label: e.name,
                            }))}
                            fullWidth
                            value={data.empik_category}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            onChange={(e, value) => {
                                setData({
                                    ...data,
                                    empik_category: value,
                                    product_empik_category_id: value?.id ?? null,
                                });
                                setEdited(true);
                            }}
                            renderInput={(params) => <TextField {...params} label="Kategoria Empik" />}
                        />

                        <Autocomplete
                            disablePortal
                            id="b2c_clasp"
                            disabled={!props.editing}
                            options={(props.clasps || []).map((e) => ({
                                id: e.id,
                                name: e.name,
                                label: e.name,
                            }))}
                            fullWidth
                            value={data.clasp}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            onChange={(e, value) => {
                                setData({
                                    ...data,
                                    clasp: value,
                                    product_clasp_id: value?.id ?? null,
                                });
                                setEdited(true);
                            }}
                            renderInput={(params) => <TextField {...params} label="Zapięcie" />}
                        />
                    </Paper>

                    {/* Sekcja 3: TikTok Shop */}
                    <Paper variant="outlined" sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, display: "flex", gap: 1, alignItems: "center" }}>
                            <Category color="primary" />
                            TikTok Shop
                        </Typography>
                        <Divider />

                        <Autocomplete
                            disablePortal
                            id="b2c_tiktok_category"
                            disabled={!props.editing}
                            options={(props.tiktokCategories || []).map((e) => ({
                                id: e.id,
                                name: e.name,
                                value: e.value,
                                label: e.value ? `${e.name} (${e.value})` : e.name,
                            }))}
                            fullWidth
                            value={data.tiktok_category}
                            getOptionLabel={(option) =>
                                option.value ? `${option.name} (${option.value})` : option.name || ""
                            }
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            onChange={(e, value) => {
                                setData({
                                    ...data,
                                    tiktok_category: value,
                                    product_tiktok_category_id: value?.id ?? null,
                                });
                                setEdited(true);
                            }}
                            renderInput={(params) => <TextField {...params} label="Kategoria TikTok" />}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={Boolean(data.tiktok_attributes?.compliance_labels_confirmed ?? true)}
                                    disabled={!props.editing}
                                    onChange={(e) => updateTiktokAttr("compliance_labels_confirmed", e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    Potwierdź obecność oznaczeń lub etykiet wymaganych przepisami (ID: 102277)
                                </Typography>
                            }
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                            <Autocomplete
                                disablePortal
                                id="tiktok_country_of_origin"
                                disabled={!props.editing}
                                options={TIKTOK_COUNTRY_OPTIONS}
                                fullWidth
                                value={data.tiktok_attributes?.country_of_origin || "Polska"}
                                onChange={(e, value) => updateTiktokAttr("country_of_origin", value || "Polska")}
                                renderInput={(params) => (
                                    <TextField {...params} label="Kraj pochodzenia" size="small" />
                                )}
                            />

                            <TextField
                                label="Liczba w opakowaniu"
                                size="small"
                                type="number"
                                disabled={!props.editing}
                                fullWidth
                                inputProps={{ min: 1 }}
                                value={data.tiktok_attributes?.quantity_per_pack ?? "1"}
                                onChange={(e) => updateTiktokAttr("quantity_per_pack", e.target.value)}
                            />
                        </Box>

                        <Autocomplete
                            multiple
                            disablePortal
                            id="tiktok_care_instructions"
                            disabled={!props.editing}
                            options={TIKTOK_CARE_INSTRUCTIONS_OPTIONS}
                            value={data.tiktok_attributes?.care_instructions || []}
                            onChange={(e, value) => updateTiktokAttr("care_instructions", value)}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Instrukcja prania"
                                    size="small"
                                    placeholder="Wybierz instrukcję prania..."
                                />
                            )}
                        />

                        <Autocomplete
                            multiple
                            freeSolo
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id="tiktok_sports_feature"
                            disabled={!props.editing}
                            options={TIKTOK_SPORTS_FEATURE_OPTIONS}
                            value={data.tiktok_attributes?.sports_feature || []}
                            filterOptions={(options, params) => {
                                const filtered = filterFreeSolo(options, params);
                                const { inputValue } = params;
                                const trimmed = inputValue.trim();
                                const isExisting = options.some(
                                    (opt) => opt.toLowerCase() === trimmed.toLowerCase()
                                );
                                if (trimmed !== "" && !isExisting) {
                                    filtered.push(trimmed);
                                }
                                return filtered;
                            }}
                            onChange={(e, value) =>
                                updateTiktokAttr(
                                    "sports_feature",
                                    value.map((v) => String(v).trim()).filter(Boolean)
                                )
                            }
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Funkcja sportowa (lista + własna wartość)"
                                    size="small"
                                    placeholder="Wybierz lub wpisz własną i naciśnij Enter..."
                                />
                            )}
                        />

                        <Autocomplete
                            multiple
                            freeSolo
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id="tiktok_material"
                            disabled={!props.editing}
                            options={TIKTOK_SWIMWEAR_TOWEL_MATERIAL_OPTIONS}
                            value={data.tiktok_attributes?.material || []}
                            filterOptions={(options, params) => {
                                const filtered = filterFreeSolo(options, params);
                                const { inputValue } = params;
                                const trimmed = inputValue.trim();
                                const isExisting = options.some(
                                    (opt) => opt.toLowerCase() === trimmed.toLowerCase()
                                );
                                if (trimmed !== "" && !isExisting) {
                                    filtered.push(trimmed);
                                }
                                return filtered;
                            }}
                            onChange={(e, value) =>
                                updateTiktokAttr(
                                    "material",
                                    value.map((v) => String(v).trim()).filter(Boolean)
                                )
                            }
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Materiał (stroje kąpielowe / ręczniki + własny)"
                                    size="small"
                                    placeholder="Wybierz lub wpisz własny materiał..."
                                />
                            )}
                        />

                        <Autocomplete
                            multiple
                            freeSolo
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id="tiktok_composition"
                            disabled={!props.editing}
                            options={TIKTOK_COMPOSITION_OPTIONS}
                            value={data.tiktok_attributes?.composition || []}
                            filterOptions={(options, params) => {
                                const filtered = filterFreeSolo(options, params);
                                const { inputValue } = params;
                                const trimmed = inputValue.trim();
                                const isExisting = options.some(
                                    (opt) => opt.toLowerCase() === trimmed.toLowerCase()
                                );
                                if (trimmed !== "" && !isExisting) {
                                    filtered.push(trimmed);
                                }
                                return filtered;
                            }}
                            onChange={(e, value) =>
                                updateTiktokAttr(
                                    "composition",
                                    value.map((v) => String(v).trim()).filter(Boolean)
                                )
                            }
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Skład (lista + własny skład)"
                                    size="small"
                                    placeholder="Wybierz lub wpisz np. 80% Poliamid, 20% Elastan..."
                                />
                            )}
                        />

                        <Typography variant="caption" color="text.secondary">
                            Tabela rozmiarów przypisana w sekcji „Sklep B2C i Rozmiary” zostanie automatycznie przesłana również do TikTok Shop.
                        </Typography>
                    </Paper>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Typography sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center", fontWeight: 600 }}>
                        <Description fontSize="large" />
                        Opis
                    </Typography>
                    <TextEditorWebsite
                        value={data.description_b2c}
                        setValue={(value) => {
                            setData("description_b2c", value);
                        }}
                        setEdited={(value) => setEdited(value)}
                        readOnly={!props.editing}
                    />
                </Box>
            </Box>

            <Fade in={edited}>
                <Button
                    variant="outlined"
                    startIcon={<Save />}
                    disabled={processing}
                    onClick={saveB2C}
                    sx={{
                        position: "absolute",
                        top: 7,
                        right: 100,
                    }}
                >
                    Zapisz
                </Button>
            </Fade>
        </>
    );
}
