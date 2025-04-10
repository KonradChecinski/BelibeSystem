import {Head, Link, router, useForm} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    ButtonGroup, debounce, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem,
    Paper, Radio, RadioGroup, Select,
    Step,
    StepLabel,
    Stepper, Switch,
    Table, TableBody, TableCell, TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {DropzoneArea} from "mui-file-dropzone";
import {useImportItemsStep1Form} from "@/Components/Dialogs/ImportItemDialog/ImportItems/form/useImportItemsStep1Form";
import {useImportItemsStep2Form} from "@/Components/Dialogs/ImportItemDialog/ImportItems/form/useImportItemsStep2Form";
import {useImportItemsStep3Form} from "@/Components/Dialogs/ImportItemDialog/ImportItems/form/useImportItemsStep3Form";
import {keyframes} from "@emotion/css";

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
                        <Step1 data={data} setData={setData} setStep={setStep} post={post} processing={processing}
                               errors={errors}/>
                    )}

                    {step === 1 && (
                        <Step2 data={data} setData={setData} setStep={setStep} post={post} processing={processing}
                               errors={errors}/>
                    )}

                    {step === 2 && (
                        <Step3 data={data} setData={setData} setStep={setStep} post={post} processing={processing}
                               errors={errors} props={props}/>
                    )}

                </Paper>
            </Box>
        </ClientLayout>
    );
}


function Step1({data, setData, setStep, post, processing, errors}) {
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
                    <Button type={"submit"} disabled={processing}>Dalej</Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}


