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
import {useClientsAddForm} from "@/Components/Dialogs/PartnersDialog/PartnersAddDialog/form/useClientsAddForm";

export default function PartnersAddDialog({open, setOpen, reloadData}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientsAddForm()

    const {data, setData, post, processing, reset} = useForm({
        name: '',
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)

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
        setValue("name", "");
        clrErrors("name");

        setActiveStep(0);

        setOpen(false);
    };

    const save = () => {
        post(route("system.partners.create"),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Dodano partnera", {variant: 'success'})
                    reloadData();
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy dodawaniu partnera", {variant: 'error'})
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
                        <Step1 data={data} setData={setData} register={register} errors={fieldErrors}/> : null}
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

function Step1({data, setData, register, errors}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField
                type="text"
                id="name"
                label="Nazwa"
                color={errors.name?.message && "error"}
                {...register("name")}
                defaultValue={data.name}
                sx={{width: "30ch", my: 1}}
            />
            {errors.name?.message && (
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
            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
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
