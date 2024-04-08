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
import {enqueueSnackbar} from "notistack";
import ProductsAddDialog from "@/Components/Dialogs/ProductsDialog/ProductsAddDialog";
import {useColorAddForm} from "@/Components/Dialogs/ModelColorDialog/ModelColorAddDialog/form/useColorAddForm"

export default function ModelColorAddDialog({open, setOpen, reloadData, roles, params, clickedColor, setClickedColor}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useColorAddForm();

    const [color, setColor] = useState({});

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        shortcut: clickedColor ? clickedColor.shortcut : '',
        b2c_shortcut: clickedColor ? clickedColor.b2c_shortcut : '',

        name: clickedColor ? clickedColor.name : '',
        b2c_product_name: clickedColor ? clickedColor.b2c_product_name : '',

        color_icon: clickedColor?.color_icon ? {
            id: clickedColor.color_icon.id,
            name: clickedColor.color_icon.name,
            label: clickedColor.color_icon.name,
            type: clickedColor.color_icon.type,
            path: clickedColor.color_icon.path,
            hex: clickedColor.color_icon.hex,
        } : null,

        b2c_name: clickedColor ? {
            id: clickedColor?.b2c_color_id,
            name: clickedColor.b2c_name,
            label: clickedColor.b2c_name
        } : null,
    })

    useEffect(() => {
        // console.log("Clicked color w useEffect: ", clickedColor);

        // inicjacja wartości pól
        setValue('shortcut', clickedColor?.shortcut);
        setValue('b2c_shortcut', clickedColor?.b2c_shortcut);
        setValue('name', clickedColor?.name);
        setValue('b2c_product_name', clickedColor?.b2c_product_name);

        setValue('color_icon', clickedColor?.color_icon ? {
            id: clickedColor?.color_icon?.id,
            name: clickedColor?.color_icon?.name,
            label: clickedColor?.color_icon?.name
        } : null);

        setValue('b2c_name', clickedColor?.b2c_color_id ? {
            id: clickedColor?.b2c_color_id,
            name: params.b2c.color.find((color) => {
                return color.id === clickedColor.b2c_color_id
            })?.name,
            label: params.b2c.color.find((color) => {
                return color.id === clickedColor.b2c_color_id
            })?.name
        } : null);

        setData({
            shortcut: clickedColor ? clickedColor.shortcut : '',
            b2c_shortcut: clickedColor ? clickedColor.b2c_shortcut : '',

            name: clickedColor ? clickedColor.name : '',
            b2c_product_name: clickedColor ? clickedColor.b2c_product_name : '',

            color_icon: clickedColor?.color_icon ? {
                id: clickedColor.color_icon.id,
                name: clickedColor.color_icon.name,
                label: clickedColor.color_icon.name,
                type: clickedColor.color_icon.type,
                path: clickedColor.color_icon.path,
                hex: clickedColor.color_icon.hex,
            } : null,

            b2c_name: clickedColor?.b2c_color_id ? {
                id: clickedColor?.b2c_color_id,
                name: params.b2c.color.find((color) => {
                    return color.id === clickedColor.b2c_color_id
                })?.name,
                label: params.b2c.color.find((color) => {
                    return color.id === clickedColor.b2c_color_id
                })?.name
            } : null,
        })

        // console.log("data w useEffect: ", data);
    }, [setValue, clickedColor]);

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
        clrErrors("shortcut")
        clrErrors("name")
        clrErrors("b2c_shortcut")
        clrErrors("b2c_product_name")
        clrErrors("b2c_name")

        setClickedColor(null)

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        if (clickedColor) {
            // console.log(clickedColor.id)
            patch(route("system.products.model.color.update", {
                    model: params.productModel.id,
                    productModelColor: clickedColor.id
                }),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        setColor(e.props.productModel.colors_with_images.find((e) => e.shortcut == data.shortcut))
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano kolor", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy edycji koloru", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            post(route("system.products.model.color", {model: params.productModel.id}),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        setColor(e.props.productModel.colors_with_images.find((e) => e.shortcut == data.shortcut))
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano kolor", {variant: 'success'})
                        handleClose();
                        setOpenDialogAdd(true);
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawniu koloru", {variant: 'error'})
                        console.error(errors)
                    },
                })
        }

    }


    const [openDialogAdd, setOpenDialogAdd] = useState(false);


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
                        {clickedColor ? "Edytuj kolor" : "Dodaj kolor"}
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
                                clickedColor={clickedColor}
                                register={register}
                                errors={fieldErrors}
                                params={params}
                            /> : null}
                        {activeStep === 1 ? <Step2 data={data} setData={setData} roles={roles} errors={errors}/> : null}

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

            <ProductsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} color={color}
                               method={"create"} props={params}/>
        </>
    );
}

