import {
    Autocomplete,
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {
    useClientPaymentsDiscountsDialogForm
} from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditPaymentsDiscountsDialog/form/useClientPaymentsDiscountsDialogForm";
import {enqueueSnackbar} from "notistack";
import moment from "moment/moment";

export default function ClientAddEditPaymentsDiscountsDialog({
                                                                 open,
                                                                 setOpen,
                                                                 clickedDiscount,
                                                                 params,
                                                             }) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientPaymentsDiscountsDialogForm();


    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        discount: clickedDiscount ? clickedDiscount.discount.discount : false,
        discount_value: clickedDiscount ? clickedDiscount.discount.discount_value : 0,
    })
    const [checked, setChecked] = useState(clickedDiscount ? (clickedDiscount.discount.discount !== 0) : false);

    useEffect(() => {
        // console.log("Clicked user w useEffect: ", clickedUser);

        // inicjacja wartości pól
        // setValue('discount', clickedDiscount ? clickedDiscount.discount.discount : 1);
        setValue('discount_value', clickedDiscount ? clickedDiscount.discount.discount_value : 0);

        setData({
            discount: clickedDiscount ? clickedDiscount.discount.discount : false,
            discount_value: clickedDiscount ? clickedDiscount.discount.discount_value : 0,
        })

        // setCurrentSchema()
    }, [setValue, clickedDiscount]);

    const onSubmit = (submitData) => {
        console.log("Dane z submit: ", submitData)
        console.log("Dane z InertiaJS: ", data)

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
        clearErrors()
        // clrErrors("discount")
        clrErrors("discount_value")

        // setClickedUser(null)

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        if (clickedDiscount) {
            patch(route("system.clients.client.payment.discount.update", {
                    client: params.client.id,
                    b2bPayment: clickedDiscount.id
                }),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano rabat", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy edycji rabatu", {variant: 'error'})
                        console.error(errors)
                    },
                })
        }

    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                scroll="paper"
            >
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                        {clickedDiscount ? "Edytuj rabat klienta" : "Dodaj rabat klienta"}
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
                                clickedDiscount={clickedDiscount}
                                register={register}
                                errors={fieldErrors}
                                params={params}
                                setValue={setValue}
                                checked={checked}
                                setChecked={setChecked}
                            /> : null}
                        {activeStep === 1 ?
                            <Step2 data={data} setData={setData} errors={errors} clickedDiscount={clickedDiscount}
                                   checked={checked}/> : null}

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
        </>
    );
}

function Step1({data, setData, params, clickedDiscount = null, register, errors, checked, setChecked}) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <Box>


                <Typography variant="h6" gutterBottom component="h6">
                    {clickedDiscount.name}
                </Typography>
            </Box>
            <Box>
                <FormControl
                    sx={{width: "30ch", display: "flex", flexDirection: "column", alignItems: 'center', mb: 2}}
                >
                    <FormControlLabel
                        label={<Typography>Aktywność</Typography>}
                        control={
                            <Checkbox
                                id="blacklist-select"
                                label="Aktywna"
                                size={"large"}
                                checked={checked}
                                onChange={(value) => {
                                    // setProductModel({...productModel, product_group_id: value.target.value});
                                    setChecked(value.target.checked)
                                    setData("discount", value.target.checked ? 1 : 0)
                                }}
                            />
                        }
                    />
                </FormControl>
                {errors.discount?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.discount?.message.toString()}
                    </Typography>
                )}
            </Box>
            <Box>
                <TextField
                    type="number"
                    id="value"
                    label="Wartość rabatu"
                    color={errors.discount_value?.message && "error"}
                    {...register("discount_value")}
                    onChange={(value) => {
                        setData('discount_value', value.target.value);
                    }}
                    defaultValue={0}
                    value={data.discount_value}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.discount_value?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.discount_value?.message.toString()}
                    </Typography>
                )}
            </Box>

        </Box>
    );
}

function Step2({data, params, errors, clickedDiscount, checked}) {


    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <Box>


                <Typography variant="h6" gutterBottom component="h6">
                    {clickedDiscount.name}
                </Typography>
            </Box>
            <FormControl
                sx={{width: "30ch", display: "flex", flexDirection: "column", alignItems: 'center', mb: 2}}
            >
                <FormControlLabel
                    label={<Typography>Aktywność</Typography>}
                    control={
                        <Checkbox
                            id="blacklist-select"
                            label="Aktywna"
                            size={"large"}
                            checked={checked}
                            disabled={true}
                        />
                    }
                />
            </FormControl>
            <TextField id="value" label="Wartość rabatu" variant="outlined"
                       value={data.discount_value}
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

