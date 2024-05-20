import {
    Autocomplete,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, MenuItem, Paper, Select,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect, useCallback} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {Cron} from "@/Components/Dialogs/PartnersDialog/PartnersExportAddDialog/Cron";
import POLISH_LOCALE from "@/Components/Dialogs/PartnersDialog/PartnersExportAddDialog/pl_locale";

export default function PartnersExportAddDialog({open, setOpen, partner, exportElement = null}) {

    const {data, setData, post, patch, processing, reset} = useForm({
        type: exportElement ? exportElement.type : 1,
        cron: exportElement ? exportElement.cron : '0 2 * * 3',
    })
    const nextStep = () => {
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
        setActiveStep(0);
        setOpen(false);
    };

    const save = () => {
        if (exportElement) {
            patch(route("system.partners.partner.export.update", {partner: partner.id, export: exportElement.id}),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano partnera", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy edycji partnera", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            post(route("system.partners.partner.export.create", {partner: partner.id}),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano partnera", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawaniu partnera", {variant: 'error'})
                        console.error(errors)
                    },
                })
        }
    }


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
            maxWidth={"sm"}
            fullWidth={true}
        >


            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Dodawanie Produktu
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
                    <Step1 data={data} setData={setData}/> : null}
                {activeStep === 1 ? <Step2 data={data} setData={setData}/> : null}


            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>
                <Button onClick={previousStep} disabled={activeStep === 0}>
                    Wstecz
                </Button>

                <Button onClick={nextStep}
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

function Step1({data, setData}) {

    const [error, onError] = useState()

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Autocomplete
                disablePortal
                id="type"
                options={[
                    1, 2
                ]}
                sx={{width: "30ch"}}
                value={data.type}
                getOptionLabel={(option) => (option === 1 ? "XML" : "Excel")}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, value) => setData("type", value)}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Typ"
                        sx={{my: 1}}
                        value={data.type}
                    />}
            />
            <Box sx={{mt: 2}}>

                <Typography variant="h6" gutterBottom>
                    Częstotliwość aktualizacji pliku
                </Typography>
                <TextField
                    type="text"
                    id="cron"
                    label="Częstotliwość"
                    value={data.cron}
                    disabled={true}
                    sx={{width: "30ch", my: 1}}
                />
                <Paper sx={{p: 2}}>
                    <Cron
                        value={data.cron}
                        setValue={(value, e) => setData("cron", value)}
                        onError={onError}
                        clearButton={false}
                        leadingZero={true}
                        shortcuts={false}
                        locale={POLISH_LOCALE}
                        className={"my-project-cron"}
                    />
                </Paper>

            </Box>
        </Box>
    );
}

function Step2({data}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="type" label="Typ" variant="outlined"
                       value={data.type === 1 ? "XML" : "Excel"}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField
                type="text"
                id="cron"
                label="Częstotliwość"
                variant={"outlined"}
                value={data.cron}
                disabled={true}
                sx={{width: "30ch", my: 1}}
            />
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
