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
    useClientTasksDialogForm
} from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditTasksDialog/form/useClientTasksDialogForm";
import {DatePicker, DateTimePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {enqueueSnackbar} from "notistack";
import {Controller} from 'react-hook-form';

export default function ClientAddEditTasksDialog({
                                                     open,
                                                     setOpen,
                                                     clickedTask,
                                                     params
                                                 }) {

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
        control
    } = useClientTasksDialogForm();

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        title: clickedTask ? clickedTask.title : '',
        text: clickedTask ? clickedTask.text : '',
        datetime: clickedTask ? moment(clickedTask.datetime) : moment(),
        user: clickedTask ? {
            id: clickedTask.user.id,
            name: clickedTask.user.name,
            label: clickedTask.user.name,
        } : null,
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue('title', clickedTask?.title);
        setValue('text', clickedTask?.text);
        setValue('datetime', clickedTask?.datetime);
        setValue('user', clickedTask?.user)


        setData({
            title: clickedTask ? clickedTask.title : '',
            text: clickedTask ? clickedTask.text : '',
            datetime: clickedTask ? moment(clickedTask.datetime) : moment(),
            user: clickedTask ? {
                id: clickedTask.user.id,
                name: clickedTask.user.name,
                label: clickedTask.user.name,
            } : null,
        })

        // console.log("data w useEffect: ", data);
    }, [setValue, clickedTask]);

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
        clrErrors("title")
        clrErrors("text")
        clrErrors("date")
        clrErrors("time")
        clrErrors("user")

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        if (clickedTask) {
            patch(route("system.clients.client.task.update", {
                    client: params.client.id,
                    clientTask: clickedTask.id
                }),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano zadanie", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy edycji zadania", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            post(route("system.clients.client.task", {client: params.client.id}),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano zadanie", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawniu zadania", {variant: 'error'})
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
                        {clickedTask ? "Edytuj zadanie klienta" : "Dodaj zadanie klienta"}
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
                                clickedTask={clickedTask}
                                register={register}
                                errors={fieldErrors}
                                control={control}
                            /> : null}
                        {activeStep === 1 ?
                            <Step2 data={data} setData={setData} params={params} errors={errors}/> : null}

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

function Step1({data, setData, params, clickedTask = null, register, errors, control}) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <Box>
                <TextField
                    type="text"
                    id="title"
                    label="Tytuł"
                    color={errors.title?.message && "error"}
                    {...register("title")}
                    onChange={(value) => {
                        setData('title', value.target.value);
                    }}
                    defaultValue={data.title}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.title?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.title?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <TextField
                    type="text"
                    id="text"
                    label="Treść"
                    multiline
                    minRows={3}
                    color={errors.text?.message && "error"}
                    {...register("text")}
                    onChange={(value) => {
                        setData('text', value.target.value);
                    }}
                    defaultValue={data.text}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.text?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.text?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                {/*<TextField*/}
                {/*    type="date"*/}
                {/*    id="date"*/}
                {/*    label=""*/}
                {/*    color={errors.date?.message && "error"}*/}
                {/*    {...register("date")}*/}
                {/*    onChange={(value) => {*/}
                {/*        setData('date', value.target.value);*/}
                {/*    }}*/}
                {/*    defaultValue={data.date}*/}
                {/*    sx={{width: "30ch", my: 1}}*/}
                {/*/>*/}

                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                        control={control}
                        name="datetime"
                        defaultValue={data.datetime}
                        render={({field}) => (
                            <DateTimePicker
                                {...field}
                                label="Data i czas"
                                value={data.datetime}
                                onChange={(value) => {
                                    const newDate = moment(value);
                                    // const formattedDate = newDate.format("DD-MM-YYYY HH:mm:ss");
                                    setData('datetime', newDate);
                                    field.onChange(value);
                                    // console.log('New Date:', newDate); // Check if new date is correctly formatted
                                    // console.log('Data:', data); // Check if data object is updated
                                }}
                                sx={{width: "30ch", my: 1}}
                            />
                        )}
                    />

                    {/*<DatePicker*/}
                    {/*    label="Data"*/}
                    {/*    id="date"*/}
                    {/*    value={data.date}*/}
                    {/*    onChange={(value) => {*/}
                    {/*        setData('date', value.target.value);*/}
                    {/*    }}*/}
                    {/*    {...register("date")}*/}
                    {/*    sx={{width: "30ch", my: 1}}*/}
                    {/*/>*/}
                </LocalizationProvider>

                {errors.datetime?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.date?.message.toString()}
                    </Typography>
                )}
            </Box>

            {params.auth.permissions.includes("changeUserInClientRelation") ?
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
                                label="Użytkownik"
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
                : null
            }
        </Box>
    );
}

function Step2({data, params, errors}) {
    const formattedDateTime = moment(data.datetime).format("DD-MM-YYYY HH:mm")

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="title" label="Tytuł" variant="outlined"
                       value={data.title}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="text" label="Treść" variant="outlined"
                       value={data.text}
                       multiline
                       minRows={3}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="date" label="Data i czas" variant="outlined"
                       value={formattedDateTime}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            {params.auth.permissions.includes("changeUserInClientRelation") ?
                <TextField id="user" label="Użytkownik" variant="outlined"
                           value={data.user.label}
                           disabled={true}
                           sx={{width: "30ch", my: 1}}/>
                : null
            }

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

