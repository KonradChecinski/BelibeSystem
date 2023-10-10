import {
    Autocomplete,
    Box, Button, Dialog, DialogActions,
    DialogContent,
    DialogTitle, Menu, MenuItem, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {DataGrid, GridActionsCellItem, useGridApiRef} from "@mui/x-data-grid";
import validbarcode from "barcode-validator";
import {Delete} from "@mui/icons-material";
import {useProductsAddForm} from "@/Components/Dialogs/ProductsDialog/ProductsAddDialog/form/useProductsAddForm";

export default function ProductsAddDialog({open, setOpen, method, color, actualState = null, props}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useProductsAddForm()

    const initialData = {
        color: {
            id: color?.id,
            shortcut: color?.shortcut,
            label: color?.shortcut + " - " + color?.name
        },
        symbol: method !== "copy" ? (actualState?.symbol ? actualState?.symbol : createSymbol(props?.productModel.symbol, color?.shortcut)) : createSymbol(props?.productModel.symbol, color?.shortcut),
        name: actualState?.name ? actualState?.name : '',
        size: method !== "copy" ? (actualState?.size ? {
            ...actualState?.size,
            label: actualState?.size?.name
        } : null) : null,
        unit: actualState?.unit ? {...actualState?.unit, label: actualState?.unit?.name} : null,
        barcodes: method !== "copy" ? (actualState?.barcodes ? actualState?.barcodes : []) : []
    }

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm(initialData)

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
        setValue("size", data.size)
        setValue("unit", data.unit)
        setValue("color", data.color)

        setData(initialData)
    }, [actualState, color, setValue]);

    const onSubmit = (submitData) => {
        console.log("Dane z InertiaJS: ", data)
        console.log("Dane z submit: ", submitData)

        setActiveStep(activeStep + 1)
    }


    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];

    const previousStep = () => {
        setActiveStep(activeStep - 1);
        clearErrors()
    }

    const handleClose = () => {
        clrErrors("name")
        clrErrors("size")
        clrErrors("unit")
        clrErrors("color")

        setActiveStep(0)

        setOpen(false);
    };

    const save = () => {
        if (method === "create" || method === "copy") {
            post(route("system.products", {modelColor: color.id}),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano produkt", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        setData(data)
                        enqueueSnackbar("Błąd przy dodawniu produktu", {variant: 'error'})
                    },
                })
        } else if (method === "update") {
            patch(route("system.products.update", {product: actualState.id}),

                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano produkt", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        setData(data)
                        enqueueSnackbar("Błąd przy edycji produktu", {variant: 'error'})
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
                    {method === 'create' || method === "copy" ? "Dodawanie produktu" : "Edycja produktu"}
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
                            register={register}
                            errors={fieldErrors}
                        /> : null}
                    {activeStep === 1 ? <Step2 data={data} setData={setData} color={color} errors={errors}/> : ""}

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Zamknij
                    </Button>

                    <Button onClick={previousStep} disabled={activeStep === 0}>
                        Wstecz
                    </Button>

                    <Button type="submit" disabled={activeStep === 1}
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

function Step1({data, setData, props, register, errors}) {
    const apiRef = useGridApiRef();
    const addColumnEmpty = () => {
        setData("barcodes", [...data.barcodes, {id: Math.floor(Math.random() * 100000000), barcode: "", type: "3"}])
        handleClose()
    }
    const addColumnWew = () => {
        setData("barcodes", [...data.barcodes, {id: Math.floor(Math.random() * 100000000), barcode: "WEW", type: "2"}])
        handleClose()
    }
    const addColumnGS1 = () => {
        setData("barcodes", [...data.barcodes, {id: Math.floor(Math.random() * 100000000), barcode: "GS1", type: "1"}])
        handleClose()
    }
    const handleProcessRowUpdate = (newRow, oldRow) => {
        console.log(newRow)
        if (!isNaN(newRow.barcode) && newRow.barcode.length === 13 && validbarcode(newRow.barcode)) {
            setData("barcodes", data.barcodes.map((row) => (row.id === newRow.id ? newRow : row)))
            return newRow;
        } else {
            enqueueSnackbar("Błędny EAN-13", {variant: 'error'})
        }
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteBarcode = (id) => {
        setData("barcodes", data.barcodes.filter((row) => (row.id !== id)))
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>

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
                        symbol: createSymbol(props?.productModel.symbol, (value ? value.shortcut : ""), data.size?.name)
                    })
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Kolor"
                        sx={{my: 1}}
                        value={data.color}
                        {...register("color")}
                        color={errors.color?.message && "error"}
                    />}
            />
            {errors.color?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                    {errors.color?.message.toString()}
                </Typography>
            )}

            <Autocomplete
                disablePortal
                id="size"
                options={props.sizes.map(e => ({
                    id: e.id,
                    name: e.name,
                    label: e.name
                }))}
                sx={{width: "30ch"}}
                value={data.size}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) => {
                    setData({
                        ...data,
                        size: value,
                        symbol: createSymbol(props?.productModel.symbol, (data.color ? data.color.shortcut : ""), (value ? value.name : ""))
                    })
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Rozmiar"
                        sx={{my: 1}}
                        {...register("size")}
                        value={data.size}
                        color={errors.size?.message && "error"}
                    />
                }
            />
            {errors.size?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                    {errors.size?.message.toString()}
                </Typography>
            )}

            <TextField id="shortcut" label="Symbol" variant="outlined"
                       value={data.symbol}
                       inputProps={{readOnly: true}}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}
            />

            <TextField
                id="name"
                label="Nazwa"
                color={errors.name?.message && "error"}
                {...register("name")}
                onChange={(value) => {
                    setData('name', value.target.value);
                }}
                value={data.name}
                sx={{width: "30ch", my: 1}}
            />
            {errors.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}


            <Autocomplete
                disablePortal
                id="unit"
                options={props.units.map(e => ({
                    id: e.id,
                    name: e.name,
                    label: e.name
                }))}
                sx={{width: "30ch"}}
                value={data.unit}
                isOptionEqualToValue={(option, value) => option.id === value.id}

                onChange={(e, value) => {
                    setData("unit", value)
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Jednostka"
                        sx={{my: 1}}
                        value={data.unit}
                        {...register("unit")}
                        color={errors.unit?.message && "error"}
                    />
                }
            />
            {errors.unit?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                    {errors.unit?.message.toString()}
                </Typography>
            )}

            <Box sx={{position: "relative", width: "30ch"}}>
                <DataGrid apiRef={apiRef}
                          rows={data.barcodes}
                          columns={[{
                              field: 'barcode',
                              type: 'string',
                              flex: 1,
                              align: "left",
                              headerName: "Kody kreskowe",
                              headerAlign: "left",
                              sortable: false,
                              editable: true
                          }, {
                              field: 'actions', type: 'actions', headerName: "", width: 10,
                              getActions: (params) => [
                                  <GridActionsCellItem icon={<Delete/>} onClick={() => deleteBarcode(params.id)}
                                                       label="Delete"/>,
                              ]
                          }]}
                          disableColumnMenu
                          autoHeight={true}
                          hideFooter={true}
                          pageSizeOptions={[100]}
                          editMode={"row"}
                          processRowUpdate={handleProcessRowUpdate}
                          isCellEditable={(params) => params.row.type === 3}
                />
                <Button size="small" onClick={handleClick} sx={{position: "absolute", right: 10, top: 15}}>
                    Dodaj
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={addColumnEmpty}>Pusty</MenuItem>
                    <MenuItem disabled={Boolean(data.barcodes.filter(e => e.type === 2).length)} onClick={addColumnWew}>Wygeneruj
                        wewnętrzny</MenuItem>
                    <MenuItem disabled={true} onClick={addColumnGS1}>Wygeneruj z GS1</MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

function Step2({data, setData, errors}) {
    console.log(data)
    const barcodeValue = () => {
        let barcodes = ""
        for (const barcodeElement of data.barcodes) {
            barcodes += barcodeElement.barcode + "\n"
        }
        return barcodes.trim()
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="color" label="Kolor" variant="outlined"
                       value={data?.color?.label}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>
            <TextField id="size" label="Rozmiar" variant="outlined"
                       value={data?.size?.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>
            <TextField id="shortcut" label="Symbol" variant="outlined"
                       value={data?.symbol}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data?.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="unit" label="Jednostka" variant="outlined"
                       value={data?.unit?.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>


            <TextField id="barcode" label="Kod kreskowy" variant="outlined"
                       value={barcodeValue()}
                       multiline={true}
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
