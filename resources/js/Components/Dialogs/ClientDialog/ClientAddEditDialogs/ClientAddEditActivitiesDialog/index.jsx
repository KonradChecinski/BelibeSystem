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
import moment from "moment";
import {
    useClientActivitiesDialogForm
} from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditActivitiesDialog/form/useClientActivitiesDialogForm";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
// import {DatePicker} from '@mui/x-date-pickers/DatePicker';

export default function ClientAddEditActivitiesDialog({
                                                          open,
                                                          setOpen,
                                                          clickedActivity,
                                                          params,
                                                      }) {

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientActivitiesDialogForm();

    console.log("clickedActivity: ", clickedActivity)

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        type: clickedActivity ? {
            id: clickedActivity.activity_type.id,
            name: clickedActivity.activity_type.name,
            label: clickedActivity.activity_type.name,
        } : null,
        description: clickedActivity ? clickedActivity.description : '',
        date: clickedActivity ? clickedActivity.date : moment(),//.format('YYYY-MM-DD'),
        time: clickedActivity ? clickedActivity.time : moment(),//.format('HH:mm'),
        user: clickedActivity ? {
            id: clickedActivity.user.id,
            name: clickedActivity.user.name,
            label: clickedActivity.user.name,
        } : null,
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue('type', clickedActivity?.activity_type?.name)
        setValue('description', clickedActivity?.description)
        setValue('date', clickedActivity?.date)
        setValue('time', clickedActivity?.time)
        setValue('user', clickedActivity?.user)

        setData({
            type: clickedActivity ? {
                id: clickedActivity.activity_type.id,
                name: clickedActivity.activity_type.name,
                label: clickedActivity.activity_type.name,
            } : null,
            description: clickedActivity ? clickedActivity.description : '',
            date: clickedActivity ? clickedActivity.date : moment(),//.format('YYYY-MM-DD'),
            time: clickedActivity ? clickedActivity.time : moment(),//.format('HH:mm'),
            user: clickedActivity ? {
                id: clickedActivity.user.id,
                name: clickedActivity.user.name,
                label: clickedActivity.user.name,
            } : null,
        })

        console.log("data w useEffect: ", data);
    }, [setValue, clickedActivity]);

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
        clrErrors("type")
        clrErrors("description")
        clrErrors("date")
        clrErrors("time")
        clrErrors("user")

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        // if (clickedColor) {
        //     console.log(clickedColor.id)
        //     patch(route("system.products.model.color.update", {
        //             model: params.productModel.id,
        //             productModelColor: clickedColor.id
        //         }),
        //
        //         {
        //             preserveScroll: true,
        //             onSuccess: (e) => {
        //                 setColor(e.props.productModel.colors_with_images.find((e) => e.shortcut == data.shortcut))
        //                 reset();
        //                 setActiveStep(0);
        //                 enqueueSnackbar("Edytowano kolor", {variant: 'success'})
        //                 handleClose();
        //             },
        //             onError: errors => {
        //                 enqueueSnackbar("Błąd przy edycji koloru", {variant: 'error'})
        //                 console.error(errors)
        //             },
        //         })
        // } else {
        //     post(route("system.products.model.color", {model: params.productModel.id}),
        //
        //         {
        //             preserveScroll: true,
        //             onSuccess: (e) => {
        //                 setColor(e.props.productModel.colors_with_images.find((e) => e.shortcut == data.shortcut))
        //                 reset();
        //                 setActiveStep(0);
        //                 enqueueSnackbar("Dodano kolor", {variant: 'success'})
        //                 handleClose();
        //                 setOpenDialogAdd(true);
        //             },
        //             onError: errors => {
        //                 enqueueSnackbar("Błąd przy dodawniu koloru", {variant: 'error'})
        //                 console.error(errors)
        //             },
        //         })
        // }

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
                        {clickedActivity ? "Edytuj aktywność klienta" : "Dodaj aktywność klienta"}
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
                                params={params}
                                clickedActivity={clickedActivity}
                                register={register}
                                errors={fieldErrors}
                            /> : null}
                        {activeStep === 1 ? <Step2 data={data} setData={setData} errors={errors}/> : null}

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

function Step1({data, setData, params, clickedActivity = null, register, errors}) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <Box>
                <Autocomplete
                    id="type"
                    options={params.activityType.map(e => ({
                        id: e.id,
                        name: e.name,
                        label: e.name
                    }))}
                    sx={{width: "30ch"}}
                    value={data.type}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => {
                        setData({
                            ...data,
                            type: value,
                        })
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

            <Box>
                <TextField
                    type="text"
                    id="description"
                    label="Opis"
                    multiline
                    color={errors.description?.message && "error"}
                    {...register("text")}
                    onChange={(value) => {
                        setData('description', value.target.value);
                    }}
                    defaultValue={data.description}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.description?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.description?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                {/*<TextField*/}
                {/*    type="date"*/}
                {/*    id="date"*/}
                {/*    label="Data"*/}
                {/*    color={errors.date?.message && "error"}*/}
                {/*    {...register("date")}*/}
                {/*    onChange={(value) => {*/}
                {/*        setData('date', value.target.value);*/}
                {/*    }}*/}
                {/*    defaultValue={data.date}*/}
                {/*    sx={{width: "30ch", my: 1}}*/}
                {/*/>*/}

                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="Data"
                        id="date"
                        value={data.date}
                        onChange={(value) => {
                            setData('date', value);
                            // setValue('') ???
                        }}
                        sx={{width: "30ch", my: 1}}

                    />
                </LocalizationProvider>
                {errors.date?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.date?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                {/*<TextField*/}
                {/*    type="time"*/}
                {/*    id="time"*/}
                {/*    label=""*/}
                {/*    color={errors.time?.message && "error"}*/}
                {/*    {...register("time")}*/}
                {/*    onChange={(value) => {*/}
                {/*        setData('time', value.target.value);*/}
                {/*    }}*/}
                {/*    defaultValue={data.time}*/}
                {/*    sx={{width: "30ch", my: 1}}*/}
                {/*/>*/}
                {/*{errors.time?.message && (*/}
                {/*    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                {/*        {errors.time?.message.toString()}*/}
                {/*    </Typography>*/}
                {/*)}*/}
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <TimePicker
                        label="Czas"
                        id="time"
                        value={data.time}
                        onChange={(value) => {
                            setData('time', value);
                            // setValue('') ???
                        }}
                        sx={{width: "30ch", my: 1}}
                    />
                </LocalizationProvider>
                {errors.time?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.time?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <Autocomplete
                    id="user"
                    options={params.user.map(e => ({
                        id: e.id,
                        name: e.name,
                        label: e.name
                    }))}
                    sx={{width: "30ch"}}
                    value={data.user}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => {
                        setData({
                            ...data,
                            user: value,
                        })
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="Kto"
                            sx={{my: 1}}
                            {...register("user")}
                            value={data.user}
                            color={errors.user?.message && "error"}
                        />
                    }
                />
                {errors.user?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                        {errors.user?.message.toString()}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function Step2({data, errors}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="type" label="Typ" variant="outlined"
                       value={data.type.label}

                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="description" label="Opis" variant="outlined"
                       value={data.description}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="date" label="Data" variant="outlined"
                       value={data.date}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="time" label="Czas" variant="outlined"
                       value={data.time}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="user" label="Kto" variant="outlined"
                       value={data.user.label}
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

