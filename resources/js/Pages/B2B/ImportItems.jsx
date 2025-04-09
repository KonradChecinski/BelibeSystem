import {Head, Link, router, useForm} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    ButtonGroup, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem,
    Paper, Radio, RadioGroup, Select,
    Step,
    StepLabel,
    Stepper, Switch,
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
        selectedHeaders: {
            symbol: null,
            ean: null,
            quantity: null,
        },
        identification: 1,
        items: [],
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
                        <Step1 data={data} setData={setData} setStep={setStep} post={post} errors={errors}/>
                    )}

                    {step === 1 && (
                        <Step2 data={data} setData={setData} setStep={setStep} post={post} errors={errors}/>
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


function Step1({data, setData, setStep, post, errors}) {
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
        post(
            route('b2b.import.items.getHeaderFromFile'),
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
                maxFileSize={80000000}
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


function Step2({data, setData, setStep, post, errors}) {
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

    const changeIdentification = (e, checked) => {
        console.log(e.target.value, checked, data)
        setData('identification', checked === false ? 1 : 2);
        setValue('identification', checked === false ? 1 : 2);
    }

    const changeSelectedHeader = (header, value) => {
        setData('selectedHeaders', {
            ...data.selectedHeaders,
            [header]: value
        })
        setValue('selectedHeaders', {
            ...data.selectedHeaders,
            [header]: value
        })
    }

    useEffect(() => {
        setValue('file', data.file)
    }, []);

    useEffect(() => {
        setValue("identification", data.identification)
    }, [data.identification]);

    const onSubmit = () => {
        console.log("cos")
        post(
            route('b2b.import.items.getItemsFromFile'),
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setData("items", page.props.itemsFromFile);
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


            <FormControl component="fieldset">
                <FormLabel component="legend">{t("Identification")}</FormLabel>

                <Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        width: 50
                    }}>
                        <Typography variant="body1" gutterBottom>
                            Symbol
                        </Typography>
                        <Switch
                            onChange={changeIdentification}
                            checked={data.identification === 2}
                        />
                        <Typography variant="body1" gutterBottom>
                            EAN
                        </Typography>
                    </Box>
                    {errors.identification?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {errors.identification?.message.toString()}
                        </Typography>
                    )}

                    {fieldErrors.identification?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {fieldErrors.identification?.message.toString()}
                        </Typography>
                    )}
                </Box>
            </FormControl>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{width: '20%'}}>{t("System")}</TableCell>
                            <TableCell sx={{width: '80%'}}>{t("Import from spreadsheet")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{display: data.identification !== 1 ? 'none' : ''}}>
                            <TableCell>{t("Symbol")}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <InputLabel id="symbol-label">Kolumna</InputLabel>
                                    <Select
                                        labelId="symbol-label"
                                        id="symbol"
                                        label="Kolumna"
                                        value={data.selectedHeaders.symbol}
                                        onChange={(e) => changeSelectedHeader("symbol", e.target.value)}
                                    >
                                        {data.headersFromFile.map((header, index) => (
                                            <MenuItem key={index} value={header}>{header}</MenuItem>))}
                                    </Select>
                                </FormControl>
                                {console.log(errors, fieldErrors)}
                                {errors.selectedHeaders?.symbol?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {errors.selectedHeaders?.symbol?.message.toString()}
                                    </Typography>
                                )}

                                {fieldErrors.selectedHeaders?.symbol?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.selectedHeaders?.symbol?.message.toString()}
                                    </Typography>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{display: data.identification !== 2 ? 'none' : ''}}>
                            <TableCell>{t("EAN")}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <InputLabel id="ean-label">Kolumna</InputLabel>
                                    <Select
                                        labelId="ean-label"
                                        id="ean"
                                        label="Kolumna"
                                        variant={"outlined"}
                                        value={data.selectedHeaders.ean}
                                        onChange={(e) => changeSelectedHeader("ean", e.target.value)}
                                    >
                                        {data.headersFromFile.map((header, index) => (
                                            <MenuItem key={index} value={header}>{header}</MenuItem>))}
                                    </Select>
                                </FormControl>

                                {errors.selectedHeaders?.ean?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {errors.selectedHeaders.ean?.message.toString()}
                                    </Typography>
                                )}

                                {fieldErrors.selectedHeaders?.ean?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.selectedHeaders?.ean?.message.toString()}
                                    </Typography>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("Quantity")}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <InputLabel id="quantity-label">Kolumna</InputLabel>
                                    <Select
                                        labelId="quantity-label"
                                        id="quantity"
                                        label="Kolumna"
                                        variant={"outlined"}
                                        value={data.selectedHeaders.quantity}
                                        onChange={(e) => changeSelectedHeader("quantity", e.target.value)}
                                    >
                                        {data.headersFromFile.map((header, index) => (
                                            <MenuItem key={index} value={header}>{header}</MenuItem>))}
                                    </Select>
                                </FormControl>

                                {errors.selectedHeaders?.quantity?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {errors.selectedHeaders?.quantity?.message.toString()}
                                    </Typography>
                                )}

                                {fieldErrors.selectedHeaders?.quantity?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.selectedHeaders?.quantity?.message.toString()}
                                    </Typography>
                                )}
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
