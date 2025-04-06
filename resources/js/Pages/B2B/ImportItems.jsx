import {Head, Link, router, useForm} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    ButtonGroup, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem,
    Paper, Radio, RadioGroup, Select,
    Step,
    StepLabel,
    Stepper,
    Table, TableBody, TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {DropzoneArea} from "mui-file-dropzone";
import {useImportItemsStep1Form} from "@/Components/Dialogs/ImportItemDialog/ImportItems/form/useImportItemsStep1Form";
import {useImportItemsStep2Form} from "@/Components/Dialogs/ImportItemDialog/ImportItems/form/useImportItemsStep2Form";

export default function ImportItemsPage(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)


    const [step, setStep] = useState(0);

    const {data, setData, post, processing, errors} = useForm({
        file: null,
        headersFromFile: [],
        identification: 1,
    });

    return (
        <ClientLayout
            props={props}
            header={
                t("Import items")
            }
        >
            <Head title={t("Import items")}/>
            <Box sx={{width: 1, minHeight: 400, position: "relative"}}>
                <Paper elevation={2}
                       sx={{p: 5, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-around"}}>

                    <Stepper activeStep={step} alternativeLabel>
                        <Step key={0}>
                            <StepLabel>Wybierz plik</StepLabel>
                        </Step>
                        <Step key={1}>
                            <StepLabel>Wybierz kolumny</StepLabel>
                        </Step>
                        <Step key={2}>
                            <StepLabel>Importuj</StepLabel>
                        </Step>
                    </Stepper>

                    {step === 0 && (
                        <Step1 data={data} setData={setData} setStep={setStep} errors={errors}/>
                    )}

                    {step === 1 && (
                        <Step2 data={data} setData={setData} setStep={setStep} errors={errors}/>
                    )}

                    {step === 2 && (
                        <Box sx={{width: 1, display: "flex", flexDirection: "column", gap: 2}}>
                            asas3
                        </Box>
                    )}

                </Paper>
            </Box>
        </ClientLayout>
    );
}


function Step1({data, setData, setStep, errors}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
        control
    } = useImportItemsStep1Form()

    const changeDataFiles = (files) => {
        setData('file', files[0]);
        setValue('file', files[0]);
    }

    const onSubmit = () => {
        router.post(
            route('b2b.import.items.getHeaderFromFile'),
            data,
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setData("headersFromFile", page.props.headersFromFile);
                    setStep(1)
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy odczytywaniu pliku", {variant: 'error'})
                    for (const errorsKey in errors) {
                        enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                    }

                },
            }
        )
    }

    return (
        <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            sx={{width: 1, display: "flex", flexDirection: "column", gap: 2}}
        >
            <DropzoneArea
                acceptedFiles={["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
                showPreviews={false}
                maxFileSize={10240}
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

            {fieldErrors.file?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {fieldErrors.file?.message.toString()}
                </Typography>
            )}

            <Box sx={{width: 1, display: "flex", justifyContent: "flex-end", gap: 2}}>

                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button disabled={true}>Wstecz</Button>
                    <Button type={"submit"}>Dalej</Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}


function Step2({data, setData, setStep, errors}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
        control
    } = useImportItemsStep2Form()

    const changeIdentification = (e) => {
        console.log(e.target.value, data)
        setData('identification', Number(e.target.value));
        setValue('identification', Number(e.target.value));
    }

    return (
        <Box
            component={"form"}
            onSubmit={handleSubmit((data) => {
                setStep(2)
            })}
            sx={{width: 1, display: "flex", flexDirection: "column", gap: 2}}
        >


            <FormControl component="fieldset">
                <FormLabel component="legend">{t("Identification")}</FormLabel>
                <RadioGroup
                    aria-label="idetification"
                    defaultValue="1"
                    name="radio-buttons-group"
                    onChange={changeIdentification}
                >
                    <FormControlLabel
                        value="1"
                        control={<Radio/>}
                        label="Symbol"
                    />
                    <FormControlLabel
                        value="2"
                        control={<Radio/>}
                        label="EAN"
                    />
                </RadioGroup>
            </FormControl>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("System")}</TableCell>
                            <TableCell>{t("Import from spreadsheet")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{display: data.identification !== 1 ? 'none' : ''}}>
                            <TableCell>{t("Symbol")}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Kolumna</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Kolumna"
                                        variant={"outlined"}
                                    >
                                        {data.headersFromFile.map((header, index) => (
                                            <MenuItem key={index} value={header}>{header}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{display: data.identification !== 2 ? 'none' : ''}}>
                            <TableCell>{t("EAN")}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Kolumna</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Kolumna"
                                        variant={"outlined"}
                                    >
                                        {data.headersFromFile.map((header, index) => (
                                            <MenuItem key={index} value={header}>{header}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("Quantity")}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Kolumna</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Kolumna"
                                        variant={"outlined"}
                                    >
                                        {data.headersFromFile.map((header, index) => (
                                            <MenuItem key={index} value={header}>{header}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{width: 1, display: "flex", justifyContent: "flex-end", gap: 2}}>

                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => setStep(0)}>Wstecz</Button>
                    <Button type={"submit"}>Dalej</Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}
