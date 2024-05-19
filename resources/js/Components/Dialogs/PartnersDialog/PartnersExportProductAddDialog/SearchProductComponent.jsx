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

export default function SearchProductComponent({partner, products}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(products)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false);

    const searchRoute = route("system.partners.products.search")
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
            multiple
            filterOptions={filterOptions}
            disableCloseOnSelect={true}
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
            value={value}
            onChange={(event, newValue, cr, selected) => {
                router.post(route("system.partners.partner.products.create", {
                    partner: partner.id,
                    product: selected.option.id
                }))
                setValue(newValue)
            }}
            //disabling selected options
            getOptionDisabled={(option) =>
                value.some((selectedOption) => selectedOption.id === option.id)
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
