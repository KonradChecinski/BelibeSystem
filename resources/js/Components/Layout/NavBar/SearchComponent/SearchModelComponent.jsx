import {
    Autocomplete, Box,
    CircularProgress,
    createFilterOptions, debounce,
    IconButton,
    InputAdornment,
    TextField, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {Search} from "@mui/icons-material";

export default function SearchModelComponent({auth, searchRoute, label}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    // const [value, setValue] = useState()
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!open) {
            return;
        }
        setLoading(true);

        const params = new URLSearchParams({
            search: search
        })

        const option = {headers: {Accept: "application/json"}};
        const response = await fetch(searchRoute + `?${params.toString()}`, option);
        const json = await response.json();
        await setOptions(json);
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [open, search])


    const filterOptions = createFilterOptions({
        stringify: (option) => {
            let barcodes = option.barcodes.map(barcode => barcode.barcode).join(",");
            return option.id + "," + option.name + "," + option.symbol + "," + barcodes
        },
    });


    return (
        <Autocomplete
            disablePortal
            filterOptions={filterOptions}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            options={options}
            sx={{width: "100%"}}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.symbol + " - " + option.name}
            loading={loading}
            // value={value}
            onChange={(event, newValue) => {
                if (auth.permissions.includes("editModel")) {
                    setLoading(true);
                    router.visit(route("system.products.model.edit", {id: newValue.id}))
                } else if (auth.permissions.includes("showModel")) {
                    setLoading(true);
                    router.visit(route("system.products.model", {id: newValue.id}))
                }
            }}
            onInputChange={(event, newInputValue) => debounce(setSearch(newInputValue), 500)}
            renderOption={(props, option) => {
                return (
                    <Box
                        component="li"
                        {...props}
                        sx={{
                            height: 80
                        }}
                    >
                        <Box
                            component="img"
                            sx={{
                                width: 50,
                                mr: 1
                            }}
                            src={option.mainImage ? route("images", {path: option.mainImage?.path}) : route("images", {path: "brak.jpg"})}
                            alt={"Zdjęcie produktu"}
                            loading="lazy"
                        />
                        <Box>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                {option.symbol}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{fontSize: 8}}>
                                {option.name}
                            </Typography>
                        </Box>

                    </Box>
                );

            }
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {/*{params.InputProps.endAdornment}*/}
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        right: 5
                                    }}
                                >
                                    <Search/>
                                </IconButton>

                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
