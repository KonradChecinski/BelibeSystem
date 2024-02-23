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
import {AddBox, CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material';
import {
    useAdditionalClientInfoForm
} from "@/Components/Pages/Client/AdditionalClientInfoComponent/form/useAdditionalClientInfoForm";
import {enqueueSnackbar} from "notistack";


export default function AdditionalClientInfoComponent(props) {
    const [edited, setEdited] = useState(false);

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors,
        getValues
    } = useAdditionalClientInfoForm()

    const {data, setData, processing, post} = useForm({
        'id': props.client.id,
        'status': props.client.status,
        'priority': props.client.priority,
        'source_of_acquisition': props.client.source_of_acquisition,
        'payments': props.client ? props.client.payments.map(obj => ({...obj, label: obj.name})) : [],
        'account_manager': props.client.account_manager,
        'blacklist': props.client.blacklist,
    })

    const [checked, setChecked] = useState(props.client.blacklist !== 0);

    const initializeFieldValues = () => {
        setValue('id', data.id)
        setValue('status', data.status.name)
        setValue('priority', data.priority === 1 ? "Niski" : data.priority === 2 ? "Średni" : "Wysoki")
        setValue('source_of_acquisition', data.source_of_acquisition.name)
        setValue('payments', data.payments ? data.payments.map(obj => ({...obj, label: obj.name})) : "")
        setValue('account_manager', data.account_manager.name)
    }

    useEffect(() => {
        // inicjacja wartości pól
        initializeFieldValues()
    }, [setValue]);

    const onSubmit = (formData) => {
        saveBasic()
    }

    const resetForm = () => {
        setData({
            'id': props.client.id,
            'status': props.client.status,
            'priority': props.client.priority,
            'source_of_acquisition': props.client.source_of_acquisition,
            'payments': props.client.payments,
            'account_manager': props.client.account_manager,
            'blacklist': props.client.blacklist,
        });

        initializeFieldValues()
        setChecked(props.client.blacklist !== 0)
        setEdited(false);

        clearErrors('status')
        clearErrors('priority')
        clearErrors('source_of_acquisition')
        clearErrors('payments')
        clearErrors('account_manager')
        clearErrors('blacklist')
    };
    const saveBasic = () => {
        post(route("system.clients.client.update.additional", {client: data.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano dodatkowe informację", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu dodatkowych informacji", {variant: 'error'})
            },
            preserveScroll: true
        })
    }
    console.log(data)
    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Box sx={{display: "flex", flexDirection: "column", gap: 8}}>
                <Box>
                    <Typography
                        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                        <AddBox fontSize={"large"}/>
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
                                    id="payments"
                                    multiple
                                    disableCloseOnSelect
                                    options={props.payment.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "30ch"}}
                                    value={data.payments}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            payments: value,
                                        })
                                        setValue('payments', value, {shouldValidate: true})
                                        setEdited(true)
                                        console.log("formValues: ", getValues("payments"))
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option, {selected}) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlank fontSize="small"/>}
                                                checkedIcon={<CheckBox fontSize="small"/>}
                                                style={{marginRight: 8}}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Płatność"
                                            sx={{my: 1}}
                                            {...register("payments")}
                                            // value={data.payment.name}
                                            color={fieldErrors.payments?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.payments?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -3, mb: 1.5}}>
                                        {fieldErrors.payments?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="payments"
                                label="Płatność"
                                sx={{my: 1, width: "30ch"}}
                                {...register("payments")}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="account_manager"
                                    options={props.user.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "30ch"}}
                                    value={data.account_manager.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            account_manager: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Opiekun klienta"
                                            sx={{my: 1}}
                                            {...register("account_manager")}
                                            value={data.account_manager.name}
                                            color={fieldErrors.account_manager?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.account_manager?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.account_manager?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="account_manager"
                                label="Opiekun klienta"
                                sx={{my: 1, width: "30ch"}}
                                {...register("account_manager")}
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
