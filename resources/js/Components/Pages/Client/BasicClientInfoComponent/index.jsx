import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Button, Divider,
    Fade, IconButton,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";
import {useBasicClientInfoForm} from "@/Components/Pages/Client/BasicClientInfoComponent/form/useBasicClientInfoForm";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ClientFindGusDialog from "@/Components/Dialogs/ClientDialog/ClientFindGusDialog";
import {enqueueSnackbar} from "notistack";

export default function BasicClientInfoComponent(props) {
    const [edited, setEdited] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // console.log("Propsy: ", props)

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors,
    } = useBasicClientInfoForm()

    const {data, setData, processing, post} = useForm({
        'id': props.client.id,
        'nip': props.client.nip,
        'name': props.client.name,

        "country": props.client.country,
        "city": props.client.city,
        "postal_code": props.client.postal_code,
        "street": props.client.street,
        "building_number": props.client.building_number,
        "apartment_number": props.client.apartment_number ? props.client.apartment_number : '',

        "phone": props.client.phone,
        "email": props.client.email
    })

    const initializeFieldValues = () => {
        setValue("nip", data.nip)
        setValue("name", data.name)

        setValue("country", data.country.name)
        setValue("city", data.city)
        setValue("postal_code", data.postal_code)
        setValue("street", data.street)
        setValue("building_number", data.building_number)
        setValue("apartment_number", data.apartment_number)

        setValue("phone", data.phone)
        setValue("email", data.email)
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
            'nip': props.client.nip,
            'name': props.client.name,

            "country": props.client.country,
            "city": props.client.city,
            "postal_code": props.client.postal_code,
            "street": props.client.street,
            "building_number": props.client.building_number,
            "apartment_number": props.client.apartment_number ? props.client.apartment_number : '',

            "phone": props.client.phone,
            "email": props.client.email
        });

        initializeFieldValues()
        setEdited(false);

        clearErrors('nip')
        clearErrors('name')
        clearErrors('country')
        clearErrors('city')
        clearErrors('postal_code')
        clearErrors('street')
        clearErrors('building_number')
        clearErrors('apartment_number')
        clearErrors('phone')
        clearErrors('email')
    };
    const saveBasic = () => {
        post(route("system.clients.client.update.basic", {client: data.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano Podstawowe informację", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu podstawowych informacji", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <ClientFindGusDialog open={dialogOpen} setOpen={setDialogOpen} nip={data.nip}/>

            <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                {/*    {props.editing ? (*/}
                {/*        <Button*/}
                {/*            variant="outlined"*/}
                {/*            startIcon={<PersonSearchIcon/>}*/}
                {/*            sx={{mt: 1, height: 40}}*/}
                {/*            onClick={() => {*/}
                {/*                setDialogOpen(true)*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            Uzupełnij dane adresowe z GUS*/}
                {/*        </Button>*/}
                {/*    ) : null*/}
                {/*    }*/}

                <Box>
                    {/*<Typography*/}
                    {/*    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>*/}
                    {/*    <InfoIcon fontSize={"large"}/>*/}
                    {/*    Informacje podstawowe*/}
                    {/*</Typography>*/}

                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 5, mt: 2, flexDirection: "column"}}>
                        <Box>
                            <TextField id="nip" label="NIP" variant="outlined"
                                       value={data.nip}
                                       {...register("nip")}
                                       color={fieldErrors.name?.message ? "error" : null}
                                       onChange={(value) => {
                                           // setProductModel({...productModel, name: value.target.value});
                                           setData("nip", value.target.value)
                                           setEdited(true)
                                       }}
                                       disabled={true}
                                       inputProps={{readOnly: !props.editing}}
                                       sx={{width: "30ch"}}/>
                            {fieldErrors.nip?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.nip?.message.toString()}
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField id="name" label="Nazwa" variant="outlined"
                                       value={data.name}
                                       {...register("name")}
                                       color={fieldErrors.name?.message ? "error" : null}
                                       onChange={(value) => {
                                           // setProductModel({...productModel, name: value.target.value});
                                           setData("name", value.target.value)
                                           setEdited(true)
                                       }}
                                       inputProps={{readOnly: !props.editing}}
                                       sx={{width: 1}}/>
                            {fieldErrors.name?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.name?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Divider/>
                <Box>
                    <Typography
                        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                        <HomeIcon fontSize={"large"}/>
                        Informacje adresowe
                    </Typography>

                    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>

                        {props.editing ? (
                            <>
                                <Autocomplete
                                    id="country"
                                    options={props.country.map(e => ({
                                        id: e.id,
                                        name: e.name,
                                        label: e.name
                                    }))}
                                    // options={["test1", "test2", "test3"]}
                                    sx={{width: "25ch"}}
                                    value={data.country.name}
                                    isOptionEqualToValue={(option, value) => option.name === value}
                                    onChange={(e, value) => {
                                        setData({
                                            ...data,
                                            country: value,
                                        })
                                        setEdited(true)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Kraj"
                                            sx={{my: 1}}
                                            {...register("country")}
                                            value={data.country}
                                            color={fieldErrors.country?.message && "error"}
                                        />
                                    }
                                />
                                {fieldErrors.country?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                        {fieldErrors.country?.message.toString()}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <TextField id="country" label="Kraj" variant="outlined"
                                       {...register("country")}
                                       inputProps={{readOnly: true}}
                                       sx={{width: "30ch"}}/>
                        )}

                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                            <Box>
                                <TextField id="street" label="Ulica" variant="outlined"
                                           value={data.street}
                                           {...register("street")}
                                           color={fieldErrors.street?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("street", value.target.value)
                                               setEdited(true)
                                           }}
                                           inputProps={{readOnly: !props.editing}}
                                           sx={{width: "32ch"}}/>
                                {fieldErrors.street?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.street?.message.toString()}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <TextField id="building_number" label="Numer budynku" variant="outlined"
                                           value={data.building_number}
                                           {...register("building_number")}
                                           color={fieldErrors.building_number?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("building_number", value.target.value)
                                               setEdited(true)
                                           }}
                                           inputProps={{style: {textAlign: 'center'}, readOnly: !props.editing}}
                                           sx={{width: "12.5ch"}}/>
                                {fieldErrors.building_number?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.building_number?.message.toString()}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <TextField id="apartment_number" label="Numer lokalu" variant="outlined"
                                           value={data.apartment_number ? data.apartment_number : ""}
                                           {...register("apartment_number")}
                                           color={fieldErrors.city?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("apartment_number", value.target.value)
                                               setEdited(true)
                                           }}
                                           inputProps={{style: {textAlign: 'center'}, readOnly: !props.editing}}
                                           InputLabelProps={{shrink: true}}
                                           sx={{width: "12.5ch"}}/>
                                {fieldErrors.apartment_number?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.apartment_number?.message.toString()}
                                    </Typography>
                                )}
                            </Box>
                        </Box>


                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 5}}>
                            <Box>
                                <TextField id="postal_code" label="Kod pocztowy" variant="outlined"
                                           value={data.postal_code}
                                           {...register("postal_code")}
                                           color={fieldErrors.postal_code?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("postal_code", value.target.value)
                                               setEdited(true)
                                           }}
                                           inputProps={{readOnly: !props.editing}}
                                           sx={{width: "15ch"}}/>
                                {fieldErrors.postal_code?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.postal_code?.message.toString()}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <TextField id="city" label="Miasto" variant="outlined"
                                           value={data.city}
                                           {...register("city")}
                                           color={fieldErrors.city?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("city", value.target.value)
                                               setEdited(true)
                                           }}
                                           inputProps={{readOnly: !props.editing}}
                                           sx={{width: "35ch"}}/>
                                {fieldErrors.city?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.city?.message.toString()}
                                    </Typography>
                                )}
                            </Box>
                        </Box>


                    </Box>
                </Box>
                <Divider/>
                <Box>
                    <Typography
                        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                        <PhoneIcon fontSize={"large"}/>
                        Informacje kontaktowe
                    </Typography>

                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 5}}>
                        <Box>
                            <TextField id="phone" label="Telefony" variant="outlined"
                                       value={data.phone}
                                       {...register("phone")}
                                       color={fieldErrors.phone?.message ? "error" : null}
                                       onChange={(value) => {
                                           // setProductModel({...productModel, name: value.target.value});
                                           setData("phone", value.target.value)
                                           setEdited(true)
                                       }}
                                       inputProps={{readOnly: !props.editing}}
                                       sx={{width: "35ch"}}/>
                            {fieldErrors.phone?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.phone?.message.toString()}
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField id="email" label="Adres Email" variant="outlined"
                                       value={data.email}
                                       {...register("email")}
                                       color={fieldErrors.email?.message ? "error" : null}
                                       onChange={(value) => {
                                           // setProductModel({...productModel, name: value.target.value});
                                           setData("email", value.target.value)
                                           setEdited(true)
                                       }}
                                       inputProps={{readOnly: !props.editing}}
                                       sx={{width: "50ch"}}/>
                            {fieldErrors.email?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.email?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>


                <Fade in={edited}>
                    <Tooltip title={"Zapisz"}>
                        <IconButton
                            type="submit"
                            color="success"
                            size={"small"}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 230,
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
                                top: 7,
                                right: 280,
                            }}
                        >
                            <Cancel fontSize={"large"}/>
                        </IconButton>
                    </Tooltip>
                </Fade>
            </Box>
        </form>
    );
}
