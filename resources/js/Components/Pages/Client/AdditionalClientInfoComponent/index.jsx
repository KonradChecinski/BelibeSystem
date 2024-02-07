import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Button,
    Fade, FormControl, InputLabel, MenuItem, Select,
    TextField,
    Typography,
    Checkbox, FormControlLabel
} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
    useAdditionalClientInfoForm
} from "@/Components/Pages/Client/AdditionalClientInfoComponent/form/useAdditionalClientInfoForm";


export default function AdditionalClientInfoComponent(props) {
    const [edited, setEdited] = useState(false);

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors,
    } = useAdditionalClientInfoForm()

    const {data, setData, processing, post} = useForm({
        'status': props.client.status,
        'priority': props.client.priority,
        'source_of_acquisition': props.client.source_of_acquisition,
        'payment': props.client.payment,
        'blacklist': props.client.blacklist,
    })

    const [checked, setChecked] = useState(props.client.blacklist !== 0);

    const initializeFieldValues = () => {
        setValue('status', data.status.name)
        setValue('priority', data.priority === 1 ? "Niski" : data.priority === 2 ? "Średni" : "Wysoki")
        setValue('source_of_acquisition', data.source_of_acquisition.name)
        setValue('payment', data.payment.name)
    }

    useEffect(() => {
        // inicjacja wartości pól
        initializeFieldValues()
    }, [setValue]);

    const onSubmit = (formData) => {
        console.log("React Hook Form Data: ", formData)
        console.log("Inertia Data: ", data)
        saveBasic()
    }

    const resetForm = () => {
        setData({
            'status': props.client.status,
            'priority': props.client.priority,
            'source_of_acquisition': props.client.source_of_acquisition,
            'payment': props.client.payment,
            'blacklist': props.client.blacklist,
        });

        initializeFieldValues()
        setEdited(false);

        clearErrors('status')
        clearErrors('priority')
        clearErrors('source_of_acquisition')
        clearErrors('payment')
        clearErrors('blacklist')
    };
    const saveBasic = () => {
        // post(route("system.products.model.update.basic", {productModel: data.id}), {
        //     onSuccess: params => {
        //         setEdited(false);
        //         enqueueSnackbar("Zapisano Podstawowe informację", {variant: 'success'})
        //     },
        //     onError: params => {
        //         console.error(params)
        //         enqueueSnackbar("Błąd przy zapisywaniu podstawowych informacji", {variant: 'error'})
        //     },
        //     preserveScroll: true
        // })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Box sx={{display: "flex", flexDirection: "column", gap: 8}}>
                <Box>
                    <Typography
                        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                        <AddBoxIcon fontSize={"large"}/>
                        Informacje dodatkowe
                    </Typography>

                    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="status"
                                    options={props.status.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "30ch"}}
                                    value={data.status.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            status: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Status"
                                            sx={{my: 1}}
                                            {...register("status")}
                                            value={data.status.name}
                                            color={fieldErrors.status?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.status?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.status?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="status"
                                label="Status"
                                sx={{my: 1, width: "30ch"}}
                                {...register("status")}
                                color={fieldErrors.status?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}


                        {props.editing ? (
                            <>
                                <FormControl sx={{width: "30ch", display: "flex", flexDirection: "column"}}>
                                    <InputLabel id="priority-select-label">Priorytet</InputLabel>
                                    <Select
                                        id="priority-select"
                                        labelId="priority-select-label"
                                        label="Priorytet"
                                        value={data.priority}
                                        color={fieldErrors.priority?.message ? "error" : null}
                                        {...register("priority")}
                                        onChange={(value) => {
                                            // setProductModel({...productModel, product_group_id: value.target.value});
                                            setData({
                                                ...data,
                                                priority: value.target.value,
                                            })
                                            setEdited(true)
                                        }}

                                        // disabled={!props.editing}
                                        inputProps={{readOnly: !props.editing}}
                                    >
                                        <MenuItem key={1} value={1}>
                                            {"Niski"}
                                        </MenuItem>,
                                        <MenuItem key={2} value={2}>
                                            {"Średni"}
                                        </MenuItem>,
                                        <MenuItem key={3} value={3}>
                                            {"Wysoki"}
                                        </MenuItem>
                                    </Select>
                                    {fieldErrors.priority?.message && (
                                        <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                            {fieldErrors.priority?.message.toString()}
                                        </Typography>
                                    )}
                                </FormControl>
                            </>
                        ) : (
                            <TextField
                                id="priority-select"
                                label="Priorytet"
                                sx={{my: 1, width: "30ch"}}
                                {...register("priority")}
                                color={fieldErrors.priority?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="source_of_acquisition"
                                    options={props.sourceOfAcquisition.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "30ch"}}
                                    value={data.source_of_acquisition.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            source_of_acquisition: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Źródło pozyskania"
                                            sx={{my: 1}}
                                            {...register("source_of_acquisition")}
                                            value={data.source_of_acquisition.name}
                                            color={fieldErrors.source_of_acquisition?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.source_of_acquisition?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.source_of_acquisition?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="source_of_acquisition"
                                label="Źródło pozyskania"
                                sx={{my: 1, width: "30ch"}}
                                {...register("source_of_acquisition")}
                                color={fieldErrors.source_of_acquisition?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}


                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="payment"
                                    options={props.payment.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "30ch"}}
                                    value={data.payment.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            payment: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Płatność"
                                            sx={{my: 1}}
                                            {...register("payment")}
                                            value={data.payment.name}
                                            color={fieldErrors.payment?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.payment?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.payment?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="payment"
                                label="Płatność"
                                sx={{my: 1, width: "30ch"}}
                                {...register("payment")}
                                color={fieldErrors.payment?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        <FormControl
                            sx={{width: "30ch", display: "flex", flexDirection: "column", alignItems: 'center'}}
                        >
                            <FormControlLabel
                                label={<Typography>Czarna lista</Typography>}
                                control={
                                    <Checkbox
                                        id="blacklist-select"
                                        label="Czarna lista"
                                        size={"large"}
                                        disabled={!props.editing}
                                        checked={checked}
                                        onChange={(value) => {
                                            // setProductModel({...productModel, product_group_id: value.target.value});
                                            setChecked(value.target.checked)
                                            setData({
                                                ...data,
                                                blacklist: value.target.checked ? 1 : 0,
                                            })
                                            setEdited(true)
                                        }}
                                    />
                                }
                            />
                            {fieldErrors.blacklist?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                    {fieldErrors.blacklist?.message.toString()}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                </Box>

                <Fade in={edited}>
                    <Button type="submit" variant="outlined" startIcon={<Save/>}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 230,
                            }}>
                        Zapisz
                    </Button>
                </Fade>
                <Fade in={edited}>
                    <Button variant="outlined" startIcon={<Cancel/>}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 335,
                            }}
                            onClick={resetForm}
                    >
                        Cofnij zmiany
                    </Button>
                </Fade>
            </Box>
        </form>
    );
}
