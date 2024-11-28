import {
    Box, Button, CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Divider, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect, useCallback} from "react";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {useClientFindGusForm} from "@/Components/Dialogs/ClientDialog/ClientFindGusDialog/form/useClientFindGusForm";
import {enqueueSnackbar} from "notistack";

export default function ClientFindGusDialog({
                                                open,
                                                setOpen,
                                                nip,
                                                props,
                                            }) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientFindGusForm();


    const {data, setData, post, processing, errors} = useForm({
        name: null,
        city: null,
        postal_code: null,
        street: null,
        building_number: null,
        apartment_number: null,
        email: null,
    })

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (!dataLoaded && open) {
            getGUSdata()
        }
    }, [open]);


    const getGUSdata = () => {
        axios.get(route('system.clients.findGus', {nip: nip}),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        )
            .then(response => {
                console.log(response.data);
                setData(response.data)
                setDataLoaded(true);
                setValue("name", response.data.name ? response.data.name : "")
                setValue("city", response.data.city ? response.data.city : "")
                setValue("postal_code", response.data.postal_code ? response.data.postal_code : "")
                setValue("street", response.data.street ? response.data.street : "")
                setValue("building_number", response.data.building_number ? response.data.building_number : "")
                setValue("apartment_number", response.data.apartment_number ? response.data.apartment_number : "")
                setValue("email", response.data.email ? response.data.email : "")
            })
            .catch(error => {
                enqueueSnackbar("Błąd przy pobieraniu danych z GUS", {variant: 'error'})
                console.error(error)
            });

    }
    const onSubmit = (data, e) => {
        e.preventDefault();
        save()
    }
    const onError = (data, e) => {
        e.preventDefault();
        console.error("Błędne dane", data)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        post(route("system.clients.client.update.basic.gus", {client: props.client.id}), {
            onSuccess: params => {
                enqueueSnackbar("Zapisano Podstawowe informację", {variant: 'success'})
                router.reload()
                setOpen(false);
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu podstawowych informacji", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
            // fullWidth
            maxWidth="lg"

        >

            <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="off">

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    {"Uzupełnij dane adresowe z GUS"}
                </DialogTitle>
                <DialogContent>
                    <GusTable data={data} setData={setData} setValue={setValue}
                              props={props}
                              fieldErrors={fieldErrors} errors={errors}
                              dataLoaded={dataLoaded}
                              register={register}/>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Zamknij
                    </Button>

                    <Button type="submit" disabled={processing}>
                        Zapisz
                    </Button>
                </DialogActions>

            </form>
        </Dialog>

    );
}


function GusTable({data, setData, setValue, props, fieldErrors, errors, dataLoaded, register}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Box sx={{display: "flex", gap: 2}}>
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <Typography variant="h6">
                        Dane klienta
                    </Typography>

                    <TextField id="name1" label="Nazwa" variant="outlined"
                               value={props.client.name}
                               disabled={true}
                               multiline={true}
                               sx={{width: "58ch", my: 1}}/>


                    <Box sx={{display: "flex", gap: 2}}>
                        <TextField id="street1" label="Ulica" variant="outlined"
                                   value={props.client.street}
                                   disabled={true}

                                   sx={{width: "30ch", my: 1}}/>
                        <TextField id="buildingNumber1" label="Numer budynku" variant="outlined"
                                   value={props.client.building_number}
                                   disabled={true}
                                   sx={{width: "12ch", my: 1}}/>
                        <TextField id="apartmentNumber1" label="Numer lokalu" variant="outlined"
                                   value={props.client.apartment_number}
                                   disabled={true}
                                   sx={{width: "12ch", my: 1}}/>
                    </Box>
                    <Box sx={{display: "flex", gap: 2}}>
                        <TextField id="postalCode1" label="Kod pocztowy" variant="outlined"
                                   value={props.client.postal_code}
                                   disabled={true}
                                   sx={{width: "15ch", my: 1}}/>
                        <TextField id="city1" label="Miasto" variant="outlined"
                                   value={props.client.city}
                                   disabled={true}
                                   sx={{width: "41ch", my: 1}}/>
                    </Box>

                    <TextField id="email1" label="Email" variant="outlined"
                               value={props.client.email}
                               disabled={true}
                               sx={{width: "58ch", my: 1}}/>


                </Box>
                <Divider orientation="vertical" flexItem/>
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <Typography variant="h6">
                        Dane GUS
                    </Typography>

                    <TextField id="name2" label="Nazwa" variant="outlined"
                               multiline={true}
                               InputProps={{
                                   startAdornment: !dataLoaded && (
                                       <CircularProgress color="inherit" size={20}/>
                                   ),
                               }}
                               sx={{width: "58ch", my: 1}}
                               value={data.name ? data.name : ""}
                               {...register("name")}
                               onChange={(e) => {
                                   setData("name", e.target.value)
                                   setValue("name", e.target.value)
                               }}
                    />
                    {fieldErrors.name?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {fieldErrors.name?.message.toString()}
                        </Typography>
                    )}


                    <Box sx={{display: "flex", gap: 2}}>
                        <Box>
                            <TextField id="street2" label="Ulica" variant="outlined"
                                       InputProps={{
                                           startAdornment: !dataLoaded && (
                                               <CircularProgress color="inherit" size={20}/>
                                           ),
                                       }}
                                       sx={{width: "30ch", my: 1}}
                                       value={data.street ? data.street : ""}
                                       {...register("street")}
                                       onChange={(e) => {
                                           setData("street", e.target.value)
                                           setValue("street", e.target.value)
                                       }}
                            />
                            {fieldErrors.street?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.street?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                        <Box>
                            <TextField id="buildingNumber2" label="Numer budynku" variant="outlined"
                                       InputProps={{
                                           startAdornment: !dataLoaded && (
                                               <CircularProgress color="inherit" size={20}/>
                                           ),
                                       }}
                                       sx={{width: "12ch", my: 1}}
                                       value={data.building_number ? data.building_number : ""}
                                       {...register("building_number")}
                                       onChange={(e) => {
                                           setData("building_number", e.target.value)
                                           setValue("building_number", e.target.value)
                                       }}
                            />
                            {fieldErrors.building_number?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.building_number?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                        <Box>
                            <TextField id="apartmentNumber2" label="Numer lokalu" variant="outlined"
                                       InputProps={{
                                           startAdornment: !dataLoaded && (
                                               <CircularProgress color="inherit" size={20}/>
                                           ),
                                       }}
                                       sx={{width: "12ch", my: 1}}
                                       value={data.apartment_number ? data.apartment_number : ""}
                                       {...register("apartment_number")}
                                       onChange={(e) => {
                                           setData("apartment_number", e.target.value)
                                           setValue("apartment_number", e.target.value)
                                       }}
                            />
                            {fieldErrors.apartment_number?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.apartment_number?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", gap: 2}}>
                        <Box>
                            <TextField id="postalCode2" label="Kod pocztowy" variant="outlined"
                                       InputProps={{
                                           startAdornment: !dataLoaded && (
                                               <CircularProgress color="inherit" size={20}/>
                                           ),
                                       }}
                                       sx={{width: "15ch", my: 1}}
                                       value={data.postal_code ? data.postal_code : ""}
                                       {...register("postal_code")}
                                       onChange={(e) => {
                                           setData("postal_code", e.target.value)
                                           setValue("postal_code", e.target.value)
                                       }}
                            />
                            {fieldErrors.postal_code?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.postal_code?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                        <Box>
                            <TextField id="city2" label="Miasto" variant="outlined"
                                       InputProps={{
                                           startAdornment: !dataLoaded && (
                                               <CircularProgress color="inherit" size={20}/>
                                           ),
                                       }}
                                       sx={{width: "41ch", my: 1}}
                                       value={data.city ? data.city : ""}
                                       {...register("city")}
                                       onChange={(e) => {
                                           setData("city", e.target.value)
                                           setValue("city", e.target.value)
                                       }}
                            />
                            {fieldErrors.city?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.city?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <TextField id="email2" label="Email" variant="outlined"
                               InputProps={{
                                   startAdornment: !dataLoaded && (
                                       <CircularProgress color="inherit" size={20}/>
                                   ),
                               }}
                               sx={{width: "58ch", my: 1}}
                               value={data.email ? data.email : ""}
                               {...register("email")}
                               onChange={(e) => {
                                   setData("email", e.target.value)
                                   setValue("email", e.target.value)
                               }}
                    />
                    {fieldErrors.email?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {fieldErrors.email?.message.toString()}
                        </Typography>
                    )}

                </Box>
            </Box>

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

