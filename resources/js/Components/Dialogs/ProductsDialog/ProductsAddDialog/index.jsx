import {
    Autocomplete,
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
import {DataGrid, useGridApiRef} from "@mui/x-data-grid";

export default function ProductsAddDialog({open, setOpen, reloadData, color, props}) {
    const form = useRef();
    const formName = useRef();
    const formShortcut = useRef();


    const {data, setData, post, processing, errors, clearErrors, reset} = useForm({
        color: {
            id: color?.id,
            shortcut: color?.shortcut,
            label: color?.shortcut + " - " + color?.name
        },
        symbol: createSymbol(props?.productModel.symbol, color?.id),
        name: '',
        size: '',
        unit: '',
        barcode: []
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
        post(route("system.products.model.color", {model: props.productModel.id}),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Dodano kolor", {variant: 'success'})
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy dodawniu koloru", {variant: 'error'})
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
                Dodawanie produktu
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
                        props={props}
                        formRef={form}
                        formNameRef={formName}
                        formShortcutRef={formShortcut}
                    /> : ""}
                {activeStep === 1 ? <Step2 data={data} setData={setData} color={color} errors={errors}/> : ""}

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

function Step1({data, setData, props, formRef, formNameRef, formShortcutRef}) {
    const apiRef = useGridApiRef();
    const addColumn = () => {
        setData("barcode", [...data.barcode, {id: Math.floor(Math.random() * 100000000), barcode: ""}])
    }
    const handleProcessRowUpdate = (newRow, oldRow) => {
        console.log(newRow.barcode.length !== 13 && isNaN(newRow.barcode))
        if (!isNaN(newRow.barcode) && newRow.barcode.length === 13) {
            setData("barcode", data.barcode.map((row) => (row.id === newRow.id ? newRow : row)))
            return newRow;
        }


    }

    return (
        <Box>
            <ValidatorForm instantValidate ref={formRef} onSubmit={() => {
            }}>
                <Autocomplete
                    disablePortal
                    id="color"
                    options={props.productModel.colors_with_images.map(e => ({
                        id: e.id,
                        shortcut: e.shortcut,
                        label: e.shortcut + " - " + e.name
                    }))}
                    sx={{width: "30ch"}}
                    value={data.color}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => {
                        setData({
                            ...data,
                            color: value,
                            symbol: createSymbol(props?.productModel.symbol, value.shortcut, data.size)
                        })
                    }}
                    renderInput={(params) => <TextField {...params} label="Kolor" sx={{my: 1}}/>}
                />

                <Autocomplete
                    disablePortal
                    id="size"
                    options={["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL",
                        "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164", "170"]}
                    sx={{width: "30ch"}}
                    value={data.size}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value) => {
                        setData({
                            ...data,
                            size: value,
                            symbol: createSymbol(props?.productModel.symbol, data.color.shortcut, value)
                        })
                    }}
                    renderInput={(params) => <TextField {...params} label="Rozmiar" sx={{my: 1}}/>}
                />

                <TextField id="shortcut" label="Symbol" variant="outlined"
                           value={data.symbol}
                           inputProps={{readOnly: true}}
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


                <Autocomplete
                    disablePortal
                    id="unit"
                    options={["szt."]}
                    sx={{width: "30ch"}}
                    value={data.unit}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, value) => {
                        setData("unit", value)
                    }}
                    renderInput={(params) => <TextField {...params} label="Jednostka" sx={{my: 1}}/>}
                />
                <Box sx={{position: "relative"}}>
                    <DataGrid apiRef={apiRef}
                              rows={data.barcode}
                              columns={[{
                                  field: 'barcode',
                                  // type: 'number',
                                  flex: 1,
                                  align: "left",
                                  headerName: "Kody kreskowe",
                                  headerAlign: "left",
                                  sortable: false,
                                  editable: true
                              }]}
                              disableColumnMenu
                              autoHeight={true}
                              hideFooter={true}
                              editMode={"row"}
                              processRowUpdate={handleProcessRowUpdate}
                    />
                    <Button size="small" onClick={addColumn} sx={{position: "absolute", right: 10, top: 15}}>
                        Dodaj
                    </Button>
                </Box>


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
            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="shortcut" label="Symbol" variant="outlined"
                       value={data.shortcut}
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

const createSymbol = (modelSymbol = '', colorId = '', size = '') => {
    return modelSymbol + "-" + colorId + "-" + size
}