function Step2({data, setData, setStep, post, processing, errors}) {
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
        setValue('selectedHeaders', data.selectedHeaders)
    }, []);

    useEffect(() => {
        setValue("identification", data.identification)
    }, [data.identification]);

    const onSubmit = (submitData, e) => {
        e.preventDefault()
        post(
            route('b2b.import.items.getItemsFromFile'),
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log(page.props.itemsFromFile)
                    setData("items", page.props.itemsFromFile);
                    setStep(2)
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy odczytywaniu pliku", {variant: 'error'})
                    for (const errorsKey in errors) {
                        enqueueSnackbar(errors[errorsKey].toString(), {variant: 'error'})
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
                                        value={data.selectedHeaders.symbol ? data.selectedHeaders.symbol : ""}
                                        onChange={(e) => changeSelectedHeader("symbol", e.target.value)}
                                    >
                                        {data.headersFromFile.map((header, index) => (
                                            <MenuItem key={index} value={header}>{header}</MenuItem>))}
                                    </Select>
                                </FormControl>
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
                                        value={data.selectedHeaders.ean ? data.selectedHeaders.ean : ""}
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
                                        value={data.selectedHeaders.quantity ? data.selectedHeaders.quantity : ""}
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
                    <Button type={"submit"} disabled={processing}>Dalej</Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}


function Step3({data, setData, setStep, post, processing, errors, props}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
        control
    } = useImportItemsStep3Form()

    useEffect(() => {
        setValue('items', data.items)
    }, []);

    const onSubmit = (submitData, e) => {
        e.preventDefault()
        post(
            route('b2b.import.items.store'),
            {
                preserveScroll: true,
                onSuccess: (page) => {
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy imporcie produktów", {variant: 'error'})
                    for (const errorsKey in errors) {
                        enqueueSnackbar(errors[errorsKey].toString(), {variant: 'error'})
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

            <Box
                sx={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    width: 1,
                    minHeight: 200,
                    height: "100%", // Dopasowanie do rodzica
                    maxHeight: "calc(100vh - 420px)", // Opcjonalnie, ograniczenie wysokości
                }}>
                <TableContainer component={Paper} sx={{overflowX: "initial", width: 1}}>
                    <Table aria-label="import product table"
                           stickyHeader={true}
                           sx={{
                               "& th": {
                                   top: 0,
                               },
                               "& th:first-of-type": {
                                   borderRadius: 1,
                                   borderBottomRightRadius: 0,
                                   borderTopRightRadius: 0,
                                   borderTopLeftRadius: 0,
                               },
                               "& th:last-of-type": {
                                   borderRadius: 1,
                                   borderBottomLeftRadius: 0,
                                   borderTopLeftRadius: 0,
                                   borderTopRightRadius: 0,
                               },
                           }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align={"center"} sx={{width: 20}}>Lp.</TableCell>
                                <TableCell align={"center"}>{t("Image")}</TableCell>
                                <TableCell>{t("Symbol")}</TableCell>
                                <TableCell>{t("Model")}</TableCell>
                                <TableCell>{t("Color")}</TableCell>
                                <TableCell>{t("Size")}</TableCell>
                                <TableCell align={"center"}>{t("Quantity")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.items.sort((a, b) => a.product.model.symbol.localeCompare(b.product.model.symbol)).map((item, index) => {
                                return (
                                    <TableRow key={item.product.id} hover>
                                        <TableCell align={"center"} sx={{width: 20}}>{index + 1}</TableCell>
                                        <TableCell align={"center"}>
                                            {item.product.color.images[0] ?
                                                (
                                                    <Box component={"img"}
                                                         src={route("images.webp", {slug: item.product.color.images[0].slug})}
                                                         width={50}
                                                         sx={{
                                                             // m: "auto",
                                                             // cursor: "pointer",
                                                             mr: 2
                                                         }}
                                                    />
                                                )
                                                :
                                                (
                                                    <Box component={"img"}
                                                         src={route("images.webp", {slug: "brak.jpg"})}
                                                         width={50}
                                                         sx={{
                                                             // m: "auto",
                                                             // cursor: "pointer",
                                                             mr: 2
                                                         }}
                                                    />
                                                )

                                            }

                                        </TableCell>
                                        <TableCell>{item.product.symbol}</TableCell>
                                        <TableCell>
                                            {item.product.model.symbol} - {item.product.model.name}

                                            {fieldErrors.items?.[index]?.product?.id?.message && (
                                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                                    {fieldErrors.items[index]?.product?.id?.message.toString()}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{item.product.color.shortcut} - {item.product.color.name}</TableCell>
                                        <TableCell>{item.product.size.name}</TableCell>
                                        <TableCell align={"center"}>
                                            <ProductInput product={item.product}
                                                          quantity={item.quantity}
                                                          maxQuantity={item.product.available_without_order_to_edit}
                                                          accountManager={Boolean(props.accountManager)}
                                                          data={data}
                                                          setData={setData}
                                                          setValue={setValue}
                                                          props={props}
                                            />
                                            {/*{errors.items[index]?.message && (*/}
                                            {/*    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                                            {/*        {errors.items[index]?.message.toString()}*/}
                                            {/*    </Typography>*/}
                                            {/*)}*/}

                                            {fieldErrors.items?.[index]?.quantity?.message && (
                                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                                    {fieldErrors.items[index]?.quantity.message.toString()}
                                                </Typography>
                                            )}
                                        </TableCell>

                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{width: 1, display: "flex", justifyContent: "flex-end", gap: 2}}>

                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => setStep(1)}>Wstecz</Button>
                    <Button type={"submit"} disabled={processing}>Importuj</Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}


const ProductInput = ({product, quantity = 0, maxQuantity, accountManager, data, setData, setValue, props}) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [localQuantity, setLocalQuantity] = useState(quantity);

    let quantityText = "";
    let quantityColor = "";
    switch (true) {
        case maxQuantity === 0:
            quantityText = "Brak";
            quantityColor = "error.main";
            break;
        case maxQuantity <= 5:
            quantityText = "Ostatnie sztuki!";
            quantityColor = "warning.main";
            break;
        case maxQuantity <= 10:
            quantityText = "Mała ilość";
            quantityColor = "warning.main";
            break;
        case maxQuantity <= 20:
            quantityText = "Średnia ilość";
            quantityColor = "info.main";
            break;
        default:
            quantityText = "Duża ilość";
            quantityColor = "success.main";
            break;
    }


    // const debouncedSend = useMemo(() => {
    //     return debounce(send, 1000);
    // }, [send]);

    const changeQuantity = (newValue) => {
        const changedValue = data.items.map((item) => {
            if (item.product.id === product.id) {
                console.log(item, newValue)
                item.quantity = Number(newValue);
            }
            return item;
        })
        setData("items", changedValue);
        setValue("items", changedValue);
    }

    const handleOnChange = (e) => {
        let newValue = e.target.value;
        let oldValue = localQuantity;
        if (newValue === "") {
            e.target.value = 0;
            newValue = 0;
        }
        newValue = Number(newValue);
        if (newValue < 0) newValue = 0;
        if (newValue > maxQuantity) {
            newValue = maxQuantity;
            enqueueSnackbar("Maksymalna ilość dla " + product.symbol + " wynosi " + maxQuantity, {variant: 'warning'})
        }
        if (oldValue === newValue) return;

        setLocalQuantity("" + newValue);
        // debouncedSend(newValue, oldValue);
        changeQuantity("" + newValue);
    }

    return (
        <Box>
            <TextField
                id="outlined-basic"
                label="Ilość"
                variant="outlined"
                type={"number"}
                value={localQuantity}
                error={localQuantity > maxQuantity}
                onChange={handleOnChange}
                InputProps={{
                    inputProps: {
                        min: 0,
                        max: maxQuantity,
                        style: {
                            textAlign: "center",
                            fontSize: 13
                        }
                    }
                }}
                sx={{
                    width: 1,
                    minWidth: "14ch",
                    maxWidth: "20ch",
                }}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.5,
                mt: 0.5,
            }}>
                {/*<Typography variant="caption">*/}
                {/*    Dostępność:*/}
                {/*</Typography>*/}
                <Typography variant="body2" sx={{color: quantityColor}}>
                    {quantityText}
                    {/*({quantity})*/}
                    {accountManager && (" (" + product.available_without_order_to_edit + ")")}
                </Typography>
            </Box>

        </Box>
    );
}
