import {
    Autocomplete,
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Paper, Select,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {useUserAddForm} from "@/Components/Dialogs/PaymentDialog/PaymentAddDialog/form/useUserAddForm";
import {addSchema, editSchema} from "@/Components/Dialogs/PaymentDialog/PaymentAddDialog/form/userAddFormSchema";

export default function PaymentAddDialog({open, setOpen, clickedPayment}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useUserAddForm(clickedPayment ? editSchema : addSchema)

    const {data, setData, post, patch, processing, errors, clearErrors, reset, transform} = useForm({
        name: clickedPayment?.name ? clickedPayment?.name : '',
        subiekt_id: clickedPayment?.subiekt_id ? clickedPayment?.subiekt_id : '',
        type: clickedPayment?.type ? {
            id: clickedPayment.type,
            name: clickedPayment.type === 1 ? "Pobranie" : "Termin",
            label: clickedPayment.type === 1 ? "Pobranie" : "Termin"
        } : '',
    })


    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
        setValue("subiekt_id", data.subiekt_id)
        setValue("type", data.type.name)
    }, [setValue]);

    const onSubmit = (data) => {
        // setData(data)
        setActiveStep(activeStep + 1)
        // console.log(data)
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
        // setValue("name", "");
        // setValue("email", "");
        // setValue("password", "");
        // setValue("roles", []);
        //
        // setData("roles", Array());

        clrErrors("name")
        clrErrors("subiekt_id")
        clrErrors("type")

        setActiveStep(0);

        setOpen(false);
    };

    const save = () => {
        if (!clickedPayment) {

            post(route("system.settings.payment.create"),

                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano płatność", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy zapisywaniu płatności", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            patch(route("system.settings.payment.update", {b2bPayment: clickedPayment.id}),

                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Zaktualizowano płatność", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy aktualizacji płatności", {variant: 'error'})
                        console.error(errors)
                    },
                })
        }
    }
    transform((data) => {
        return {
            ...data,
            type: data.type.id
        }
    })

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
                    {clickedPayment ? "Edytuj płatność" : "Dodaj płatność"}
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
                            clickedUser={clickedPayment}
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

function Step1({register, errors, data, setData, clickedUser}) {
    const options = [
        {id: 1, name: "Pobranie", label: "Pobranie"},
        {id: 2, name: "Termin", label: "Termin"}
    ]

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
                onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}

            <TextField
                type="number"
                id="subiekt_id"
                label="Id w Subiekcie"
                color={errors.subiekt_id?.message && "error"}
                {...register("subiekt_id")}
                defaultValue={data.subiekt_id}
                sx={{width: "30ch", my: 1, mt: 2}}
                onChange={(e) => setData("subiekt_id", e.target.value)}
            />
            {errors.subiekt_id?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.subiekt_id?.message.toString()}
                </Typography>
            )}

            <Autocomplete
                id="type"
                disablePortal
                options={options}
                sx={{width: "30ch"}}
                value={data.type}
                // getOptionLabel={(option) => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) => {
                    setData("type", value)
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Typ"
                        sx={{my: 1}}
                        {...register("type")}
                        // value={data.type}
                        color={errors.type?.message && "error"}
                    />
                }
            />

            {errors.type?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                    {errors.type?.message.toString()}
                </Typography>
            )}


        </Box>
    );
}

function Step2({data, errors}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="subiekt_id" label="Id w Subiekcie" variant="outlined"
                       value={data.subiekt_id}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="type" label="Typ" variant="outlined"
                       value={data.type.name}
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

