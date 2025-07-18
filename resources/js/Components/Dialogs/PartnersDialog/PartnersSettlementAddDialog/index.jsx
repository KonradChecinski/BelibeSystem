import {
    Autocomplete,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Paper,
    Step,
    StepLabel,
    Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect, useRef} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {
    usePartnerSettlementAddForm
} from "@/Components/Dialogs/PartnersDialog/PartnersSettlementAddDialog/form/usePartnerSettlementAddForm";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {Controller} from "react-hook-form";
import moment from "moment/moment";
import {DropzoneArea} from "mui-file-dropzone";

export default function PartnersSettlementAddDialog({open, setOpen, partner}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
        control
    } = usePartnerSettlementAddForm()


    const {data, setData, transform, post, processing, reset} = useForm({
        date: moment(),
        file: null,
    })

    transform((data) => {
        return {
            ...data,
            date: data.date.format("YYYY-MM-DD"),
        }
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
        setValue("date", data.date)

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
        setValue("file", null);
        setValue("date", moment());
        clrErrors("file");
        clrErrors("date");

        setActiveStep(0);

        setOpen(false);
    };

    const changeDataFiles = (files) => {
        setData("file", files[0])
        setValue("file", files[0])
    }

    const save = () => {
        post(route("system.partners.partner.settlements.create", {partner: partner.id}),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Dodano rozliczenie", {variant: 'success'})
                    // reloadData();
                    handleClose();
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy dodawaniu rozliczenia", {variant: 'error'})
                    for (const errorsKey in errors) {
                        enqueueSnackbar(errors[errorsKey], {variant: 'error'})
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
            fullWidth={true}
            maxWidth="md"

        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Dodawanie rozliczenia
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
                        <Step1 data={data} setData={setData} register={register} errors={fieldErrors}
                               control={control} changeDataFiles={changeDataFiles}/> : null}
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

function Step1({data, setData, register, errors, control, changeDataFiles}) {
    return (
        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2}}>
            <Box sx={{display: "flex", flexDirection: "column", flex: 2}}>


                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                        control={control}
                        name="date"
                        defaultValue={data?.date}
                        render={({field}) => (
                            <DatePicker
                                {...field}
                                label="Data"
                                value={data?.date}
                                onChange={(value) => {
                                    const newDate = moment(value);
                                    setData('date', newDate);
                                    field.onChange(value);
                                }}
                                sx={{width: "30ch", my: 1}}
                            />
                        )}
                    />
                </LocalizationProvider>
                {errors.date?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.date?.message.toString()}
                    </Typography>
                )}

                <DropzoneArea
                    acceptedFiles={["text/csv", "text/plain"]}
                    showPreviews={false}
                    maxFileSize={10485760}
                    filesLimit={1}
                    showAlerts={null}
                    onAlert={(text, type) => {
                    }}
                    onChange={changeDataFiles}
                    clearOnUnmount={false}
                    previewText={"Podgląd"}
                    showPreviewsInDropzone={true}
                    showFileNamesInPreview={true}

                    getFileRemovedMessage={(e) => enqueueSnackbar("Usunięto " + e + "", {variant: "default"})}
                    getDropRejectMessage={(e) => enqueueSnackbar("Plik " + e.name + " jest niedozwolonego typu", {variant: "warning"})}
                    getFileAddedMessage={(e) => enqueueSnackbar("Dodano " + e, {variant: "info"})}
                    getFileLimitExceedMessage={(e) => enqueueSnackbar("Przekroczono ilość dozwolonych plików w pojedyńczym przesłaniu: " + e, {variant: "error"})}
                    dropzoneText={"Przeciągnij plik lub kliknij tutaj"}
                />
                {errors.file?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.file?.message.toString()}
                    </Typography>
                )}


            </Box>
            <Box sx={{flex: 3}}>
                <Typography variant="body1" gutterBottom>
                    Dozwolone formaty plików: CSV
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Maks rozmiar pliku (1): 10MB
                </Typography>


                <Typography variant="h5" gutterBottom sx={{my: 1}}>
                    Kolumny:
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Kolumna</TableCell>
                                <TableCell>Znaczenie</TableCell>
                                <TableCell>Przykład</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Symbol towaru z systemu</TableCell>
                                <TableCell>S-0100-0104-1-L</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sprzedaz</TableCell>
                                <TableCell>Liczba całkowita</TableCell>
                                <TableCell>10</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Zwroty</TableCell>
                                <TableCell>Liczba całkowita</TableCell>
                                <TableCell>6</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Bilans</TableCell>
                                <TableCell>Liczba całkowita</TableCell>
                                <TableCell>4</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Cena_netto</TableCell>
                                <TableCell>Liczba z przecinkiem z separatorem "." lub ","</TableCell>
                                <TableCell>10.50</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Cena_brutto</TableCell>
                                <TableCell>Liczba z przecinkiem z separatorem "." lub ","</TableCell>
                                <TableCell>12,50</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Wartosc_netto</TableCell>
                                <TableCell>Liczba z przecinkiem z separatorem "." lub ","</TableCell>
                                <TableCell>105.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Wartosc_brutto</TableCell>
                                <TableCell>Liczba z przecinkiem z separatorem "." lub ","</TableCell>
                                <TableCell>125,00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>


    );
}

function Step2({data}) {
    const formattedDateTime = moment(data.date).format("DD-MM-YYYY")

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="date" label="Data" variant="outlined"
                       value={formattedDateTime}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="file" label="Plik" variant="outlined"
                       value={data.file?.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

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
