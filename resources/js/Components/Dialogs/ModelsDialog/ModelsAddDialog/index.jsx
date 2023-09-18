import {
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

export default function ModelsAddDialog({open, setOpen, reloadData}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useModelsAddForm()

    const {data, setData, post, processing, reset} = useForm({
        name: '',
        symbol: ''
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("symbol", data.symbol)
        setValue("name", data.name)
    }, [setValue]);

    const onSubmit = (data) => {
        setData(data)
        setActiveStep(activeStep + 1)

        console.log("Model data: ", data)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj nazwe",
        "Podsumowanie"
    ];


    const previousStep = () => {
        setActiveStep(activeStep - 1);
    }

    const handleClose = () => {
        setValue("symbol", "");
        setValue("name", "");
        clrErrors("symbol");
        clrErrors("name");

        setActiveStep(0);

        setOpen(false);
    };

    const save = () => {
        post(route("system.products.models.create"),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Dodano model", {variant: 'success'})
                    reloadData();
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy dodawaniu modelu", {variant: 'error'})
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
                    Dodawanie modelu
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
                        <Step1 data={data} register={register} errors={fieldErrors}/> : null}
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

function Step1({data, register, errors}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography variant="body2" color={"error"} textAlign={"center"}>
                Pamiętaj! Symbolu nie można później zmienić
            </Typography>
            <TextField
                type="text"
                id="symbol"
                label="Symbol"
                color={errors.symbol?.message && "error"}
                {...register("symbol")}
                defaultValue={data.symbol}
                sx={{width: "30ch", my: 1}}
            />
            {errors.symbol?.message && (
                <Typography variant="caption" color="error" sx={{ml: 1}}>
                    {errors.symbol?.message.toString()}
                </Typography>
            )}
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
                <Typography variant="caption" color="error" sx={{ml: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}
        </Box>
    );
}

function Step2({data}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="symbol" label="Symbol" variant="outlined"
                       value={data.symbol}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>
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
