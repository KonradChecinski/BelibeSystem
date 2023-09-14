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
import {useRolesAddForm} from "@/Components/Dialogs/RolesDialog/RolesAddDialog/form/useRolesAddForm";

export default function RolesAddDialog({open, setOpen, reloadData}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useRolesAddForm()

    const {data, setData, post, processing, reset} = useForm({
        name: '',
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
    }, [setValue]);

    const onSubmit = (data) => {
        setData(data)
        setActiveStep(activeStep + 1)

        console.log("Role data: ", data)
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
        setValue("name", "");
        clrErrors("name");

        setActiveStep(0);

        setOpen(false);
    };

    const save = () => {
        post(route("system.settings.roles"),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    reloadData();
                    handleClose();
                }
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
                    Dodawanie roli systemowej
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
                        <Step1 name={data.name} register={register} errors={fieldErrors}/> : null}
                    {activeStep === 1 ? <Step2 name={data.name} setName={setData}/> : null}

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

function Step1({name, register, errors}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField
                type="text"
                id="name"
                label="Nazwa"
                color={errors.name?.message && "error"}
                {...register("name")}
                defaultValue={name}
                sx={{width: "30ch"}}
            />
            {errors.name?.message && (
                <Typography variant="caption" color="error" sx={{ml: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}
        </Box>
    );
}

function Step2({name}) {
    return (
        <Box>
            <TextField id="name" label="Nazwa" variant="outlined"
                       value={name}
                       disabled={true}
                       sx={{width: "30ch"}}
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
