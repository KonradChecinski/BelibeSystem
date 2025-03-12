import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect, useRef} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {PriceFiled} from "@/Components/Components/PriceFiled";
import {
    usePartnerSettlementItemEditForm
} from "@/Components/Dialogs/PartnersDialog/PartnersSettlementItemEditDialog/form/usePartnerSettlementItemEditForm";

export default function PartnersSettlementItemEditDialog({
                                                             partnerId,
                                                             partnerSettlementId,
                                                             partnerSettlementDocumentId,
                                                             partnerSettlementItemId,
                                                             open,
                                                             setOpen,
                                                             price_net_original,
                                                             price_net_computed,
                                                             price_net_final
                                                         }) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
        control
    } = usePartnerSettlementItemEditForm()


    const {data, setData, post, processing, reset} = useForm({
        price: price_net_final,
    })


    useEffect(() => {
        // inicjacja wartości pól
        setValue("price", data.price)

    }, [setValue]);


    const onSubmit = (data) => {
        console.log(data)
        setData(data)
        setActiveStep(activeStep + 1)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];


    const previousStep = () => {
        setActiveStep(activeStep - 1);
    }

    const handleClose = () => {
        setValue("price", null);
        clrErrors("price");

        setActiveStep(0);

        setOpen(false);
    };

    const save = () => {
        post(route("system.partners.partner.settlements.item.update",
                {
                    partner: partnerId,
                    partnerSettlement: partnerSettlementId,
                    partnerSettlementDocument: partnerSettlementDocumentId,
                    partnerSettlementItem: partnerSettlementItemId
                }
            ),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Edytowano produkt", {variant: 'success'})
                    handleClose();
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy edycji produktu", {variant: 'error'})
                    for (const errorsKey in errors) {
                        enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                    }
                },
            })
    }

    const [disabled, setDisabled] = useState(true);
    const [priceType, setPriceType] = useState(2);

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
            // fullWidth={true}
            // maxWidth="md"

        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Edycja ceny produktu
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
                            setValue={setValue}
                            register={register}
                            errors={fieldErrors}
                            control={control}
                            price_net_original={price_net_original}
                            price_net_computed={price_net_computed}
                            disabled={disabled}
                            setDisabled={setDisabled}
                            priceType={priceType}
                            setPriceType={setPriceType}
                        /> : null}
                    {activeStep === 1 ? <Step2 data={data} setData={setData}/> : null}

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

function Step1({
                   data,
                   setData,
                   setValue,
                   register,
                   errors,
                   control,
                   price_net_original,
                   price_net_computed,
                   disabled,
                   setDisabled,
                   priceType,
                   setPriceType
               }) {
    const onChange = (e) => {
        const value = Number(e.target.value); // 1, 2, 0
        if ([1, 2].includes(value)) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }

        switch (value) {
            case 1:
                setData("price", price_net_original);
                setValue("price", price_net_original);
                break;
            case 2:
                setData("price", price_net_computed);
                setValue("price", price_net_computed);
                break;
            case 0:
                break;
            default:
                setData("price", null);
        }

        setPriceType(value);
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <Box>

                <FormControl component="fieldset">
                    <FormLabel component="legend">Wybierz rodzaj ceny</FormLabel>
                    <RadioGroup
                        aria-label="price_type"
                        name="radio-buttons-group"
                        value={priceType}
                        onChange={onChange}
                    >
                        <FormControlLabel
                            value={1}
                            control={<Radio/>}
                            label="Netto podana"
                        />
                        <FormControlLabel
                            value={2}
                            control={<Radio/>}
                            label="Netto wyliczona"
                        />
                        <FormControlLabel
                            value={0}
                            control={<Radio/>}
                            label="Inna"
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
            <PriceFiled
                price={data.price}
                setPrice={(value) => {
                    setData("price", value)
                    setValue("price", value)
                }}
                currency={"PLN"}
                {...register("price")}
                color={errors.name?.message && "error"}
                sx={{width: "30ch", my: 1}}
                disabled={disabled}
            />
            {errors.price?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.price?.message.toString()}
                </Typography>
            )}


        </Box>


    );
}

function Step2({data}) {

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>

            <PriceFiled
                price={data.price}
                currency={"PLN"}
                sx={{width: "30ch", my: 1}}
                disabled={true}
            />
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
