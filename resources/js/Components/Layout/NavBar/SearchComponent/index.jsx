import {Autocomplete, CircularProgress, IconButton, InputAdornment, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {Search} from "@mui/icons-material";

export default function SearchComponent({}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    // const [value, setValue] = useState()
    const [search, setSearch] = useState("")
    const loading = open && options.length === 0;

    const fetchData = async () => {
        if (!open) {
            return;
        }
        let option = {headers: {Accept: "application/json"}};
        const response = await fetch(route("system.products.models.search") + `?search=${search}`, option);
        const json = await response.json();
        console.log(json)
        setOptions(json);
    }

    useEffect(() => {
        fetchData();
        console.log("zmiana")
    }, [search])
    return (
        <Autocomplete
            // disablePortal
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            options={options}
            sx={{width: 200}}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            loading={loading}
            // value={value}
            // onChange={(event, newValue) => {
            //     setValue(newValue);
            // }}
            onInputChange={(event, newInputValue) => setSearch(newInputValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Asynchronous"
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
