import {
    Autocomplete,
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select,
    Step,
    StepLabel,
    Stepper, Switch,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {useUserAddForm} from "@/Components/Dialogs/DeliveryDialog/DeliveryAddDialog/form/useUserAddForm";
import {addSchema, editSchema} from "@/Components/Dialogs/DeliveryDialog/DeliveryAddDialog/form/userAddFormSchema";

export default function DeliveryAddDialog({open, setOpen, clickedDelivery}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useUserAddForm(clickedDelivery ? editSchema : addSchema)

    const {data, setData, post, patch, processing, errors, clearErrors, reset, transform} = useForm({
        name: clickedDelivery?.name ? clickedDelivery?.name : '',
        description: clickedDelivery?.description ? clickedDelivery?.description : '',
        subiekt_id: clickedDelivery?.subiekt_id ? clickedDelivery?.subiekt_id : 1,
        price_net: clickedDelivery?.price_net ? clickedDelivery?.price_net : 0,
        price_gross: clickedDelivery?.price_gross ? clickedDelivery?.price_gross : 0,
        free_from: clickedDelivery?.free_from ? clickedDelivery?.free_from : 0,
        active: clickedDelivery?.active ? clickedDelivery?.active : true,
        delivery_time_min: clickedDelivery?.delivery_time_min ? clickedDelivery?.delivery_time_min : 1,
        delivery_time_max: clickedDelivery?.delivery_time_max ? clickedDelivery?.delivery_time_max : 2,
    })


    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
        setValue("description", data.description)
        setValue("subiekt_id", data.subiekt_id)
        setValue("price_net", data.price_net)
        setValue("price_gross", data.price_gross)
        setValue("free_from", data.free_from)
        setValue("active", data.active)
        setValue("delivery_time_min", data.delivery_time_min)
        setValue("delivery_time_max", data.delivery_time_max)
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
        clrErrors("description")
        clrErrors("subiekt_id")
        clrErrors("price_net")
        clrErrors("price_gross")
        clrErrors("free_from")
        clrErrors("active")
        clrErrors("delivery_time_min")
        clrErrors("delivery_time_max")

        setActiveStep(0);

        setOpen(false);
    };

    const save = () => {
        if (!clickedDelivery) {

            post(route("system.settings.delivery.create"),

                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano dostawę", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy zapisywaniu dostawy", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            patch(route("system.settings.delivery.update", {b2bDelivery: clickedDelivery.id}),

                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Zaktualizowano dostawę", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy aktualizacji dostawy", {variant: 'error'})
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
                    {clickedDelivery ? "Edytuj dostawę" : "Dodaj dostawę"}
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

function Step1({register, errors, data, setData}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>

            <TextField
                type="text"
                id="name"
                label="Nazwa"
                color={errors.name?.message && "error"}
                {...register("name")}
                defaultValue={data.name}
                sx={{width: 1, my: 1}}
                onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}

            <TextField
                type="text"
                id="description"
                label="Opis"
                color={errors.name?.message && "error"}
                {...register("description")}
                defaultValue={data.description}
                sx={{width: 1, my: 1}}
                onChange={(e) => setData("description", e.target.value)}
            />
            {errors.description?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.description?.message.toString()}
                </Typography>
            )}

            <TextField
                type="number"
                id="subiekt_id"
                label="Id w Subiekcie"
                color={errors.subiekt_id?.message && "error"}
                {...register("subiekt_id")}
                defaultValue={data.subiekt_id}
                sx={{width: 1, my: 1}}
                onChange={(e) => setData("subiekt_id", e.target.value)}
            />
            {errors.subiekt_id?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.subiekt_id?.message.toString()}
                </Typography>
            )}


            <Box sx={{display: "flex", gap: 2}}>

                <PriceFiled
                    currency={"zł"}
                    price={(data.price_net)}
                    label={"Cena Netto"}
                    setPrice={(price) => {
                        setData(data => ({
                            ...data,
                            price_net: price,
                            price_gross: Number(price * (1 + 23 / 100)).toFixed(),
                        }))
                    }}/>

                <PriceFiled
                    currency={"zł"}
                    price={(data.price_gross)}
                    label={"Cena Brutto"}
                    setPrice={(price) => {
                        setData(data => ({
                            ...data,
                            price_net: Number(price / (1 + 23 / 100)).toFixed(),
                            price_gross: price,
                        }))

                    }}/>

            </Box>
            {errors.price_net?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.price_net?.message.toString()}
                </Typography>
            )}
            {errors.price_gross?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.price_gross?.message.toString()}
                </Typography>
            )}
            <PriceFiled
                currency={"zł"}
                price={(data.free_from)}
                label={"Darmowa wysyłka od (Netto)"}
                setPrice={(price) => {
                    setData(data => ({
                        ...data,
                        free_from: price,
                    }))

                }}/>
            {errors.free_from?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.free_from?.message.toString()}
                </Typography>
            )}

            <Box sx={{display: "flex", gap: 2}}>
                <TextField
                    type="number"
                    id="delivery_time_min"
                    label="Min. czas dostawy"
                    color={errors.delivery_time_min?.message && "error"}
                    {...register("delivery_time_min")}
                    defaultValue={data.delivery_time_min}
                    sx={{width: 1, my: 1}}
                    onChange={(e) => setData("delivery_time_min", e.target.value)}
                    inputProps={{min: 1, max: data.delivery_time_max}}
                />
                <TextField
                    type="number"
                    id="delivery_time_max"
                    label="Max. czas dostawy"
                    color={errors.delivery_time_max?.message && "error"}
                    {...register("delivery_time_max")}
                    defaultValue={data.delivery_time_max}
                    sx={{width: 1, my: 1}}
                    onChange={(e) => setData("delivery_time_max", e.target.value)}
                    inputProps={{min: data.delivery_time_min, max: 99}}
                />

            </Box>
            {errors.delivery_time_min?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.delivery_time_min?.message.toString()}
                </Typography>
            )}
            {errors.delivery_time_max?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.delivery_time_max?.message.toString()}
                </Typography>
            )}

            Aktywność:

            <Switch color={"secondary"} checked={Boolean(data.active)} onChange={(e, value) => {
                setData("active", value)
                console.log(data)
            }}/>
        </Box>
    );
}

