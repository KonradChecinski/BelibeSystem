import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Fade,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import TextEditorB2B from "@/Components/TextEditor/B2B";
import {Category, Description, Link as LinkIcon, OpenInNew, Save} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {Link, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import CategoryComponent from "@/Components/Pages/Model/ModelB2BComponent/CategoryComponent";
import normalizeQuillHtml from "@/Components/TextEditor/normalizeQuillHtml";


export default function ModelB2BComponent(props) {
    const [edited, setEdited] = useState(false);
    const initialLinkedModels = props.productModel.b2b_linked_models || [];
    const [selectedLinkedModels, setSelectedLinkedModels] = useState(initialLinkedModels);
    const [searchOptions, setSearchOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingSearch, setLoadingSearch] = useState(false);

    const {data, setData, processing, post, transform} = useForm({
        'id': props.productModel.id,
        "description_b2b": props.productModel.description_b2b || "",
        "categories": props.productModel.categories.map((value) => {
            return value.id;
        }),
        "linked_models": initialLinkedModels.map((m) => m.id),
    });

    useEffect(() => {
        const linked = props.productModel.b2b_linked_models || [];
        setSelectedLinkedModels(linked);
        setData({
            'id': props.productModel.id,
            "description_b2b": props.productModel.description_b2b || "",
            "categories": props.productModel.categories.map((value) => {
                return value.id;
            }),
            "linked_models": linked.map((m) => m.id),
        });
    }, [props.productModel]);

    useEffect(() => {
        if (!props.editing) return;
        let active = true;
        const timer = setTimeout(() => {
            setLoadingSearch(true);
            axios.get(route("system.products.models.search"), {
                params: {search: searchQuery}
            })
                .then((res) => {
                    if (!active) return;
                    const list = Array.isArray(res.data) ? res.data : [];
                    setSearchOptions(list.filter((m) => m.id !== props.productModel.id));
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
    }, [searchQuery, props.editing, props.productModel.id]);

    const saveB2B = () => {
        transform(formData => ({
            ...formData,
            description_b2b: normalizeQuillHtml(formData.description_b2b || ""),
        }));
        post(route("system.products.model.update.b2b", {productModel: data.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano B2B", {variant: 'success'})
            },
            onError: params => {
                console.error(params);
                enqueueSnackbar("Błąd przy zapisywaniu B2B", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    const mergedOptions = [
        ...selectedLinkedModels,
        ...searchOptions.filter((opt) => !selectedLinkedModels.some((sel) => sel.id === opt.id))
    ];

    return (
        <>
            <Box sx={{mb: 3}}>
                <Typography
                    sx={{mb: 1, display: "flex", gap: 1, alignItems: "center"}}>
                    <LinkIcon fontSize={"large"}/>
                    Powiązane modele w ofercie B2B (wspólna strona produktu)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                    Połączone modele (np. wersja standardowa S-... oraz wersja drukowana D-...) będą wyświetlane razem
                    na jednej karcie produktu w panelu B2B, zachowując swoje własne ceny, stany magazynowe i symbole w
                    zamówieniach. Powiązanie działa automatycznie w obie strony.
                </Typography>

                <Autocomplete
                    multiple
                    disabled={!props.editing}
                    options={mergedOptions}
                    value={selectedLinkedModels}
                    loading={loadingSearch}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
                    filterOptions={(x) => x}
                    onInputChange={(event, newInputValue, reason) => {
                        if (reason === "input") {
                            setSearchQuery(newInputValue);
                        }
                    }}
                    onChange={(event, newValue) => {
                        setSelectedLinkedModels(newValue);
                        setData("linked_models", newValue.map((m) => m.id));
                        setEdited(true);
                    }}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <Chip
                                {...getTagProps({index})}
                                key={option.id}
                                color="primary"
                                variant="outlined"
                                label={`${option.symbol} — ${option.name}`}
                            />
                        ))
                    }
                    renderOption={(optionProps, option) => (
                        <Box component="li" {...optionProps} key={option.id}
                             sx={{display: "flex", alignItems: "center", gap: 1.5}}>

                            <Box
                                component="img"
                                sx={{
                                    width: 50,
                                    mr: 1
                                }}
                                src={option.mainImage ? route("images.thumbnail", {slug: option.mainImage?.slug}) : route("images", {slug: "brak.jpg"})}
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
                            label="Wyszukaj i wybierz powiązane modele (po symbolu lub nazwie)"
                            placeholder={props.editing ? "Wpisz np. 3300..." : "Brak powiązanych modeli"}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingSearch ? <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />

                {selectedLinkedModels.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{mt: 1.5, flexWrap: "wrap", gap: 1}}>
                        {selectedLinkedModels.map((linked) => (
                            <Button
                                key={linked.id}
                                component={Link}
                                href={route("system.products.model", {id: linked.id})}
                                size="small"
                                variant="text"
                                endIcon={<OpenInNew fontSize="inherit"/>}
                                sx={{textTransform: "none"}}
                            >
                                Przejdź do modelu {linked.symbol}
                            </Button>
                        ))}
                    </Stack>
                )}
            </Box>

            <Box>
                <Typography
                    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                    <Category fontSize={"large"}/>
                    Kategorie
                </Typography>
                <CategoryComponent categories={props.categories} data={data} setData={setData}
                                   setEdited={value => setEdited(value)}/>
            </Box>
            <Box sx={{my: 1}}>
                <Typography
                    sx={{my: 3, display: "flex", gap: 1, alignItems: "center"}}>
                    <Description fontSize={"large"}/>
                    Opis
                </Typography>
                <TextEditorB2B
                    value={data.description_b2b}
                    setValue={(value) => {
                        setData("description_b2b", value)
                    }}
                    setEdited={value => setEdited(value)}
                    readOnly={!props.editing}
                />
            </Box>


            <Fade in={edited}>
                <Button variant="outlined" startIcon={<Save/>}
                        disabled={processing}
                        onClick={saveB2B}
                        sx={{
                            position: "absolute",
                            top: 7,
                            right: 100,
                        }}>
                    Zapisz
                </Button>
            </Fade>
        </>
    );
}
