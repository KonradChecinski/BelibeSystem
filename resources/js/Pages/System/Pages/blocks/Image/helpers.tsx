import React, {useEffect, useRef, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {CloudUpload, Collections, Delete, Image as ImageIcon} from "@mui/icons-material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {enqueueSnackbar} from "notistack";
import axios from "axios";

declare function route(name?: string, params?: any, absolute?: boolean): any;

export const getPageImageUrl = (imageValue: any): string => {
    if (!imageValue) return "";
    if (typeof imageValue === "string") {
        if (imageValue.startsWith("http") || imageValue.startsWith("/")) {
            return imageValue;
        }
        try {
            return route("pageImages", {path: imageValue});
        } catch (e) {
            return `/page-images/${imageValue}`;
        }
    }
    if (typeof imageValue === "object" && imageValue.filename) {
        try {
            return route("pageImages", {path: imageValue.filename});
        } catch (e) {
            return imageValue.url || `/page-images/${imageValue.filename}`;
        }
    }
    return "";
};

let cachedLinks: any[] | null = null;
let linksFetchPromise: Promise<any[]> | null = null;

export const LinkPickerField = ({value, onChange, label = "Link (opcjonalnie)"}: {
    value: any;
    onChange: (val: any) => void;
    label?: string;
}) => {
    const {t} = useLaravelReactI18n();
    const [links, setLinks] = useState<any[]>(cachedLinks || []);

    useEffect(() => {
        if (cachedLinks) {
            setLinks(cachedLinks);
            return;
        }
        if (!linksFetchPromise) {
            linksFetchPromise = axios.get(route("system.pages.links"))
                .then(response => {
                    const data = response.data;
                    const tempLinks: any[] = [];
                    for (const group of data) {
                        for (const link of group.links) {
                            tempLinks.push({
                                label: link.name,
                                route: link.route,
                                parameters: link.parameters,
                                group: group.name
                            });
                        }
                    }
                    cachedLinks = tempLinks;
                    return tempLinks;
                })
                .catch(error => {
                    console.error(error);
                    linksFetchPromise = null;
                    return [];
                });
        }
        linksFetchPromise.then(res => setLinks(res));
    }, []);

    return (
        <Autocomplete
            disablePortal
            options={links}
            groupBy={(option) => option.group}
            value={value || null}
            isOptionEqualToValue={(option, val) =>
                option?.route === val?.route &&
                JSON.stringify(option?.parameters) === JSON.stringify(val?.parameters)
            }
            onChange={(e, newValue) => onChange(newValue)}
            sx={{width: 1}}
            renderInput={(params) => <TextField {...params} size="small" label={label}/>}
            renderGroup={(params) => (
                <li key={params.key}>
                    <Box sx={{bgcolor: "#00000055", p: 1, color: "#fff"}}>
                        <Typography variant="body2">
                            {t(params.group)}
                        </Typography>
                    </Box>
                    <ul style={{padding: 0}}>{params.children}</ul>
                </li>
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.route + JSON.stringify(option.parameters)}>
                    {option.label}
                </li>
            )}
        />
    );
};

