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
import {useClientFindGusForm} from "@/Components/Dialogs/ClientDialog/ClientFindGusDialog/form/useClientFindGusForm";

export default function ClientFindGusDialog({
                                                open,
                                                setOpen,
                                                nip = ''
                                            }) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientFindGusForm()

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        nip: nip,
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("nip", data.nip)
    }, [setValue]);

    const onSubmit = (data) => {
        setData(data)
        setActiveStep(activeStep + 1)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj NIP",
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

    const save = () => {
        // if (!clickedRow) {
        //
        //     post(route(`system.settings.${dictionaryType}.create`),
        //
        //         {
        //             preserveScroll: true,
        //             onSuccess: () => {
        //                 reset();
        //                 setActiveStep(0);
        //                 enqueueSnackbar("Dodano element w słowniku", {variant: 'success'})
        //                 reloadData();
        //                 handleClose();
        //             },
        //             onError: errors => {
        //                 enqueueSnackbar("Błąd przy zapisywaniu elementu słownika", {variant: 'error'})
        //                 console.error(errors)
        //             },
        //         })
        // } else {
        //     console.log(route(`system.settings.${dictionaryType}.update`, routeParam));
        //     patch(route(`system.settings.${dictionaryType}.update`, routeParam),
        //
        //         {
        //             preserveScroll: true,
        //             onSuccess: () => {
        //                 reset();
        //                 setActiveStep(0);
        //                 enqueueSnackbar(`Zaktualizowano ${currentDictionaryString()}`, {variant: 'success'})
        //                 reloadData();
        //                 handleClose();
        //             },
        //             onError: errors => {
        //                 enqueueSnackbar(`Błąd przy aktualizacji ${currentDictionaryString2()}`, {variant: 'error'})
        //                 console.error(errors)
        //             },
        //         })
        // }
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
                    {"Uzupełnij dane adresowe z GUS"}
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
                    {activeStep === 1 ? <Step2 data={data} setData={setData} errors={errors} isGpc={isGpc}/> : null}

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
                id="nip"
                label="NIP"
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

function Step2({data, errors}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="nip" label="NIP" variant="outlined"
                       value={data?.nip}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

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

