import {
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
// import {DatePicker} from '@mui/x-date-pickers/DatePicker';

export default function ClientAddEditTasksDialog({
                                                     open,
                                                     setOpen,
                                                     clickedTask,
                                                 }) {

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientTasksDialogForm();

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        title: clickedTask ? clickedTask.title : '',
        text: clickedTask ? clickedTask.text : '',
        date: clickedTask ? clickedTask.date : moment().format('YYYY-MM-DD'),
        time: clickedTask ? clickedTask.time : moment().format('HH:mm'),
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue('title', clickedTask?.title);
        setValue('text', clickedTask?.text);
        setValue('date', clickedTask?.date);
        setValue('time', clickedTask?.time);

        setData({
            title: clickedTask ? clickedTask.title : '',
            text: clickedTask ? clickedTask.text : '',
            date: clickedTask ? clickedTask.date : '',
            time: clickedTask ? clickedTask.time : '',
        })

        console.log("data w useEffect: ", data);
    }, [setValue, clickedTask]);

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
        clrErrors("title")
        clrErrors("text")
        clrErrors("date")
        clrErrors("time")

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
                                clickedTask={clickedTask}
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

function Step1({data, setData, clickedTask = null, register, errors}) {
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
                <TextField
                    type="date"
                    id="date"
                    label=""
                    color={errors.date?.message && "error"}
                    {...register("date")}
                    onChange={(value) => {
                        setData('date', value.target.value);
                    }}
                    defaultValue={data.date}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.date?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.date?.message.toString()}
                    </Typography>
                )}

                {/*<DatePicker*/}
                {/*    label="Data"*/}
                {/*    value={data.date}*/}
                {/*    onChange={(value) => {*/}
                {/*        setData('date', value);*/}
                {/*    }}*/}
                {/*    renderInput={(params) => (*/}
                {/*        <TextField*/}
                {/*            {...params}*/}
                {/*            color={errors.date?.message && "error"}*/}
                {/*            {...register("date")}*/}
                {/*            sx={{width: "30ch", my: 1}}*/}
                {/*        />*/}
                {/*    )}*/}
                {/*/>*/}
                {/*{errors.date?.message && (*/}
                {/*    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                {/*        {errors.date?.message.toString()}*/}
                {/*    </Typography>*/}
                {/*)}*/}
            </Box>

            <Box>
                <TextField
                    type="time"
                    id="time"
                    label=""
                    color={errors.time?.message && "error"}
                    {...register("time")}
                    onChange={(value) => {
                        setData('time', value.target.value);
                    }}
                    defaultValue={data.time}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.time?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.time?.message.toString()}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function Step2({data, errors}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="title" label="Tytuł" variant="outlined"
                       value={data.title}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="text" label="Treść" variant="outlined"
                       value={data.text}
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