export const ImagePickerField = ({value, onChange}: {
    value: any;
    onChange: (val: any) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const [libraryImages, setLibraryImages] = useState<any[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);

    const currentFilename = typeof value === "string" ? value : value?.filename || "";
    const previewUrl = getPageImageUrl(value);

    const fetchLibrary = () => {
        setLoadingLibrary(true);
        axios.get(route("system.pages.images.list"))
            .then(res => {
                setLibraryImages(res.data || []);
            })
            .catch(err => {
                console.error(err);
                enqueueSnackbar("Nie udało się pobrać biblioteki zdjęć", {variant: "error"});
            })
            .finally(() => setLoadingLibrary(false));
    };

    const handleOpenLibrary = () => {
        setLibraryOpen(true);
        fetchLibrary();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        axios.post(route("system.pages.images.upload"), formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(res => {
                onChange(res.data.filename);
                enqueueSnackbar("Zdjęcie zostało wgrane", {variant: "success"});
                if (libraryOpen) {
                    fetchLibrary();
                }
            })
            .catch(err => {
                console.error(err);
                enqueueSnackbar("Błąd podczas wgrywania zdjęcia", {variant: "error"});
            })
            .finally(() => {
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            });
    };

    const handleDeleteFromLibrary = (filename: string, e: React.MouseEvent) => {
        e.stopPropagation();
        axios.delete(route("system.pages.images.delete", {filename}))
            .then(() => {
                enqueueSnackbar("Usunięto zdjęcie z biblioteki", {variant: "success"});
                setLibraryImages(prev => prev.filter(img => img.filename !== filename));
                if (currentFilename === filename) {
                    onChange("");
                }
            })
            .catch(err => {
                console.error(err);
                enqueueSnackbar("Błąd podczas usuwania zdjęcia", {variant: "error"});
            });
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={handleFileUpload}
            />

            {previewUrl ? (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 1,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "background.default"
                    }}
                >
                    <Box
                        component="img"
                        src={previewUrl}
                        alt="Podgląd"
                        sx={{
                            maxWidth: "100%",
                            maxHeight: 150,
                            objectFit: "contain",
                            borderRadius: 1,
                        }}
                    />
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", width: 1}}>
                        <Typography variant="caption" noWrap sx={{maxWidth: "180px"}} title={currentFilename}>
                            {currentFilename}
                        </Typography>
                        <Tooltip title="Usuń wybór zdjęcia">
                            <IconButton size="small" color="error" onClick={() => onChange("")}>
                                <Delete fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>
            ) : (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        borderStyle: "dashed",
                    }}
                >
                    <ImageIcon sx={{fontSize: 36, mb: 0.5, opacity: 0.6}}/>
                    <Typography variant="caption">Brak wybranego zdjęcia</Typography>
                </Paper>
            )}

            <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={uploading ? <CircularProgress size={16} color="inherit"/> : <CloudUpload/>}
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{flex: 1, textTransform: "none"}}
                >
                    Wgraj nowe
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Collections/>}
                    onClick={handleOpenLibrary}
                    sx={{flex: 1, textTransform: "none"}}
                >
                    Biblioteka
                </Button>
            </Box>

            <Dialog
                open={libraryOpen}
                onClose={() => setLibraryOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{zIndex: 9999}}
            >
                <DialogTitle sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant="h6">Biblioteka zdjęć stron</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={uploading ? <CircularProgress size={16} color="inherit"/> : <CloudUpload/>}
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Wgraj z dysku
                    </Button>
                </DialogTitle>
                <DialogContent dividers sx={{minHeight: 300}}>
                    {loadingLibrary ? (
                        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: 250}}>
                            <CircularProgress/>
                        </Box>
                    ) : libraryImages.length === 0 ? (
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 250, color: "text.secondary"}}>
                            <ImageIcon sx={{fontSize: 48, mb: 1, opacity: 0.5}}/>
                            <Typography>Brak wgranych zdjęć w bibliotece</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {libraryImages.map((img) => {
                                const isSelected = currentFilename === img.filename;
                                return (
                                    <Grid item xs={6} sm={4} md={3} key={img.filename}>
                                        <Paper
                                            elevation={isSelected ? 6 : 1}
                                            onClick={() => {
                                                onChange(img.filename);
                                                setLibraryOpen(false);
                                            }}
                                            sx={{
                                                p: 1,
                                                cursor: "pointer",
                                                border: 2,
                                                borderColor: isSelected ? "primary.main" : "transparent",
                                                position: "relative",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: 4,
                                                }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={getPageImageUrl(img.filename)}
                                                alt={img.filename}
                                                sx={{
                                                    width: "100%",
                                                    height: 120,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                    bgcolor: "action.hover"
                                                }}
                                            />
                                            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5}}>
                                                <Typography variant="caption" noWrap sx={{maxWidth: "80%"}} title={img.filename}>
                                                    {img.filename}
                                                </Typography>
                                                <Tooltip title="Usuń z serwera">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={(e) => handleDeleteFromLibrary(img.filename, e)}
                                                    >
                                                        <Delete fontSize="inherit"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLibraryOpen(false)}>Zamknij</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
