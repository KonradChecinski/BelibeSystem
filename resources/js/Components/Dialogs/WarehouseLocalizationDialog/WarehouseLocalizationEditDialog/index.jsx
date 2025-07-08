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
import {
    useLocationEditForm
} from "@/Components/Dialogs/WarehouseLocalizationDialog/WarehouseLocalizationEditDialog/form/useLocationEditForm";

export default function EditLocalizationDialog({open, setOpen, type, clickedLocalization}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useLocationEditForm()

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        name: clickedLocalization.name
    })
    // console.log("data", data)


    const onSubmit = (data) => {
        setData(data)
        setActiveStep(activeStep + 1)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj nazwe",
        "Podsumowanie"
    ];

    const previousStep = () => {
        setActiveStep(activeStep - 1);
        clearErrors()
    }

    const handleClose = () => {
        clrErrors("name")
        setActiveStep(0);
        setOpen(false);
    };

    const title = () => {
        switch (type) {
            case "room":
                return "Edycja Pomieszczenia";
            case "aisle":
                return "Edycja Przejścia";
            case "shelf":
                return "Edycja Regału";
        }
    }

    const path = () => {
        switch (type) {
            case "room":
                return "system.settings.warehouseLocation.room.update";
            case "aisle":
                return "system.settings.warehouseLocation.aisle.update";
            case "shelf":
                return "system.settings.warehouseLocation.shelf.update";
        }
    }


    const save = () => {
        patch(route(path(), {warehouseLocation: clickedLocalization.id.split('-')[1]}),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar('Zaktualizowano lokalizacje', {variant: 'success'})
                    handleClose();
                    clickedLocalization.name = data.name;
                },
                onError: errors => {
                    enqueueSnackbar('Błąd przy aktualizacji lokalizacji', {variant: 'error'})
                    console.error(errors)
                    if (errors) {
                        Object.keys(errors).forEach(key => {
                            enqueueSnackbar(errors[key], {variant: 'error'})
                        });
                    }
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
                    {title()}
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
                            register={register}
                            errors={fieldErrors}
                            data={data}
                            setData={setData}
                        />
                        : null}
                    {activeStep === 1 ? <Step2 data={data} setData={setData} errors={errors}/> : null}

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

function Step1({register, errors, data}) {

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
                    {errors.name?.message.toString()}
                </Typography>
            )}
        </Box>
    );
}

function Step2({data, errors, isGpc}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            {isGpc ? (
                <TextField id="value" label="Wartość" variant="outlined"
                           value={data.value}
                           disabled={true}
                           sx={{width: "30ch", my: 1}}/>
            ) : null}

            {Object.keys(errors).map((key, index) => {
                return (<Typography variant="body2" color={"error"} align={"center"} gutterBottom key={index}>
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

