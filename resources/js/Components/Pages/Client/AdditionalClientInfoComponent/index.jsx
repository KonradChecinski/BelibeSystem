import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Checkbox,
    Divider,
    Fade,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {Cancel, CheckBox, CheckBoxOutlineBlank, Handshake, Mail, Save} from "@mui/icons-material";
import {
    useAdditionalClientInfoForm
} from "@/Components/Pages/Client/AdditionalClientInfoComponent/form/useAdditionalClientInfoForm";
import {enqueueSnackbar} from "notistack";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


export default function AdditionalClientInfoComponent(props) {
    const theme = useTheme();
    const xlBreakpointUp = useMediaQuery(theme.breakpoints.up("xl"));

    const [edited, setEdited] = useState(false);

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors,
        getValues
    } = useAdditionalClientInfoForm()

    const {data, setData, processing, post} = useForm({
        'id': props.client.id,
        'status': props.client.status,
        'priority': props.client.priority,
        'source_of_acquisition': props.client.source_of_acquisition,
        'industry': props.client.industry,
        'payments': props.client.payments ? props.client.payments
            .slice()
            .sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0)
            .map(obj => ({
                ...obj,
                label: obj.name
            })) : [],
        'account_manager': props.client.account_manager,
        'blacklist': props.client.blacklist,
        'newsletter': props.client.newsletter,
        'settlements_mail': props.client.settlements_mail,
    })

    const [checkedBlacklist, setCheckedBlacklist] = useState(props.client.blacklist !== 0);
    const [checkedNewsletter, setCheckedNewsletter] = useState(props.client.newsletter !== 0);
    const [checkedSettlementsMail, setCheckedSettlementsMail] = useState(props.client.settlements_mail !== 0);

    const initializeFieldValues = () => {
        setValue('id', data.id)
        setValue('status', data.status.name)
        setValue('priority', data.priority === 1 ? "Niski" : data.priority === 2 ? "Średni" : "Wysoki")
        setValue('source_of_acquisition', data.source_of_acquisition.name)
        setValue('industry', data.industry.name)
        setValue('payments', data.payments ? data.payments : [])
        setValue('account_manager', data.account_manager.name)
    }

    useEffect(() => {
        // inicjacja wartości pól
        initializeFieldValues()
    }, [setValue]);

    const onSubmit = (formData) => {
        saveBasic()
    }

    const resetForm = () => {
        setData({
            'id': props.client.id,
            'status': props.client.status,
            'priority': props.client.priority,
            'source_of_acquisition': props.client.source_of_acquisition,
            'industry': props.client.industry,
            'payments': props.client.payments ? props.client.payments.map(obj => ({...obj, label: obj.name})) : [],
            'account_manager': props.client.account_manager,
            'blacklist': props.client.blacklist,
            'newsletter': props.client.newsletter,
            'settlements_mail': props.client.settlements_mail,
        });

        initializeFieldValues()
        setCheckedBlacklist(props.client.blacklist !== 0)
        setCheckedNewsletter(props.client.newsletter !== 0)
        setEdited(false);

        clearErrors('status')
        clearErrors('priority')
        clearErrors('source_of_acquisition')
        clearErrors('industry')
        clearErrors('payments')
        clearErrors('account_manager')
        clearErrors('blacklist')
        clearErrors('newsletter')
        clearErrors('settlements_mail')
    };
    const saveBasic = () => {
        post(route("system.clients.client.update.additional", {client: data.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano dodatkowe informację", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu dodatkowych informacji", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Box sx={{display: "flex", flexDirection: "column", gap: 8}}>
                <Box>
                    {(xlBreakpointUp && props.editing) && (
                        <Box sx={{display: "flex", gap: 2, mb: 2, mt: -1}}>
                            <Fade in={edited}>
                                <Tooltip title={"Zapisz"}>
                                    <IconButton
                                        type="submit"
                                        color="success"
                                        size={"small"}
                                        disabled={processing}
                                    >
                                        <Save fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>

                            </Fade>
                            <Fade in={edited}>
                                <Tooltip title={"Cofnij zmiany"}>
                                    <IconButton
                                        color="error"
                                        size={"small"}
                                        disabled={processing}
                                        onClick={resetForm}
                                    >
                                        <Cancel fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>
                            </Fade>
                        </Box>
                    )}

                    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="status"
                                    options={props.status.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "28ch"}}
                                    value={data.status.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            status: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Status"
                                            sx={{my: 1}}
                                            {...register("status")}
                                            value={data.status.name}
                                            color={fieldErrors.status?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.status?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.status?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="status"
                                label="Status"
                                sx={{my: 1, width: "28ch"}}
                                {...register("status")}
                                color={fieldErrors.status?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        <FormControl
                            sx={{
                                ml: 2,
                                width: "28ch",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: 'flex-start'
                            }}
                        >
                            <FormControlLabel
                                label={<Typography>Czarna lista</Typography>}
                                control={
                                    <Checkbox
                                        id="blacklist-select"
                                        label="Czarna lista"
                                        size={"large"}
                                        disabled={!props.editing}
                                        checked={checkedBlacklist}
                                        onChange={(value) => {
                                            // setProductModel({...productModel, product_group_id: value.target.value});
                                            setCheckedBlacklist(value.target.checked)
                                            setData({
                                                ...data,
                                                blacklist: value.target.checked ? 1 : 0,
                                            })
                                            setEdited(true)
                                        }}
                                    />
                                }
                            />
                            {fieldErrors.blacklist?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                    {fieldErrors.blacklist?.message.toString()}
                                </Typography>
                            )}
                        </FormControl>
                        <Divider/>

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="account_manager"
                                    options={props.user.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "28ch"}}
                                    value={data.account_manager.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            account_manager: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Opiekun klienta"
                                            sx={{my: 1}}
                                            {...register("account_manager")}
                                            value={data.account_manager.name}
                                            color={fieldErrors.account_manager?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.account_manager?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.account_manager?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="account_manager"
                                label="Opiekun klienta"
                                sx={{my: 1, width: "28ch"}}
                                {...register("account_manager")}
                                inputProps={{readOnly: true}}
                            />
                        )}
                        <Divider/>

                        {props.editing ? (
                            <>
                                <FormControl sx={{width: "28ch", display: "flex", flexDirection: "column"}}>
                                    <InputLabel id="priority-select-label">Priorytet</InputLabel>
                                    <Select
                                        id="priority-select"
                                        labelId="priority-select-label"
                                        label="Priorytet"
                                        value={data.priority}
                                        color={fieldErrors.priority?.message ? "error" : null}
                                        {...register("priority")}
                                        onChange={(value) => {
                                            // setProductModel({...productModel, product_group_id: value.target.value});
                                            setData({
                                                ...data,
                                                priority: value.target.value,
                                            })
                                            setEdited(true)
                                        }}

                                        // disabled={!props.editing}
                                        inputProps={{readOnly: !props.editing}}
                                    >
                                        <MenuItem key={1} value={1}>
                                            {"Niski"}
                                        </MenuItem>,
                                        <MenuItem key={2} value={2}>
                                            {"Średni"}
                                        </MenuItem>,
                                        <MenuItem key={3} value={3}>
                                            {"Wysoki"}
                                        </MenuItem>
                                    </Select>
                                    {fieldErrors.priority?.message && (
                                        <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                            {fieldErrors.priority?.message.toString()}
                                        </Typography>
                                    )}
                                </FormControl>
                            </>
                        ) : (
                            <TextField
                                id="priority-select"
                                label="Priorytet"
                                sx={{my: 1, width: "28ch"}}
                                {...register("priority")}
                                color={fieldErrors.priority?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="source_of_acquisition"
                                    options={props.sourceOfAcquisition.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "28ch"}}
                                    value={data.source_of_acquisition.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            source_of_acquisition: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Źródło pozyskania"
                                            sx={{my: 1}}
                                            {...register("source_of_acquisition")}
                                            value={data.source_of_acquisition.name}
                                            color={fieldErrors.source_of_acquisition?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.source_of_acquisition?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.source_of_acquisition?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="source_of_acquisition"
                                label="Źródło pozyskania"
                                sx={{my: 1, width: "25ch"}}
                                {...register("source_of_acquisition")}
                                color={fieldErrors.source_of_acquisition?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="industry"
                                    options={props.industry.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "28ch"}}
                                    value={data.industry.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            industry: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Branża"
                                            sx={{my: 1}}
                                            {...register("industry")}
                                            value={data.industry.name}
                                            color={fieldErrors.industry?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.industry?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.industry?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="industry"
                                label="Branża"
                                sx={{my: 1, width: "28ch"}}
                                {...register("industry")}
                                color={fieldErrors.industry?.message && "error"}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        <Divider/>

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="payments"
                                    multiple
                                    disableCloseOnSelect
                                    options={props.payment.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    sx={{width: "28ch"}}
                                    value={data.payments}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            payments: value.slice()
                                                .sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0)
                                            ,
                                        })
                                        setValue('payments', value, {shouldValidate: true})
                                        setEdited(true)
                                        // console.log("formValues: ", getValues("payments"))
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option, {selected}) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlank fontSize="small"/>}
                                                checkedIcon={<CheckBox fontSize="small"/>}
                                                style={{marginRight: 8}}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Płatność"
                                            sx={{my: 1}}
                                            {...register("payments")}
                                            // value={data.payment.name}
                                            color={fieldErrors.payments?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.payments?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -3, mb: 1.5}}>
                                        {fieldErrors.payments?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField
                                id="payments"
                                label="Płatność"
                                sx={{my: 1, width: "25ch"}}
                                {...register("payments")}
                                inputProps={{readOnly: true}}
                            />
                        )}

                        <Divider/>

                        <Typography
                            sx={{mb: 1, display: "flex", gap: 1, alignItems: "center"}}>
                            <Handshake fontSize={"large"}/>

                            Zgody marketingowe
                        </Typography>

                        <FormControl
                            sx={{
                                ml: 2,
                                width: "25ch",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: 'flex-start'
                            }}
                        >
                            <FormControlLabel
                                label={<Typography>Newsletter</Typography>}
                                control={
                                    <Checkbox
                                        id="newsletter-select"
                                        label="Newsletter"
                                        size={"large"}
                                        disabled={!props.editing}
                                        checked={checkedNewsletter}
                                        onChange={(value) => {
                                            // setProductModel({...productModel, product_group_id: value.target.value});
                                            setCheckedNewsletter(value.target.checked)
                                            setData({
                                                ...data,
                                                newsletter: value.target.checked ? 1 : 0,
                                            })
                                            setEdited(true)
                                        }}
                                    />
                                }
                            />
                            {fieldErrors.newsletter?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                    {fieldErrors.newsletter?.message.toString()}
                                </Typography>
                            )}
                        </FormControl>

                        <Divider/>

                        <Typography
                            sx={{mb: 1, display: "flex", gap: 1, alignItems: "center"}}>
                            <Mail fontSize={"large"}/>

                            Mailing
                        </Typography>

                        <FormControl
                            sx={{
                                ml: 2,
                                width: "25ch",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: 'flex-start'
                            }}
                        >
                            <FormControlLabel
                                label={<Typography>Rozliczenia</Typography>}
                                control={
                                    <Checkbox
                                        id="settlements_mail-checkbox"
                                        label="Rozliczenia"
                                        size={"large"}
                                        disabled={!props.editing}
                                        checked={checkedSettlementsMail}
                                        onChange={(value) => {
                                            // setProductModel({...productModel, product_group_id: value.target.value});
                                            setCheckedSettlementsMail(value.target.checked)
                                            setData({
                                                ...data,
                                                settlements_mail: value.target.checked ? 1 : 0,
                                            })
                                            setEdited(true)
                                        }}
                                    />
                                }
                            />
                            {fieldErrors.settlements_mail?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                    {fieldErrors.settlements_mail?.message.toString()}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                </Box>

                {!xlBreakpointUp && (
                    <>
                        <Fade in={edited}>
                            <Tooltip title={"Zapisz"}>
                                <IconButton
                                    type="submit"
                                    color="success"
                                    size={"small"}
                                    disabled={processing}
                                    sx={{
                                        position: "absolute",
                                        top: xlBreakpointUp ? 35 : 7,
                                        right: 220,
                                    }}>
                                    <Save fontSize={"large"}/>
                                </IconButton>
                            </Tooltip>

                        </Fade>
                        <Fade in={edited}>
                            <Tooltip title={"Cofnij zmiany"}>
                                <IconButton
                                    color="error"
                                    size={"small"}
                                    disabled={processing}
                                    onClick={resetForm}
                                    sx={{
                                        position: "absolute",
                                        top: xlBreakpointUp ? 35 : 7,
                                        right: 270,
                                    }}
                                >
                                    <Cancel fontSize={"large"}/>
                                </IconButton>
                            </Tooltip>
                        </Fade>
                    </>
                )}
            </Box>
        </form>
    );
}
