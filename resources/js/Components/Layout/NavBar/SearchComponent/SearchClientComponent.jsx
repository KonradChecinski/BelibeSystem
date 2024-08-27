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

export default function SearchClientComponent({auth, searchRoute, label}) {
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
        const option = {headers: {Accept: "application/json"}};
        const response = await fetch(searchRoute + `?search=${search}`, option);
        const json = await response.json();
        // console.log(json)
        setOptions(json);
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [open, search])


    const filterOptions = createFilterOptions({
        stringify: (option) => {
            return option.id + "," + option.name + "," + option.nip + "," + option.city + "," + option.postal_code + "," + option.street + "," + option.building_number + "," + option.apartment_number + "," + option.phone + "," + option.email
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
            getOptionLabel={(option) => option.nip + " - " + option.name}
            loading={loading}
            // value={value}
            onChange={(event, newValue) => {
                if (auth.permissions.includes("editClient")) {
                    setLoading(true);
                    router.visit(route("system.clients.client.edit", {id: newValue.id}))
                } else if (auth.permissions.includes("showClient")) {
                    setLoading(true);
                    router.visit(route("system.clients.client", {id: newValue.id}))
                }
            }}
            onInputChange={(event, newInputValue) => debounce(setSearch(newInputValue), 500)}
            renderOption={(props, option) => {
                return (
                    <Box
                        component="li"
                        {...props}
                        // sx={{
                        //     height: 90
                        // }}
                    >
                        <Box>
                            <Typography variant="subtitle1" gutterBottom component="div" sx={{fontSize: 11}}>
                                {option.name}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{fontSize: 11}}>
                                NIP: {option.nip}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{fontSize: 8}}>
                                {option.street} {option.building_number}{option.apartment_number ? "/" + option.apartment_number : ""} | {option.city}, {option.postal_code}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{fontSize: 8}}>
                                tel. {option.phone}; email. {option.email}
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
