import {
    Autocomplete,
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select,
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
    useModelLocationAddForm
} from "@/Components/Dialogs/ModelWarehouseLocationDialog/ModelWarehouseLocationAddDialog/form/useModelLocationAddForm";

export default function AddModelLocationDialog({open, setOpen, locations, productModel_id}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useModelLocationAddForm()

    const {data, setData, post, processing, errors, clearErrors, reset, transform} = useForm({
        room_id: null,
        aisle_id: null,
        shelf_id: null,
    })
    // console.log("data", data)

    // transform((data) => ({
    //     ...data,
    //     destination_id: data.destination_id ? data.destination_id.split('-')[1] : null,
    // }))

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
        setActiveStep(0);
        setOpen(false);
    };


    const save = () => {
        post(route("system.products.model.warehouse.create", {productModel: productModel_id}),
            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar('Dodano lokalizację', {variant: 'success'});
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar('Błąd przy dodawaniu lokalizacji', {variant: 'error'});
                    console.error(errors);
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
                    Dodawanie lokalizacji do modelu
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
                            fieldErrors={fieldErrors}
                            data={data}
                            setData={setData}
                            setValue={setValue}
                            locations={locations}
                        />
                        : null}
                    {activeStep === 1 ?
                        <Step2 data={data} setData={setData} errors={errors} locations={locations}/> : null}

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

function Step1({register, fieldErrors, data, setData, setValue, locations}) {
    const rooms = locations?.rooms ?? [];
    const aislesAll = locations?.aisles ?? [];
    const shelvesAll = locations?.locations ?? [];

    const selectedRoom = rooms.find(r => r.id === data.room_id) || null;
    const filteredAisles = aislesAll.filter(a => a.warehouse_location_room_id === data.room_id);
    const selectedAisle = filteredAisles.find(a => a.id === data.aisle_id) || null;
    const filteredShelves = shelvesAll.filter(s => s.warehouse_location_aisle_id === data.aisle_id);
    const selectedShelf = filteredShelves.find(s => s.id === data.shelf_id) || null;


    return (
        <Box sx={{display: "flex", flexDirection: "column", width: "30ch"}}>
            <Autocomplete
                options={rooms}
                value={selectedRoom}
                getOptionLabel={(option) => option?.name ?? ""}
                onChange={(_, value) => {
                    setData("room_id", value?.id ?? null);
                    setValue("room_id", value?.id ?? null, {shouldValidate: true});
                    // wyczyszczenie zależnych pól
                    setData("aisle_id", null);
                    setData("shelf_id", null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Pokój"
                        error={!!fieldErrors?.room_id}
                        helperText={fieldErrors?.room_id?.message?.toString?.() ?? ""}
                    />
                )}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                sx={{width: "30ch", my: 1}}
            />

            <Autocomplete
                options={filteredAisles}
                value={selectedAisle}
                getOptionLabel={(option) => option?.name ?? ""}
                onChange={(_, value) => {
                    setData("aisle_id", value?.id ?? null);
                    setValue("aisle_id", value?.id ?? null, {shouldValidate: true});
                    // wyczyszczenie niższego poziomu
                    setData("shelf_id", null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Aleja"
                        error={!!fieldErrors?.aisle_id}
                        helperText={fieldErrors?.aisle_id?.message?.toString?.() ?? ""}
                    />
                )}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                disabled={!data.room_id}
                sx={{width: "30ch", my: 1}}
            />

            <Autocomplete
                options={filteredShelves}
                value={selectedShelf}
                getOptionLabel={(option) => option?.name ?? ""}
                onChange={(_, value) => {
                    setData("shelf_id", value?.id ?? null);
                    setValue("shelf_id", value?.id ?? null, {shouldValidate: true});
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Regał"
                        error={!!fieldErrors?.shelf_id}
                        helperText={fieldErrors?.shelf_id?.message?.toString?.() ?? ""}
                    />
                )}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                disabled={!data.aisle_id}
                sx={{width: "30ch", my: 1}}
            />

        </Box>


    );
}

function Step2({data, errors, locations}) {
    const rooms = locations?.rooms ?? [];
    const aisles = locations?.aisles ?? [];
    const shelves = locations?.locations ?? [];

    const roomName = rooms.find(r => r.id === data.room_id)?.name ?? '';
    const aisleName = aisles.find(a => a.id === data.aisle_id)?.name ?? '';
    const shelfName = shelves.find(s => s.id === data.shelf_id)?.name ?? '';


    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="room" label="Pokój" variant="outlined"
                       value={roomName}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}
            />

            <TextField id="aisle" label="Aleja" variant="outlined"
                       value={aisleName}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}
            />

            <TextField id="shelf" label="Regał" variant="outlined"
                       value={shelfName}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}
            />


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

