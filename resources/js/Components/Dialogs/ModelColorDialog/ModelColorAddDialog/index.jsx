import {
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, ListItemText, MenuItem, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';
import {useState, useRef} from "react";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import ProductsAddDialog from "@/Components/Dialogs/ProductsDialog/ProductsAddDialog";

export default function ModelColorAddDialog({open, setOpen, reloadData, roles, params}) {
    const form = useRef();
    const formName = useRef();
    const formShortcut = useRef();

    const [color, setColor] = useState({});

    const {data, setData, post, processing, errors, clearErrors, reset} = useForm({
        name: '',
        shortcut: '',
    })


    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];


    const nextStep = () => {
        if (activeStep == 0) {
            if (!formName.current.isValid() || data.name === "") return;
            if (!formShortcut.current.isValid() || data.name === "") return;
        }
        setActiveStep(activeStep + 1)

    }
    const previousStep = () => {
        setActiveStep(activeStep - 1);
        clearErrors()
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        post(route("system.products.model.color", {model: params.productModel.id}),

            {
                preserveScroll: true,
                onSuccess: (e) => {
                    setColor(e.props.productModel.colors_with_images.find((e) => e.shortcut == data.shortcut))
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Dodano kolor", {variant: 'success'})
                    handleClose();
                    setOpenDialogAdd(true);
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy dodawniu koloru", {variant: 'error'})
                    console.error(errors)
                },
            })


    }
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                scroll="paper"
            >

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Dodawanie koloru
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
                            data={data}
                            setData={setData}
                            formRef={form}
                            formNameRef={formName}
                            formShortcutRef={formShortcut}
                        /> : ""}
                    {activeStep === 1 ? <Step2 data={data} setData={setData} roles={roles} errors={errors}/> : ""}

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

            <ProductsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} color={color}
                               method={"create"} props={params}/>
        </>
    );
}

function Step1({data, setData, formRef, formNameRef, formShortcutRef}) {

    return (
        <Box>
            <ValidatorForm instantValidate ref={formRef} onSubmit={() => {
            }}>
                <TextValidator
                    id="shortcut"
                    label="Symbol"
                    ref={formShortcutRef}
                    onChange={(value) => {
                        setData('shortcut', value.target.value);
                    }}
                    validators={['required', 'maxStringLength:10', 'minStringLength:1']}
                    errorMessages={['Pole wymagane', 'Minimalna długość nazwy to 20', 'Minimalna długość nazwy to 2']}
                    value={data.shortcut}
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

function Step2({data, setData, errors}) {
    const renderCell = (selected) => selected.map((value) => {
        return (<Typography key={value} variant="body1" gutterBottom>
            {roles.find(e => e.id == value).name}
        </Typography>);
    })
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="shortcut" label="Symbol" variant="outlined"
                       value={data.shortcut}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>


            {Object.keys(errors).map((key, index) => {
                return (<Typography variant="body1" color={"error"} align={"center"} gutterBottom key={index}>
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

