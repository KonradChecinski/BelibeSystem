import {
    Autocomplete,
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {
    useClientLocationsDialogForm
} from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditLocationsDialog/form/useClientLocationsDialogForm";
import {enqueueSnackbar} from "notistack";

export default function ClientAddEditLocationsDialog({
                                                         open,
                                                         setOpen,
                                                         clickedLocation,
                                                         params,
                                                     }) {

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientLocationsDialogForm();

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        active: clickedLocation ? clickedLocation.active : 0,
        country: clickedLocation ? {
            id: clickedLocation.country.id,
            name: clickedLocation.country.name,
            label: clickedLocation.country.name,
        } : null,
        city: clickedLocation ? clickedLocation.city : '',
        street: clickedLocation ? clickedLocation.street : '',
        building_number: clickedLocation ? clickedLocation.building_number : '',
        apartment_number: clickedLocation ? clickedLocation.apartment_number : '',
        postal_code: clickedLocation ? clickedLocation.postal_code : '',
        note: clickedLocation ? clickedLocation.note : '',
    })

    const [checked, setChecked] = useState(clickedLocation ? (clickedLocation.active !== 0) : false);

    useEffect(() => {
        console.log("Clicked location w useEffect: ", clickedLocation);

        // inicjacja wartości pól
        setValue('country', clickedLocation?.country);
        setValue('city', clickedLocation?.city);
        setValue('street', clickedLocation?.street);
        setValue('building_number', clickedLocation?.building_number);
        setValue('apartment_number', clickedLocation?.apartment_number);
        setValue('postal_code', clickedLocation?.postal_code);
        setValue('note', clickedLocation?.note);

        setData({
            active: clickedLocation ? clickedLocation.active : 0,
            country: clickedLocation ? {
                id: clickedLocation.country.id,
                name: clickedLocation.country.name,
                label: clickedLocation.country.name,
            } : null,
            city: clickedLocation ? clickedLocation.city : '',
            street: clickedLocation ? clickedLocation.street : '',
            building_number: clickedLocation ? clickedLocation.building_number : '',
            apartment_number: clickedLocation ? clickedLocation.apartment_number : '',
            postal_code: clickedLocation ? clickedLocation.postal_code : '',
            note: clickedLocation ? clickedLocation.note : '',
        })

        console.log("data w useEffect: ", data);
    }, [setValue, clickedLocation]);

    const onSubmit = (submitData) => {
        console.log("Dane z submit: ", submitData)
        console.log("Dane z InertiaJS: ", data)

        setActiveStep(activeStep + 1)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];

    const previousStep = () => {
        setActiveStep(activeStep - 1);
        clearErrors()
    }

    const handleClose = () => {
        clearErrors()
        clrErrors("country")
        clrErrors("city")
        clrErrors("street")
        clrErrors("building_number")
        clrErrors("apartment_number")
        clrErrors("postal_code")
        clrErrors("note")

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        if (clickedLocation) {
            patch(route("system.clients.client.location.update", {
                    client: params.client.id,
                    clientLocation: clickedLocation.id
                }),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano lokalizacje", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy edycji lokalizacji", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            post(route("system.clients.client.location", {client: params.client.id}),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano lokalizacje", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawniu lokalizacji", {variant: 'error'})
                        console.error(errors)
                    },
                })
        }

    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                scroll="paper"
            >
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                        {clickedLocation ? "Edytuj lokalizację klienta" : "Dodaj lokalizację klienta"}
                    </DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{mt: 1, mb: 3}}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep === 0 ?
                            <Step1
                                data={data}
                                setData={setData}
                                params={params}
                                clickedLocation={clickedLocation}
                                register={register}
                                errors={fieldErrors}
                                checked={checked}
                                setChecked={setChecked}
                            /> : null}
                        {activeStep === 1 ?
                            <Step2 data={data} setData={setData} errors={errors} checked={checked}/> : null}

                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Zamknij
                        </Button>

                        <Button onClick={previousStep} disabled={activeStep === 0}>
                            Wstecz
                        </Button>

                        <Button type="submit" disabled={activeStep === 1}
                                sx={{display: activeStep === 1 ? "none" : "block"}}>
                            Następne
                        </Button>

                        <Button onClick={save} disabled={processing}
                                sx={{display: activeStep === 0 ? "none" : "block"}}>
                            Zapisz
                        </Button>
                    </DialogActions>

                </form>
            </Dialog>
        </>
    );
}

