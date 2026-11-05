import {
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {Add, ContentPaste, Delete, RemoveCircleOutline} from "@mui/icons-material";
import {useEffect, useState} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

const DEFAULT_TABLE_DATA = {
    headers: ["Rozmiar", "S", "M", "L", "XL"],
    rows: [
        ["Wzrost", "158-164", "162-168", "164-170", "166-170"],
        ["Obwód pasa", "64-68", "68-74", "74-82", "84-90"],
        ["Obwód bioder", "86-90", "90-96", "96-102", "102-108"],
    ],
};

export default function SizeChartDialog({open, setOpen, reloadData, clickedRow = null}) {
    const isEdit = Boolean(clickedRow?.id);

    const [pasteOpen, setPasteOpen] = useState(false);
    const [pasteText, setPasteText] = useState("");

    const {data, setData, post, patch, processing, reset} = useForm({
        name: clickedRow?.name || "",
        tiktok_template_id: clickedRow?.tiktok_template_id || "",
        table_data: clickedRow?.table_data || DEFAULT_TABLE_DATA,
    });

    useEffect(() => {
        if (open) {
            setData({
                name: clickedRow?.name || "",
                tiktok_template_id: clickedRow?.tiktok_template_id || "",
                table_data: clickedRow?.table_data
                    ? JSON.parse(JSON.stringify(clickedRow.table_data))
                    : JSON.parse(JSON.stringify(DEFAULT_TABLE_DATA)),
            });
            setPasteOpen(false);
            setPasteText("");
        }
    }, [open, clickedRow]);

    const handleClose = () => {
        setOpen(false);
    };

    const headers = data.table_data?.headers || ["Rozmiar"];
    const rows = data.table_data?.rows || [];

    const updateHeaderCell = (colIdx, value) => {
        const nextHeaders = [...headers];
        nextHeaders[colIdx] = value;
        setData("table_data", {
            ...data.table_data,
            headers: nextHeaders,
        });
    };

    const updateRowCell = (rowIdx, colIdx, value) => {
        const nextRows = rows.map((r, rI) => {
            if (rI !== rowIdx) return r;
            const copy = [...r];
            while (copy.length < headers.length) {
                copy.push("");
            }
            copy[colIdx] = value;
            return copy;
        });
        setData("table_data", {
            ...data.table_data,
            rows: nextRows,
        });
    };

    const addColumn = () => {
        const nextHeaders = [...headers, ""];
        const nextRows = rows.map((r) => [...r, ""]);
        setData("table_data", {
            headers: nextHeaders,
            rows: nextRows,
        });
    };

    const removeColumn = (colIdx) => {
        if (headers.length <= 2) return;
        const nextHeaders = headers.filter((_, idx) => idx !== colIdx);
        const nextRows = rows.map((r) => r.filter((_, idx) => idx !== colIdx));
        setData("table_data", {
            headers: nextHeaders,
            rows: nextRows,
        });
    };

    const addRow = () => {
        const emptyRow = Array(headers.length).fill("");
        setData("table_data", {
            headers,
            rows: [...rows, emptyRow],
        });
    };

    const removeRow = (rowIdx) => {
        if (rows.length <= 1) return;
        setData("table_data", {
            headers,
            rows: rows.filter((_, idx) => idx !== rowIdx),
        });
    };

    const applyPastedText = () => {
        const lines = pasteText
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);

        if (lines.length === 0) {
            return;
        }

        const parsedLines = lines.map((line) => line.split(/\t/));
        const maxCols = Math.max(...parsedLines.map((l) => l.length));

        const normalized = parsedLines.map((cells) => {
            if (cells.length === maxCols - 1) {
                return ["Rozmiar EU", ...cells];
            }
            const padded = [...cells];
            while (padded.length < maxCols) {
                padded.push("");
            }
            return padded;
        });

        setData("table_data", {
            headers: normalized[0] || ["Rozmiar"],
            rows: normalized.slice(1),
        });
        setPasteOpen(false);
        enqueueSnackbar("Zaimportowano tabelę ze schowka", {variant: "info"});
    };

    const save = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route("system.settings.b2c.sizeChart.update", {sizeChart: clickedRow.id}), {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Zapisano tabelę rozmiarów", {variant: "success"});
                    reloadData();
                    handleClose();
                },
                onError: (err) => {
                    console.error(err);
                    enqueueSnackbar("Błąd przy zapisie tabeli rozmiarów", {variant: "error"});
                },
            });
        } else {
            post(route("system.settings.b2c.sizeChart.create"), {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Dodano tabelę rozmiarów", {variant: "success"});
                    reset();
                    reloadData();
                    handleClose();
                },
                onError: (err) => {
                    console.error(err);
                    enqueueSnackbar("Błąd przy dodawaniu tabeli rozmiarów", {variant: "error"});
                },
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-size-chart-dialog-title"
            scroll="paper"
            maxWidth="xl"
            fullWidth
        >
            <form onSubmit={save} autoComplete="off">
                <DialogTitle style={{cursor: "move"}} id="draggable-size-chart-dialog-title">
                    {isEdit ? `Edycja tabeli rozmiarów: ${clickedRow?.name}` : "Dodawanie tabeli rozmiarów"}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 2, mb: 2, alignItems: "center"}}>
                        <TextField
                            label="Nazwa tabeli rozmiarów (np. Stroje damskie)"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            sx={{minWidth: "35ch", flex: 1}}
                        />
                        <TextField
                            label="ID szablonu TikTok (opcjonalnie)"
                            value={data.tiktok_template_id}
                            onChange={(e) => setData("tiktok_template_id", e.target.value)}
                            helperText="Pozostaw puste, aby system sam wysłał dane tabeli i utworzył szablon w TikTok Shop"
                            sx={{minWidth: "35ch", flex: 1}}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<ContentPaste/>}
                            onClick={() => setPasteOpen(!pasteOpen)}
                        >
                            Wklej z Excela / tekstu
                        </Button>
                    </Box>

                    <Collapse in={pasteOpen}>
                        <Paper variant="outlined" sx={{p: 2, mb: 2}}>
                            <Typography variant="body2" sx={{mb: 1}}>
                                Wklej wiersze oddzielone tabulatorami (pierwszy wiersz to nagłówki rozmiarów, kolejne to wymiary):
                            </Typography>
                            <TextField
                                multiline
                                minRows={4}
                                maxRows={8}
                                fullWidth
                                placeholder={"Rozmiar\tXS\tS\tM\tL\nWzrost\t158-164\t162-168\t164-170\t166-170"}
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                            />
                            <Box sx={{display: "flex", justifyContent: "flex-end", gap: 1, mt: 1}}>
                                <Button size="small" onClick={() => setPasteOpen(false)}>
                                    Anuluj
                                </Button>
                                <Button size="small" variant="contained" onClick={applyPastedText}>
                                    Zastosuj wklejoną tabelę
                                </Button>
                            </Box>
                        </Paper>
                    </Collapse>

                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1}}>
                        <Typography variant="subtitle2">
                            Układ tabeli ({rows.length} wierszy × {Math.max(0, headers.length - 1)} rozmiarów)
                        </Typography>
                        <Box sx={{display: "flex", gap: 1}}>
                            <Button size="small" variant="outlined" startIcon={<Add/>} onClick={addColumn}>
                                Dodaj kolumnę (rozmiar)
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<Add/>} onClick={addRow}>
                                Dodaj wiersz (parametr)
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} variant="outlined" sx={{maxHeight: 440}}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {headers.map((headerValue, colIdx) => (
                                        <TableCell
                                            key={colIdx}
                                            sx={{
                                                minWidth: colIdx === 0 ? 190 : 105,
                                                bgcolor: "action.hover",
                                                p: 0.75,
                                            }}
                                        >
                                            <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                                <TextField
                                                    size="small"
                                                    variant="outlined"
                                                    value={headerValue}
                                                    placeholder={colIdx === 0 ? "Parametr" : "Rozmiar"}
                                                    onChange={(e) => updateHeaderCell(colIdx, e.target.value)}
                                                    inputProps={{
                                                        style: {
                                                            fontWeight: 700,
                                                            padding: "6px 8px",
                                                            textAlign: colIdx === 0 ? "left" : "center",
                                                        },
                                                    }}
                                                    fullWidth
                                                />
                                                {colIdx > 0 && headers.length > 2 && (
                                                    <Tooltip title="Usuń kolumnę">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => removeColumn(colIdx)}
                                                        >
                                                            <RemoveCircleOutline fontSize="small"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{width: 48, bgcolor: "action.hover"}}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((rowValues, rowIdx) => (
                                    <TableRow key={rowIdx} hover>
                                        {headers.map((_, colIdx) => (
                                            <TableCell key={colIdx} sx={{p: 0.75}}>
                                                <TextField
                                                    size="small"
                                                    variant="outlined"
                                                    value={rowValues[colIdx] ?? ""}
                                                    placeholder={colIdx === 0 ? "Nazwa wymiaru" : "-"}
                                                    onChange={(e) => updateRowCell(rowIdx, colIdx, e.target.value)}
                                                    inputProps={{
                                                        style: {
                                                            fontWeight: colIdx === 0 ? 600 : 400,
                                                            padding: "6px 8px",
                                                            textAlign: colIdx === 0 ? "left" : "center",
                                                        },
                                                    }}
                                                    fullWidth
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell sx={{p: 0.5, textAlign: "center"}}>
                                            {rows.length > 1 && (
                                                <Tooltip title="Usuń wiersz">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeRow(rowIdx)}
                                                    >
                                                        <Delete fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Zamknij</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        Zapisz
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-size-chart-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

