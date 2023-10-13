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
    useDictionaryAddForm
} from "@/Components/Dialogs/DictionariesDialog/DictionariesAddDialog/form/useDictionaryAddForm";
import {
    gpcSchema,
    schema
} from "@/Components/Dialogs/DictionariesDialog/DictionariesAddDialog/form/dictionaryAddFormSchema";

export default function DictionariesAddDialog({open, setOpen, reloadData, dictionaryType, clickedRow, isGpc}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useDictionaryAddForm(isGpc ? gpcSchema : schema)

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm(!isGpc ? {
        clickedRowId: clickedRow ? clickedRow.id : null,
        clickedRowName: clickedRow ? clickedRow.name : null
    } : {
        clickedRowId: clickedRow ? clickedRow.id : null,
        clickedRowName: clickedRow ? clickedRow.name : null,
        clickedRowValue: clickedRow ? clickedRow.value : null
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
    }, [setValue]);

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
        setValue("name", null);
        clrErrors("name")
        setActiveStep(0);
        setOpen(false);
    };

    const currentDictionaryString = () => {
        if (dictionaryType === "sizes") return "rozmiar"
        else if (dictionaryType === "unit") return "jednostkę"
        else if (dictionaryType === "group") return "grupę"
        else if (dictionaryType === "brand" || dictionaryType === "gs1.brand") return "markę"
        else if (dictionaryType === "gs1.gpc") return "gpc"
    }
    const currentDictionaryString2 = () => {
        if (dictionaryType === "sizes") return "rozmiaru"
        else if (dictionaryType === "unit") return "jednostki"
        else if (dictionaryType === "group") return "grupy"
        else if (dictionaryType === "brand" || dictionaryType === "gs1.brand") return "marki"
        else if (dictionaryType === "gs1.gpc") return "gpc"
    }

    const save = () => {
        if (!clickedRow) {

            post(route(`system.settings.${dictionaryType}.create`),

                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano element w słowniku", {variant: 'success'})
                        reloadData();
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy zapisywaniu elementu słownika", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            patch(route(`system.settings.${dictionaryType}.update`, {user: clickedRow.id}),

                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar(`Zaktualizowano ${currentDictionaryString()}`, {variant: 'success'})
                        reloadData();
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar(`Błąd przy aktualizacji ${currentDictionaryString2()}`, {variant: 'error'})
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
        >

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    {clickedRow ? `Edytuj ${currentDictionaryString()}` : `Dodaj ${currentDictionaryString()}`}
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
                            clickedRow={clickedRow}
                            isGpc={isGpc}
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

function Step1({register, errors, data, isGpc}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>

            <TextField
                type="text"
                id="name"
                label="Nazwa"
                color={errors.name?.message && "error"}
                {...register("name")}
                defaultValue={data.clickedRowName}
                sx={{width: "30ch", my: 1}}
            />
            {errors.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}

            {isGpc ? (
                <>
                    <TextField
                        type="text"
                        id="value"
                        label="Wartość"
                        color={errors.value?.message && "error"}
                        {...register("value")}
                        defaultValue={data.clickedRowValue}
                        sx={{width: "30ch", my: 1}}
                    />
                    {errors.value?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {errors.value?.message.toString()}
                        </Typography>
                    )}
                </>
            ) : null}
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

