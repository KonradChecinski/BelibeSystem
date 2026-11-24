import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
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
import {Add, LinkOff, OpenInNew, Star} from "@mui/icons-material";
import {useEffect, useState} from "react";
import Draggable from "react-draggable";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function WarehouseLocationModelsDialog({
                                                          open,
                                                          setOpen,
                                                          shelf,
                                                          locationPath,
                                                          setLocations,
                                                      }) {
    const shelfId = shelf.id.split("-")[1];
    const assignedModels = shelf.models || [];

    const [selectedModel, setSelectedModel] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [attaching, setAttaching] = useState(false);
    const [detachingId, setDetachingId] = useState(null);

    useEffect(() => {
        if (!open) return;

        let active = true;
        const timer = setTimeout(() => {
            setLoadingSearch(true);
            axios
                .get(route("system.products.models.search"), {
                    params: {search: searchQuery},
                })
                .then((res) => {
                    if (!active) return;
                    const list = Array.isArray(res.data) ? res.data : [];
                    setSearchOptions(list);
                })
                .catch(() => {
                    if (active) setSearchOptions([]);
                })
                .finally(() => {
                    if (active) setLoadingSearch(false);
                });
        }, 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [searchQuery, open]);

    const availableOptions = searchOptions.filter(
        (opt) => !assignedModels.some((m) => m.id === opt.id)
    );

    const handleClose = () => {
        setSelectedModel(null);
        setSearchQuery("");
        setOpen(false);
    };

    const handleAttach = () => {
        if (!selectedModel) return;

        setAttaching(true);
        router.post(
            route("system.settings.warehouseLocation.shelf.model.attach", {
                warehouseLocation: shelfId,
            }),
            {
                product_model_id: selectedModel.id,
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    enqueueSnackbar(
                        `Przypisano model ${selectedModel.symbol} do lokalizacji ${shelf.name}`,
                        {variant: "success"}
                    );
                    setSelectedModel(null);
                    setSearchQuery("");
                    if (setLocations && page?.props?.locations) {
                        setLocations(page.props.locations);
                    }
                },
                onError: (errors) => {
                    console.error(errors);
                    enqueueSnackbar("Błąd podczas przypisywania modelu", {variant: "error"});
                    if (errors) {
                        Object.keys(errors).forEach((key) => {
                            enqueueSnackbar(errors[key], {variant: "error"});
                        });
                    }
                },
                onFinish: () => {
                    setAttaching(false);
                },
            }
        );
    };

    const handleDetach = (model) => {
        setDetachingId(model.id);
        router.delete(
            route("system.settings.warehouseLocation.shelf.model.detach", {
                warehouseLocation: shelfId,
                productModel: model.id,
            }),
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    enqueueSnackbar(
                        `Odpięto model ${model.symbol} z lokalizacji ${shelf.name}`,
                        {variant: "success"}
                    );
                    if (setLocations && page?.props?.locations) {
                        setLocations(page.props.locations);
                    }
                },
                onError: (errors) => {
                    console.error(errors);
                    enqueueSnackbar("Błąd podczas odpinania modelu", {variant: "error"});
                    if (errors) {
                        Object.keys(errors).forEach((key) => {
                            enqueueSnackbar(errors[key], {variant: "error"});
                        });
                    }
                },
                onFinish: () => {
                    setDetachingId(null);
                },
            }
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-models-dialog-title"
            scroll="paper"
            fullWidth
            maxWidth="md"
        >
            <DialogTitle style={{cursor: "move"}} id="draggable-models-dialog-title">
                Modele w lokalizacji: {locationPath || shelf.name}
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="subtitle2" gutterBottom>
                    Dopnij model do tej lokalizacji
                </Typography>

                <Box sx={{display: "flex", gap: 1.5, alignItems: "flex-start", mb: 3, mt: 1}}>
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={availableOptions}
                        value={selectedModel}
                        inputValue={searchQuery}
                        loading={loadingSearch}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
                        filterOptions={(x) => x}
                        noOptionsText="Brak pasujących modeli"
                        loadingText="Wyszukiwanie..."
                        onInputChange={(event, newInputValue, reason) => {
                            if (reason === "input" || reason === "clear") {
                                setSearchQuery(newInputValue);
                            }
                        }}
                        onChange={(event, newValue) => {
                            setSelectedModel(newValue);
                        }}
                        renderOption={(optionProps, option) => (
                            <Box
                                component="li"
                                {...optionProps}
                                key={option.id}
                                sx={{display: "flex", alignItems: "center", gap: 1.5}}
                            >
                                <Box
                                    component="img"
                                    sx={{width: 40, height: 40, objectFit: "contain", flexShrink: 0}}
                                    src={
                                        option.mainImage
                                            ? route("images.thumbnail", {slug: option.mainImage?.slug})
                                            : route("images", {slug: "brak.jpg"})
                                    }
                                    alt={option.symbol}
                                    loading="lazy"
                                />
                                <Box>
                                    <Typography variant="body2" sx={{fontWeight: 700}}>
                                        {option.symbol}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {option.name}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Wyszukaj model (symbol, nazwa, ID lub kod kreskowy)"
                                placeholder="Wpisz symbol lub nazwę modelu..."
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingSearch ? (
                                                <CircularProgress color="inherit" size={18}/>
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Button
                        variant="contained"
                        startIcon={<Add/>}
                        onClick={handleAttach}
                        disabled={!selectedModel || attaching}
                        sx={{flexShrink: 0, height: 40}}
                    >
                        Dopnij
                    </Button>
                </Box>

                <Divider sx={{mb: 2}}/>

                <Typography variant="subtitle2" gutterBottom>
                    Przypisane modele ({assignedModels.length})
                </Typography>

                {assignedModels.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{py: 2}}>
                        Brak modeli przypisanych do tej lokalizacji.
                    </Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Główna</TableCell>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Nazwa</TableCell>
                                <TableCell align="right">Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignedModels.map((model) => (
                                <TableRow key={model.id} hover>
                                    <TableCell sx={{width: 70}}>
                                        {model.is_main && (
                                            <Tooltip title="Lokalizacja główna modelu">
                                                <Star fontSize="small" color="warning"/>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{fontWeight: 600, whiteSpace: "nowrap"}}>
                                        <Box
                                            component="a"
                                            href={route("system.products.model.edit", {id: model.id})}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                color: "primary.main",
                                                textDecoration: "none",
                                                "&:hover": {textDecoration: "underline"},
                                            }}
                                        >
                                            {model.symbol}
                                            <OpenInNew sx={{fontSize: 14}}/>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{model.name}</TableCell>
                                    <TableCell align="right" sx={{width: 80}}>
                                        <Tooltip title="Odepnij model z tej lokalizacji">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    disabled={detachingId === model.id}
                                                    onClick={() => handleDetach(model)}
                                                >
                                                    <LinkOff fontSize="small"/>
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Zamknij</Button>
            </DialogActions>
        </Dialog>
    );
}

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-models-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
