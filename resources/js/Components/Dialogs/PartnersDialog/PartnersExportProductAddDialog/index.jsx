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
import SearchProductComponent
    from "@/Components/Dialogs/PartnersDialog/PartnersExportProductAddDialog/SearchProductComponent";

export default function PartnersExportProductAddDialog({open, setOpen, partner, products}) {

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];


    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        // post(route("system.partners.create"),
        //
        //     {
        //         preserveScroll: true,
        //         onSuccess: () => {
        //             reset();
        //             setActiveStep(0);
        //             enqueueSnackbar("Dodano partnera", {variant: 'success'})
        //             reloadData();
        //             handleClose();
        //         },
        //         onError: errors => {
        //             enqueueSnackbar("Błąd przy dodawaniu partnera", {variant: 'error'})
        //             console.error(errors)
        //         },
        //     })
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

                <Step1 partner={partner} products={products}/>


            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>
            </DialogActions>

        </Dialog>

    );
}

function Step1({partner, products}) {
    return (
        <SearchProductComponent partner={partner} products={products}/>
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