function Step1({data, params, setData, clickedLocation = null, register, errors, checked, setChecked}) {
    console.log(data)
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <FormControl
                sx={{width: "30ch", display: "flex", flexDirection: "column", alignItems: 'center', mb: 2}}
            >
                <FormControlLabel
                    label={<Typography>Aktywna</Typography>}
                    control={
                        <Checkbox
                            id="blacklist-select"
                            label="Aktywna"
                            size={"large"}
                            checked={checked}
                            onChange={(value) => {
                                // setProductModel({...productModel, product_group_id: value.target.value});
                                setChecked(value.target.checked)
                                setData({
                                    ...data,
                                    active: value.target.checked ? 1 : 0,
                                })
                            }}
                        />
                    }
                />
            </FormControl>

            <Box>
                <Autocomplete
                    id="country"
                    options={params.country.map(e => ({
                        id: e.id,
                        name: e.name,
                        label: e.name
                    }))}
                    sx={{width: "30ch"}}
                    value={data.country}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => {
                        setData({
                            ...data,
                            country: value,
                        })
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="Kraj"
                            sx={{my: 1}}
                            {...register("country")}
                            value={data.country}
                            color={errors.country?.message && "error"}
                        />
                    }
                />
                {errors.country?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                        {errors.country?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <TextField
                    type="text"
                    id="city"
                    label="Miasto"
                    color={errors.city?.message && "error"}
                    {...register("city")}
                    onChange={(value) => {
                        setData('city', value.target.value);
                    }}
                    defaultValue={data.city}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.city?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.city?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <TextField
                    type="text"
                    id="street"
                    label="Ulica"
                    color={errors.street?.message && "error"}
                    {...register("street")}
                    onChange={(value) => {
                        setData('street', value.target.value);
                    }}
                    defaultValue={data.street}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.street?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.street?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <TextField
                    type="text"
                    id="building_number"
                    label="Numer budynku"
                    color={errors.building_number?.message && "error"}
                    {...register("building_number")}
                    onChange={(value) => {
                        setData('building_number', value.target.value);
                    }}
                    defaultValue={data.building_number}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.building_number?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.building_number?.message.toString()}
                    </Typography>
                )}
            </Box>


            <Box>
                <TextField
                    type="text"
                    id="apartment_number"
                    label="Numer lokalu"
                    color={errors.apartment_number?.message && "error"}
                    {...register("apartment_number")}
                    onChange={(value) => {
                        setData('apartment_number', value.target.value);
                    }}
                    defaultValue={data.apartment_number}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.apartment_number?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.apartment_number?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <TextField
                    type="text"
                    id="postal_code"
                    label="Kod pocztowy"
                    color={errors.postal_code?.message && "error"}
                    {...register("postal_code")}
                    onChange={(value) => {
                        setData('postal_code', value.target.value);
                    }}
                    defaultValue={data.postal_code}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.postal_code?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.postal_code?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <TextField
                    type="text"
                    id="note"
                    label="Notatka"
                    color={errors.note?.message && "error"}
                    {...register("note")}
                    onChange={(value) => {
                        setData('note', value.target.value);
                    }}
                    defaultValue={data.note}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.note?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.note?.message.toString()}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function Step2({data, errors, checked}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <FormControl
                sx={{width: "30ch", display: "flex", flexDirection: "column", alignItems: 'center', mb: 2}}
            >
                <FormControlLabel
                    label={<Typography>Aktywna</Typography>}
                    control={
                        <Checkbox
                            id="blacklist-select"
                            label="Aktywna"
                            size={"large"}
                            checked={checked}
                            disabled={true}
                        />
                    }
                />
            </FormControl>

            <TextField id="country" label="Kraj" variant="outlined"
                       value={data.country.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="city" label="Miasto" variant="outlined"
                       value={data.city}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="street" label="Ulica" variant="outlined"
                       value={data.street}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="building_number" label="Numer budynku" variant="outlined"
                       value={data.building_number}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="apartment_number" label="Numer lokalu" variant="outlined"
                       value={data.apartment_number}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="postal_code" label="Kod pocztowy" variant="outlined"
                       value={data.postal_code}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="note" label="Notatka" variant="outlined"
                       value={data.note}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            {Object.keys(errors).map((key, index) => {
                return (<Typography variant="body1" color={"error"} align={"center"} gutterBottom key={index}>
                    {errors[key]}
                </Typography>)

            })}
        </Box>
    );
}

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