function Step2({data, errors}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: 1, my: 1}}/>

            <TextField id="description" label="Opis" variant="outlined"
                       value={data.description}
                       disabled={true}
                       sx={{width: 1, my: 1}}/>

            <TextField id="subiekt_id" label="Id w Subiekcie" variant="outlined"
                       value={data.subiekt_id}
                       disabled={true}
                       sx={{width: 1, my: 1}}/>

            <Box sx={{display: "flex", gap: 2}}>

                <PriceFiled
                    currency={"zł"}
                    price={(data.price_net)}
                    label={"Cena Netto"}
                    disabled={true}
                />

                <PriceFiled
                    currency={"zł"}
                    price={(data.price_gross)}
                    label={"Cena Brutto"}
                    disabled={true}
                />

            </Box>

            <PriceFiled
                currency={"zł"}
                price={(data.free_from)}
                label={"Darmowa wysyłka od (Netto)"}
                disabled={true}/>

            <Box sx={{display: "flex", gap: 2}}>
                <TextField id="delivery_time_min" label="Min. czas dostawy" variant="outlined"
                           value={data.delivery_time_min}
                           disabled={true}
                           sx={{width: 1, my: 1}}/>

                <TextField id="delivery_time_max" label="Max. czas dostawy" variant="outlined"
                           value={data.delivery_time_max}
                           disabled={true}
                           sx={{width: 1, my: 1}}/>


            </Box>
            Aktywność:

            <Switch color={"secondary"} disabled={true} checked={Boolean(data.active)} onChange={(e, value) => {
                setData("active", value)
            }}/>
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

function PriceFiled({price, setPrice, currency, label, disabled = false}) {
    let newPrice = numberPrice(price)

    const onKeyPress = (event) => {
        const regex = /^[0-9\b]+$/;

        const key = event.key;
        const keyCode = event.keyCode;

        let oldValue = event.target.defaultValue.replace(/,/g, "").replace(/\./g, "");
        let value = "";

        if (regex.test(key)) {
            value = "" + oldValue + key
            setPrice(value)
        } else if (keyCode === 8) {
            value = oldValue.slice(0, -1)
            setPrice(value)
        }
    }


    function numberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2, useGrouping: false}));
    }

    return (
        <FormControl sx={{m: 0, width: 1, my: 1}} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-weight">{label}</InputLabel>
            <OutlinedInput
                id="outlined-adornment-weight"
                label={label}
                endAdornment={<InputAdornment
                    position="end">{currency}</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                onKeyDown={onKeyPress}
                value={newPrice}

                disabled={disabled}
            />
        </FormControl>
    );
}
