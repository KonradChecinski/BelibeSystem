import {
    Autocomplete,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {
    useClientDiscountsDialogForm
} from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditDiscountsDialog/form/useClientDiscountsDialogForm";
import {enqueueSnackbar} from "notistack";

export default function ClientAddEditDiscountsDialog({
                                                         open,
                                                         setOpen,
                                                         clickedDiscount,
                                                         params,
                                                     }) {

    const types = [
        {id: 1, name: "Model", label: "Model"},
        {id: 2, name: "Kategoria", label: "Kategoria"},
        {id: 3, name: "Grupa", label: "Grupa"},
        {id: 4, name: "Producent", label: "Producent"}
    ]

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientDiscountsDialogForm();


    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        type: clickedDiscount ? types.find((e) => e.id === clickedDiscount.type) : null,

        product_model: clickedDiscount?.product_model ? {
            id: clickedDiscount.product_model?.id,
            symbol: clickedDiscount.product_model?.symbol,
            name: clickedDiscount.product_model?.name,
            label: clickedDiscount.product_model?.symbol + " - " + clickedDiscount.product_model?.name
        } : null,
        product_category: clickedDiscount?.product_category ? {
            id: clickedDiscount.product_category?.id,
            name: clickedDiscount.product_category?.name,
            label: clickedDiscount.product_category?.name
        } : null,
        product_group: clickedDiscount?.product_group ? {
            id: clickedDiscount.product_group?.id,
            name: clickedDiscount.product_group?.name,
            label: clickedDiscount.product_group?.name
        } : null,
        product_brand: clickedDiscount?.product_brand ? {
            id: clickedDiscount.product_brand?.id,
            name: clickedDiscount.product_brand?.name,
            label: clickedDiscount.product_brand?.name
        } : null,

        value: clickedDiscount ? clickedDiscount.value : 0,
    })

    const getNameByTypeId = (id) => {
        switch (id) {
            case 1:
                return data.product_model
            case 2:
                return data.product_category
            case 3:
                return data.product_group
            case 4:
                return data.product_brand
            default:
                return null
        }
    }

    useEffect(() => {
        // console.log("Clicked user w useEffect: ", clickedUser);

        // inicjacja wartości pól
        setValue('type', clickedDiscount ? 'type' : '');
        setValue('name', clickedDiscount ? 'name' : '');
        setValue('value', clickedDiscount?.value ? clickedDiscount?.value : 0);

        setData({
            type: clickedDiscount ? types.find((e) => e.id === clickedDiscount.type) : null,

            product_model: clickedDiscount?.product_model ? {
                id: clickedDiscount.product_model?.id,
                symbol: clickedDiscount.product_model?.symbol,
                name: clickedDiscount.product_model?.name,
                label: clickedDiscount.product_model?.symbol + " - " + clickedDiscount.product_model?.name
            } : null,
            product_category: clickedDiscount?.product_category ? {
                id: clickedDiscount.product_category?.id,
                name: clickedDiscount.product_category?.name,
                label: clickedDiscount.product_category?.name
            } : null,
            product_group: clickedDiscount?.product_group ? {
                id: clickedDiscount.product_group?.id,
                name: clickedDiscount.product_group?.name,
                label: clickedDiscount.product_group?.name
            } : null,
            product_brand: clickedDiscount?.product_brand ? {
                id: clickedDiscount.product_brand?.id,
                name: clickedDiscount.product_brand?.name,
                label: clickedDiscount.product_brand?.name
            } : null,

            value: clickedDiscount ? clickedDiscount.value : null,
        })

        // setCurrentSchema()
    }, [setValue, clickedDiscount]);

    const onSubmit = (submitData) => {
        // console.log("Dane z submit: ", submitData)
        // console.log("Dane z InertiaJS: ", data)

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
        clrErrors("type")
        clrErrors("name")
        clrErrors("value")

        // setClickedUser(null)

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        if (clickedDiscount) {
            patch(route("system.clients.client.discount.update", {
                    client: params.client.id,
                    clientDiscount: clickedDiscount.id
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
        } else {
            post(route("system.clients.client.discount", {client: params.client.id}),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano rabat", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawniu rabatu", {variant: 'error'})
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
                                types={types}
                                params={params}
                                setValue={setValue}
                                getNameByTypeId={getNameByTypeId}
                            /> : null}
                        {activeStep === 1 ? <Step2 data={data} setData={setData} errors={errors}
                                                   getNameByTypeId={getNameByTypeId}/> : null}

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

function Step1({data, setData, clickedDiscount = null, register, errors, types, params, setValue, getNameByTypeId}) {
    const getNameAutocompleteOptions = () => {
        switch (data.type?.id) {
            case 1:
                return (
                    params.discountDictionary.productModels.map((e => ({
                        id: e.id,
                        name: e.name,
                        label: e.symbol + " - " + e.name
                    })))
                )

            case 2:
                return (
                    params.discountDictionary.productCategories.map((e => ({
                        id: e.id,
                        name: e.name,
                        label: e.name
                    })))
                )
            case 3:
                return (
                    params.discountDictionary.productGroups.map((e => ({
                        id: e.id,
                        name: e.name,
                        label: e.name
                    })))
                )
            case 4:
                return (
                    params.discountDictionary.productBrands.map((e => ({
                        id: e.id,
                        name: e.name,
                        label: e.name
                    })))
                )
            default:
                return null
        }
    }


    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <Box>
                <Autocomplete
                    id="type"
                    options={types}
                    sx={{width: "30ch"}}
                    value={data.type}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => {
                        setData({
                            ...data,
                            type: value,
                        })
                        getNameByTypeId(value?.id) ? setValue("name", getNameByTypeId(value?.id)) : setValue("name", "")
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="Typ"
                            sx={{my: 1}}
                            {...register("type")}
                            value={data.type}
                            color={errors.type?.message && "error"}
                        />
                    }
                />
                {errors.type?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                        {errors.type?.message.toString()}
                    </Typography>
                )}
            </Box>

            {data.type ? (
                <>
                    <Box>
                        <Autocomplete
                            id="name"
                            options={getNameAutocompleteOptions()}
                            sx={{width: "30ch"}}
                            value={getNameByTypeId(data.type?.id)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            // getOptionLabel={(option) => option.name}
                            onChange={(e, value) => {
                                switch (data.type?.id) {
                                    case 1:
                                        setData({
                                            ...data,
                                            product_model: value,
                                        });
                                        break
                                    case 2:
                                        setData({
                                            ...data,
                                            product_category: value,
                                        })
                                        break
                                    case 3:
                                        setData({
                                            ...data,
                                            product_group: value,
                                        })
                                        break
                                    case 4:
                                        setData({
                                            ...data,
                                            product_brand: value,
                                        })
                                        break
                                    default:
                                        break
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Nazwa"
                                    sx={{my: 1}}
                                    {...register("name")}
                                    value={getNameByTypeId(data.type?.id)}
                                    color={errors.name?.message && "error"}
                                />
                            }
                        />
                        {errors.name?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                {errors.name?.message.toString()}
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <TextField
                            type="number"
                            id="value"
                            label="Wartość rabatu"
                            color={errors.value?.message && "error"}
                            {...register("value")}
                            onChange={(value) => {
                                setData('value', value.target.value);
                            }}
                            defaultValue={0}
                            value={data.value}
                            sx={{width: "30ch", my: 1}}
                        />
                        {errors.value?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errors.value?.message.toString()}
                            </Typography>
                        )}
                    </Box>
                </>
            ) : null}
        </Box>
    );
}

function Step2({data, errors, getNameByTypeId}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="type" label="Typ" variant="outlined"
                       value={data.type?.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="name" label="Nazwa" variant="outlined"
                       value={getNameByTypeId(data.type?.id)?.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="value" label="Wartość rabatu" variant="outlined"
                       value={data.value}
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

