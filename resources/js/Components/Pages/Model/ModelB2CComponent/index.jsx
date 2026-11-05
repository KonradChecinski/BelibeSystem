import {
    Autocomplete,
    Box,
    Button,
    Divider,
    Fade,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { Category, Description, Save, Straighten, Storefront } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { enqueueSnackbar } from "notistack";
import TextEditorWebsite from "@/Components/TextEditor/Website";
import normalizeQuillHtml from "@/Components/TextEditor/normalizeQuillHtml";

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
        });
    }, [props]);

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
