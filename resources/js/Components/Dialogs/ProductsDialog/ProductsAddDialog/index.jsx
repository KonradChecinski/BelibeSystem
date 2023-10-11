import {
    Autocomplete, Avatar,
    Box, Button, Dialog, DialogActions,
    DialogContent,
    DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {DataGrid, GridActionsCellItem, useGridApiRef} from "@mui/x-data-grid";
import validbarcode from "barcode-validator";
import ReactDraggable from "react-draggable";
import {Delete, DragIndicator} from "@mui/icons-material";
import {useProductsAddForm} from "@/Components/Dialogs/ProductsDialog/ProductsAddDialog/form/useProductsAddForm";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

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
            // scroll="paper"
            sx={{
                overflowX: "hidden",
                overflowY: "hidden"
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    {method === 'create' || method === "copy" ? "Dodawanie produktu" : "Edycja produktu"}
                </DialogTitle>
                <DialogContent sx={{
                    overflowX: "hidden",
                    overflowY: "hidden"
                }}>
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
                    <Button onClick={handleClose}>
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

function InboxIcon() {
    return null;
}

function Step1({data, setData, props, register, errors}) {
    const apiRef = useGridApiRef();
    const addColumnEmpty = () => {
        setData("barcodes", [...data.barcodes, {id: Math.floor(Math.random() * 100000000), barcode: "", type: 3}])
        handleClose()
    }
    const addColumnWew = () => {
        setData("barcodes", [...data.barcodes, {
            id: Math.floor(Math.random() * 100000000),
            barcode: "Wygeneruj",
            type: 2
        }])
        handleClose()
    }
    const addColumnGS1 = () => {
        setData("barcodes", [...data.barcodes, {
            id: Math.floor(Math.random() * 100000000),
            barcode: "Wygeneruj",
            type: 1
        }])
        handleClose()
    }
    const handleEndChangeBarcode = (e, id) => {
        if (!isNaN(e.target.value) && e.target.value.length === 13 && validbarcode(e.target.value)) {

        } else {
            setData("barcodes", data.barcodes.filter((row) => (row.id !== id)))
            enqueueSnackbar("Błędny EAN-13", {variant: 'error'})
        }
    }

    const handleChangeBarcode = (e, id) => {
        if (!isNaN(e.target.value) && e.target.value.length <= 13) {


            if (e.target.value.length < 13) {
                let newRow = data.barcodes.find((row) => (row.id === id))
                newRow.barcode = e.target.value;
                setData("barcodes", data.barcodes.map((row) => (row.id === id ? newRow : row)))
            }
            if (e.target.value.length === 13) {
                let newRow = data.barcodes.find((row) => (row.id === id))
                newRow.barcode = e.target.value;
                setData("barcodes", data.barcodes.map((row) => (row.id === id ? newRow : row)))

                if (validbarcode(e.target.value)) {
                    e.target.blur();
                } else {
                    enqueueSnackbar("Błędny EAN-13", {variant: 'error'})
                }
            }
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

    const onDragEnd = (e) => {
        if (!e.destination) return;
        if (e.source.droppableId === e.destination.droppableId && e.source.index === e.destination.index) return;

        const newBarcodesArray = [...data.barcodes]


        const barcodeShortcut = e.draggableId.split("_")[0]
        const barcodeType = e.draggableId.split("_")[1]

        //Source
        const sourceIndex = e.source.index

        //Destination
        const destinationIndex = e.destination.index

        const dropElement = newBarcodesArray.splice(sourceIndex, 1)[0]
        newBarcodesArray.splice(destinationIndex, 0, dropElement)
        setData("barcodes", newBarcodesArray)
    };

    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden"
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
                {/*<DataGrid apiRef={apiRef}*/}
                {/*          rows={data.barcodes}*/}
                {/*          columns={[{*/}
                {/*              field: 'barcode',*/}
                {/*              type: 'string',*/}
                {/*              flex: 1,*/}
                {/*              align: "left",*/}
                {/*              headerName: "Kody kreskowe",*/}
                {/*              headerAlign: "left",*/}
                {/*              sortable: false,*/}
                {/*              editable: true*/}
                {/*          }, {*/}
                {/*              field: 'actions', type: 'actions', headerName: "", width: 10,*/}
                {/*              getActions: (params) => [*/}
                {/*                  <GridActionsCellItem icon={<Delete/>} onClick={() => deleteBarcode(params.id)}*/}
                {/*                                       label="Delete"/>,*/}
                {/*              ]*/}
                {/*          }]}*/}
                {/*          disableColumnMenu*/}
                {/*          autoHeight={true}*/}
                {/*          hideFooter={true}*/}
                {/*          pageSizeOptions={[100]}*/}
                {/*          editMode={"row"}*/}
                {/*          processRowUpdate={handleProcessRowUpdate}*/}
                {/*          isCellEditable={(params) => params.row.type === 3}*/}
                {/*/>*/}
                <Box sx={{
                    border: 1,
                    borderRadius: 1,
                    borderColor: "field.border",
                    width: "30ch"
                }}>
                    <Box sx={{
                        height: 50,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 1,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        p: "10px",
                    }}>
                        <Typography variant="body2" component="h5">
                            Kody kreskowe
                        </Typography>
                        <Button size="small" onClick={handleClick}>
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
                            <MenuItem onClick={addColumnEmpty}>Zewnętrzny / Ręczny</MenuItem>
                            <MenuItem disabled={Boolean(data.barcodes.filter(e => e.type === 2).length)}
                                      onClick={addColumnWew}>Wygeneruj wewnętrzny</MenuItem>
                            <MenuItem disabled={Boolean(data.barcodes.filter(e => e.type === 1).length)}
                                      onClick={addColumnGS1}>Wygeneruj z GS1</MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{
                        minHeight: 50,
                        bgcolor: "barcodes.background",
                        borderRadius: 1,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        width: "30ch",
                        overflow: "hidden"
                    }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="barcodes">
                                {provided => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            width: "30ch",

                                        }}
                                    >
                                        <List>
                                            {data.barcodes.map((item, index) => (
                                                <Draggable
                                                    draggableId={"barcode_" + item.id}
                                                    index={index}
                                                    key={item.id}
                                                    sx={{height: "50px"}}
                                                >


                                                    {(provided, snapshot) => {
                                                        let secondText = "Typ: "

                                                        switch (item.type) {
                                                            case 1:
                                                                secondText += "GS1"
                                                                break;
                                                            case 2:
                                                                secondText += "Wewnętrzny"
                                                                break;
                                                        }

                                                        return (
                                                            <>
                                                                <ListItem
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        top: "auto !important",
                                                                        left: "auto !important",
                                                                        bgcolor: snapshot.isDragging ? "rgba(0,0,0,0.3)" : ""
                                                                    }}
                                                                    secondaryAction={
                                                                        <IconButton edge="end" aria-label="delete"
                                                                                    onClick={() => deleteBarcode(item.id)}>
                                                                            <Delete/>
                                                                        </IconButton>
                                                                    }
                                                                >

                                                                    <ListItemIcon>
                                                                        <DragIndicator/>
                                                                    </ListItemIcon>
                                                                    {item.type !== 3 ?
                                                                        <ListItemText primary={item.barcode}
                                                                                      secondary={secondText}/>

                                                                        :
                                                                        <TextField id="outlined-barcode"
                                                                                   label="Kod kreskowy"
                                                                                   variant="standard"
                                                                                   onBlur={(e) => handleEndChangeBarcode(e, item.id)}
                                                                                   value={item.barcode}
                                                                                   onChange={(e) => handleChangeBarcode(e, item.id)}
                                                                                   color={validbarcode(item.barcode) ? "success" : "error"}
                                                                        />


                                                                    }


                                                                </ListItem>
                                                                <Divider variant="inset" component="li"/></>
                                                        )
                                                    }

                                                    }

                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </List>
                                    </Box>

                                )}

                            </Droppable>
                        </DragDropContext>
                    </Box>
                </Box>

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
        <ReactDraggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} sx={{
                overflowX: "hidden",
            }}/>
        </ReactDraggable>
    );
}

const createSymbol = (modelSymbol = '', colorId = '', size = '') => {
    return modelSymbol + "-" + colorId + "-" + size
}
