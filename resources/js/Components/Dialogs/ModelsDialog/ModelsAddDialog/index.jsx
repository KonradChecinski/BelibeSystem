import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField
} from "@mui/material";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useState, useRef} from "react";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function ModelsAddDialog({open, setOpen, reloadData, params}) {
    const form = useRef();
    const formName = useRef();
    const formSymbol = useRef();

    const {data, setData, post, processing, errors, reset} = useForm({
        name: '',
        symbol: ''
    })

    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj nazwe",
        "Podsumowanie"
    ];


    const nextStep = () => {
        if (activeStep == 0) {
            if (!formName.current.isValid()) return;
            if (!formSymbol.current.isValid()) return;
        }
        setActiveStep(activeStep + 1)

    }
    const previousStep = () => {
        setActiveStep(activeStep - 1);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
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
                    <Step1 data={data} setData={setData} formRef={form} formNameRef={formName}
                           formSymbolRef={formSymbol}/> : ""}
                {activeStep === 1 ? <Step2 data={data} setData={setData}/> : ""}

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>

                <Button onClick={previousStep} disabled={activeStep === 0}>
                    Wstecz
                </Button>

                <Button onClick={nextStep} disabled={activeStep === 1}
                        sx={{display: activeStep === 1 ? "none" : "block"}}>
                    Następne
                </Button>

                <Button onClick={save} disabled={processing}
                        sx={{display: activeStep === 0 ? "none" : "block"}}>
                    Zapisz
                </Button>
            </DialogActions>

        </Dialog>

    );
}

function Step1({data, setData, formRef, formNameRef, formSymbolRef}) {
    return (
        <Box>
            <ValidatorForm instantValidate ref={formRef} onSubmit={() => {
            }}>
                <TextValidator
                    id="symbol"
                    label="Symbol"
                    ref={formSymbolRef}
                    onChange={(value) => {
                        setData('symbol', value.target.value);
                    }}
                    validators={['required', 'minStringLength:3']}
                    errorMessages={['Pole wymagane', 'Minimalna długość nazwy to 3']}
                    // errorMessages={['this field is required']}
                    value={data.symbol}
                    sx={{width: "30ch", my: 1}}
                />
                <TextValidator
                    id="name"
                    label="Nazwa"
                    ref={formNameRef}
                    onChange={(value) => {
                        setData('name', value.target.value);
                    }}
                    validators={['required', 'minStringLength:3']}
                    errorMessages={['Pole wymagane', 'Minimalna długość nazwy to 3']}
                    // errorMessages={['this field is required']}
                    value={data.name}
                    sx={{width: "30ch", my: 1}}
                />

            </ValidatorForm>
        </Box>
    );
}

function Step2({data, setData}) {
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