function Step1({data, setData, clickedColor = null, register, errors, params}) {
    // console.log(data)
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden"
        }}>
            <TextField
                type="text"
                id="shortcut"
                label="Symbol"
                color={errors.shortcut?.message && "error"}
                {...register("shortcut")}
                onChange={(value) => {
                    setData('shortcut', value.target.value);
                }}
                defaultValue={data.shortcut}
                sx={{width: "30ch", my: 1}}
                disabled={Boolean(clickedColor)}
            />
            {errors.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.shortcut?.message.toString()}
                </Typography>
            )}

            <TextField
                type="text"
                id="name"
                label="Nazwa"
                color={errors.name?.message && "error"}
                {...register("name")}
                onChange={(value) => {
                    setData('name', value.target.value);
                }}
                defaultValue={data.name}
                sx={{width: "30ch", my: 1}}
            />
            {errors.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}

            <Typography variant="body1" sx={{mt: 2, mb: 2}}>
                Ikona koloru
            </Typography>

            <Autocomplete
                id="color_icon"
                options={params.productColorIcons.map((c) => ({
                    ...c,
                    label: c.name,
                }))}
                sx={{width: "30ch"}}
                value={data.color_icon}
                // getOptionLabel={(option) => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) => {
                    setData({
                        ...data,
                        color_icon: value,
                    })
                }}
                renderOption={(props, option) => {
                    return (
                        <Box
                            component="li"
                            {...props}
                            sx={{
                                height: 40
                            }}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2
                            }}>
                                {option.type === 1 ?
                                    <Box
                                        component={"img"}
                                        src={route("colorIcons", {path: option.path})}
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "100%",
                                            border: 1
                                        }}/>
                                    :
                                    <Box sx={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "100%",
                                        bgcolor: option.hex,
                                        border: 1
                                    }}/>
                                }
                                <Typography variant="subtitle1" component="div">
                                    {option.name}
                                </Typography>
                            </Box>

                        </Box>
                    );

                }
                }
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Ikona"
                        sx={{my: 1}}
                        {...register("color_icon")}
                        value={data.color_icon}
                        color={errors.color_icon?.message && "error"}
                    />
                }
            />
            {errors.color_icon?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                    {errors.color_icon?.message.toString()}
                </Typography>
            )}


            <Typography variant="body1" sx={{mt: 2, mb: 2}}>
                Sklep Internetowy
            </Typography>

            <TextField
                type="text"
                id="b2c_shortcut"
                label="Symbol koloru do sklepu"
                color={errors.b2c_shortcut?.message && "error"}
                {...register("b2c_shortcut")}
                onChange={(value) => {
                    setData('b2c_shortcut', value.target.value);
                }}
                defaultValue={data.b2c_shortcut}
                sx={{width: "30ch", my: 1}}
            />
            {errors.b2c_shortcut?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.b2c_shortcut?.message.toString()}
                </Typography>
            )}

            <TextField
                type="text"
                id="b2c_product_name"
                label="Nazwa produktu do sklepu"
                color={errors.b2c_product_name?.message && "error"}
                {...register("b2c_product_name")}
                onChange={(value) => {
                    setData('b2c_product_name', value.target.value);
                }}
                defaultValue={data.b2c_product_name}
                sx={{width: "30ch", my: 1}}
            />
            {errors.b2c_product_name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.b2c_product_name?.message.toString()}
                </Typography>
            )}

            <Autocomplete
                id="b2c_name"
                options={params.b2c.color.map(e => ({
                    id: e.id,
                    name: e.name,
                    label: e.name
                }))}
                sx={{width: "30ch"}}
                value={data.b2c_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) => {
                    setData({
                        ...data,
                        b2c_name: value,
                    })
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Kolor do sklepu"
                        sx={{my: 1}}
                        {...register("b2c_name")}
                        value={data.b2c_name}
                        color={errors.b2c_name?.message && "error"}
                    />
                }
            />
            {errors.b2c_name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                    {errors.b2c_name?.message.toString()}
                </Typography>
            )}
        </Box>
    );
}

function Step2({data, errors}) {
    const renderCell = (selected) => selected.map((value) => {
        return (<Typography key={value} variant="body1" gutterBottom>
            {roles.find(e => e.id == value).name}
        </Typography>);
    })
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="shortcut" label="Symbol" variant="outlined"
                       value={data.shortcut}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <Typography variant="body1" sx={{mt: 2, mb: 2}}>
                Ikona koloru
            </Typography>

            <TextField id="color_icon" label="Ikona" variant="outlined"
                       value={data.color_icon.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}
            />


            <Typography variant="body1" sx={{mt: 2, mb: 2}}>
                Sklep Internetowy
            </Typography>

            <TextField id="b2c_shortcut" label="Symbol koloru do sklepu" variant="outlined"
                       value={data.b2c_shortcut}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="b2c_product_name" label="Nazwa produktu do sklepu" variant="outlined"
                       value={data.b2c_product_name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id={"b2c_name"} label={"Kolor do sklepu"} variant="outlined"
                       value={data.b2c_name.name}
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

