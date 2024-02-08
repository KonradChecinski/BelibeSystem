import {
    Autocomplete,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {useModelsAddForm} from "@/Components/Dialogs/ModelsDialog/ModelsAddDialog/form/useModelsAddForm";

export default function ClientsAddDialog({open, setOpen, reloadData, country}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useModelsAddForm()

    const {data, setData, post, processing, reset} = useForm({
        country: {id: 0, name: '', label: ''},
        nip: '',
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("country", data.country.name)
        setValue("nip", data.nip)

    }, [setValue]);

    const onSubmit = (data) => {
        console.log(data)
        setData(data)
        setActiveStep(activeStep + 1)

        console.log("Client data: ", data)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];


    const previousStep = () => {
        setActiveStep(activeStep - 1);
    }

    const handleClose = () => {
        setValue("country", "");
        setValue("nip", "");
        clrErrors("country");
        clrErrors("nip");

        setActiveStep(0);

        setOpen(false);
    };

    const save = () => {
        post(route("system.products.client"),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Dodano klienta", {variant: 'success'})
                    reloadData();
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy dodawaniu klienta", {variant: 'error'})
                    console.error(errors)
                },
            })
    }


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Dodawanie Klienta
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
                        <Step1 data={data} setData={setData} register={register} errors={fieldErrors}
                               country={country}/> : null}
                    {activeStep === 1 ? <Step2 data={data} setData={setData}/> : null}

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Zamknij
                    </Button>

                    <Button onClick={previousStep} disabled={activeStep === 0}>
                        Wstecz
                    </Button>

                    <Button type="submit"
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

    );
}

function Step1({data, setData, register, errors, country}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography sx={{mb: 1}} variant="body2" color="error" textAlign="center">
                Pamiętaj! Nipu nie można później zmienić
            </Typography>
            <Autocomplete
                id="country"
                options={country.map(e => ({
                    id: e.id,
                    name: e.name,
                    label: e.name
                }))}
                sx={{width: "30ch"}}
                value={data.country.name}
                isOptionEqualToValue={(option, value) => option.name === value}
                onChange={(e, value) => {
                    setData({
                        ...data,
                        country: value,
                    })
                    console.log(data)
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
            <TextField
                type="text"
                id="nip"
                label="Nip"
                color={errors.nip?.message && "error"}
                {...register("nip")}
                defaultValue={data.nip}
                sx={{width: "30ch", my: 1}}
            />
            {errors.nip?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.nip?.message.toString()}
                </Typography>
            )}
        </Box>
    );
}

function Step2({data}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="country" label="Kraj" variant="outlined"
                       value={data.country.name}
                       inputProps={{readOnly: true}}
                       sx={{width: "30ch"}}/>
            <TextField id="nip" label="Nip" variant="outlined"
                       value={data.symbol}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>


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
