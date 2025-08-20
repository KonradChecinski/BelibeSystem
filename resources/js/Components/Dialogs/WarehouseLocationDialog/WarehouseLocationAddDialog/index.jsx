import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select,
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
    useLocationAddForm
} from "@/Components/Dialogs/WarehouseLocationDialog/WarehouseLocationAddDialog/form/useLocationAddForm";

export default function AddLocationDialog({open, setOpen, locations}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useLocationAddForm()

    const {data, setData, post, processing, errors, clearErrors, reset, transform} = useForm({
        type: "room",
        destination_id: null,
        name: "",
    })
    // console.log("data", data)

    transform((data) => ({
        ...data,
        destination_id: data.destination_id ? data.destination_id.split('-')[1] : null,
    }))

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


    const path = () => {
        switch (data.type) {
            case "room":
                return "system.settings.warehouseLocation.room.create";
            case "aisle":
                return "system.settings.warehouseLocation.aisle.create";
            case "shelf":
                return "system.settings.warehouseLocation.shelf.create";
        }
    }


    const getDestinationOptions = () => {
        if (data.type === "aisle") {
            return locations.map(room => ({
                id: room.id,
                name: room.name
            }));
        } else if (data.type === "shelf") {
            return locations.flatMap(room =>
                room.children?.map(aisle => ({
                    id: aisle.id,
                    name: aisle.name
                })) || []
            );
        }
        return [];
    };

    const save = () => {
        post(route(path()),
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
                    Dodawanie lokalizacji
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
                            getDestinationOptions={getDestinationOptions}
                        />
                        : null}
                    {activeStep === 1 ? <Step2 data={data} setData={setData} errors={errors}
                                               getDestinationOptions={getDestinationOptions}/> : null}

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

function Step1({register, fieldErrors, data, setData, getDestinationOptions}) {
    console.log(fieldErrors)
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>

            <Box sx={{height: "auto", display: "flex", flexDirection: "column", gap: 1}}>
                <FormControl fullWidth sx={{width: "30ch", my: 1}}>
                    <InputLabel id="type-label">Wybierz typ</InputLabel>
                    <Select
                        labelId="type-label"
                        id="type"
                        variant={"outlined"}
                        label={"Wybierz typ"}
                        value={data.type}
                        {...register("type")}
                        onChange={(e) => {

                            setData("type", e.target.value)
                        }
                        }
                    >
                        <MenuItem value="room">Pokój</MenuItem>
                        <MenuItem value="aisle">Aleja</MenuItem>
                        <MenuItem value="shelf">Regał</MenuItem>
                    </Select>
                </FormControl>
                {fieldErrors?.type?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {fieldErrors?.type?.message.toString()}
                    </Typography>
                )}
            </Box>

            {data.type !== "room" && (
                <Box>
                    <FormControl fullWidth sx={{width: "30ch", my: 1}}>
                        <InputLabel id="destination-label">Wybierz miejsce docelowe</InputLabel>
                        <Select
                            labelId="destination-label"
                            id="destination"
                            variant={"outlined"}
                            label={"Wybierz miejsce docelowe"}
                            value={data.destination_id}
                            {...register("destination_id")}
                            onChange={(e) => setData("destination_id", e.target.value)}
                        >
                            {getDestinationOptions().map(room => (
                                <MenuItem key={room.id} value={room.id}>
                                    {room.name}
                                </MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    {fieldErrors?.destination_id?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {fieldErrors?.destination_id?.message.toString()}
                        </Typography>
                    )}
                </Box>
            )}

            <TextField
                type="text"
                id="name"
                label="Nazwa"
                color={fieldErrors?.name?.message && "error"}
                {...register("name")}
                defaultValue={data.name}
                sx={{width: "30ch", my: 1}}
            />
            {fieldErrors?.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {fieldErrors?.name?.message.toString()}
                </Typography>
            )}
        </Box>
    );
}

function Step2({data, errors, getDestinationOptions}) {
    let typeValue = "";
    switch (data.type) {
        case "room":
            typeValue = "Pokój";
            break;
        case "aisle":
            typeValue = "Aleja";
            break;
        case "shelf":
            typeValue = "Regał";
            break;
    }


    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>


            <TextField id="type" label="Typ" variant="outlined"
                       value={typeValue}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            {data.destination_id && (
                <TextField id="destination" label="Miejsce docelowe" variant="outlined"
                           value={getDestinationOptions().find(location => location.id === data.destination_id)?.name || ""}
                           disabled={true}

                           sx={{width: "30ch", my: 1}}/>
            )}

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

