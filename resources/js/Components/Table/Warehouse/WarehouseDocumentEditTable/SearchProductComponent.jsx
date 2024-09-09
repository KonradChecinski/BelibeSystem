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
import toLocaleString from "@/Functions/toLocaleString";

export default function SearchProductComponent({products, data, setData, props}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(null);
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false);

    const searchRoute = route("system.warehouse.products.search", {warehouseDocument: props.warehouseDocument.id});
    const label = "Produkt"

    const fetchData = async () => {
        if (!open) {
            return;
        }
        setLoading(true);
        const option = {headers: {Accept: "application/json"}};
        const response = await fetch(searchRoute + `?search=${search}`, option);
        const json = await response.json();
        await setOptions(json);
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [open, search])


    const filterOptions = createFilterOptions({
        stringify: (option) => {
            return option.id + "," + option.name + "," + option.symbol
        },
    });


    return (
        <Autocomplete
            filterOptions={filterOptions}
            disableCloseOnSelect={false}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            options={options}
            sx={{
                // position: "absolute",
                width: 1
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.symbol + " - " + option.name}
            loading={loading}
            value={value}
            onChange={(event, newValue, cr, selected) => {
                // const item = selected.option
                // console.log(data, selected.option)
                //
                //
                //
                // console.log("cos")

                setData(selected.option)
            }}
            //disabling selected options
            getOptionDisabled={(option) =>
                products.some((selectedOption) => selectedOption.id === option.id)
            }
            onInputChange={(event, newInputValue, reason) => reason !== 'reset' && debounce(setSearch(newInputValue), 500)}
            ChipProps={{sx: {display: "none"}}}
            renderOption={(props, option) => {
                // console.log(props, option)
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
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{fontSize: 8}}>
                                {toLocaleString(option.prices.price_net / 100)} ({toLocaleString(option.prices.price_gross / 100)})
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
