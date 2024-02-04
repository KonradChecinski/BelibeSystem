import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Button,
    Fade,
    TextField,
    Typography
} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";
import {useBasicClientInfoForm} from "@/Components/Pages/Client/BasicClientInfoComponent/form/useBasicClientInfoForm";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ClientFindGusDialog from "@/Components/Dialogs/ClientDialog/ClientFindGusDialog";

export default function BasicClientInfoComponent(props) {
    const [edited, setEdited] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    console.log("Propsy: ", props)

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
    } = useBasicClientInfoForm()

    const {data, setData, processing, post} = useForm({
        'id': 1,
        'nip': "5914531171",
        'name': "test",

        "country": "test2",
        "city": "test",
        "zip_code": "44-122",
        "street": "Szarych Szeregów",
        "house_number": "2",
        "apartment_number": "13",

        "phone": "123456789",
        "email": "test@gmail.com"
    })

    const initializeFieldValues = () => {
        setValue("nip", data.nip)
        setValue("name", data.name)

        setValue("country", data.country)
        setValue("city", data.city)
        setValue("zip_code", data.zip_code)
        setValue("street", data.street)
        setValue("house_number", data.house_number)
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
            'id': 1,
            'nip': "5914531171",
            'name': "test",
            "country": "test2",
            "city": "test",
            "zip_code": "44-122",
            "street": "Szarych Szeregów",
            "house_number": "2",
            "apartment_number": "13",
            "phone": "123456789",
            "email": "test@gmail.com"
        });

        initializeFieldValues()
        setEdited(false);
    };
    const saveBasic = () => {
        // post(route("system.products.model.update.basic", {productModel: data.id}), {
        //     onSuccess: params => {
        //         setEdited(false);
        //         enqueueSnackbar("Zapisano Podstawowe informację", {variant: 'success'})
        //     },
        //     onError: params => {
        //         console.error(params)
        //         enqueueSnackbar("Błąd przy zapisywaniu podstawowych informacji", {variant: 'error'})
        //     },
        //     preserveScroll: true
        // })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <ClientFindGusDialog open={dialogOpen} setOpen={setDialogOpen}/>

            <Box sx={{display: "flex", flexDirection: "column", gap: 8}}>
                <Button
                    variant="outlined"
                    startIcon={<PersonSearchIcon/>}
                    sx={{mt: 1}}
                    onClick={() => {
                        setDialogOpen(true)
                    }}
                >
                    Uzupełnij dane adresowe z GUS
                </Button>

                <Box>
                    <Typography
                        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                        <InfoIcon fontSize={"large"}/>
                        Informacje podstawowe
                    </Typography>

                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 5}}>
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
                                // inputProps={{readOnly: !props.editing}}
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
                                // inputProps={{readOnly: !props.editing}}
                                       sx={{width: "30ch"}}/>
                            {fieldErrors.name?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.name?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Typography
                        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                        <HomeIcon fontSize={"large"}/>
                        Informacje adresowe
                    </Typography>

                    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>

                        <Autocomplete
                            id="country"
                            // options={params.b2c.color.map(e => ({
                            //     id: e.id,
                            //     name: e.name,
                            //     label: e.name
                            // }))}
                            options={["test1", "test2", "test3"]}
                            sx={{width: "30ch"}}
                            value={data.country}
                            // isOptionEqualToValue={(option, value) => option.id === value.id}
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

                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 5}}>
                            <Box>
                                <TextField id="zip_code" label="Kod pocztowy" variant="outlined"
                                           value={data.zip_code}
                                           {...register("zip_code")}
                                           color={fieldErrors.zip_code?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("zip_code", value.target.value)
                                               setEdited(true)
                                           }}
                                    // inputProps={{readOnly: !props.editing}}
                                           sx={{width: "30ch"}}/>
                                {fieldErrors.zip_code?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.zip_code?.message.toString()}
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
                                    // inputProps={{readOnly: !props.editing}}
                                           sx={{width: "30ch"}}/>
                                {fieldErrors.city?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.city?.message.toString()}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 5}}>
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
                                    // inputProps={{readOnly: !props.editing}}
                                           sx={{width: "30ch"}}/>
                                {fieldErrors.street?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.street?.message.toString()}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <TextField id="house_number" label="Numer budynku" variant="outlined"
                                           type={"number"}
                                           value={data.house_number}
                                           {...register("house_number")}
                                           color={fieldErrors.city?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("house_number", value.target.value)
                                               setEdited(true)
                                           }}
                                    // inputProps={{readOnly: !props.editing}}
                                           inputProps={{style: {textAlign: 'center'}}}
                                           sx={{width: "12.5ch"}}/>
                                {fieldErrors.house_number?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.house_number?.message.toString()}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <TextField id="apartment_number" label="Numer lokalu" variant="outlined"
                                           type={"number"}
                                           value={data.apartment_number}
                                           {...register("apartment_number")}
                                           color={fieldErrors.city?.message ? "error" : null}
                                           onChange={(value) => {
                                               // setProductModel({...productModel, name: value.target.value});
                                               setData("apartment_number", value.target.value)
                                               setEdited(true)
                                           }}
                                    // inputProps={{readOnly: !props.editing}}
                                           inputProps={{style: {textAlign: 'center'}}}
                                           InputLabelProps={{shrink: true}}
                                           sx={{width: "12.5ch"}}/>
                                {fieldErrors.apartment_number?.message && (
                                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                                        {fieldErrors.apartment_number?.message.toString()}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>

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
                                // inputProps={{readOnly: !props.editing}}
                                       sx={{width: "30ch"}}/>
                            {fieldErrors.phone?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.phone?.message.toString()}
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField id="email" label="Adresy Email" variant="outlined"
                                       value={data.name}
                                       {...register("email")}
                                       color={fieldErrors.email?.message ? "error" : null}
                                       onChange={(value) => {
                                           // setProductModel({...productModel, name: value.target.value});
                                           setData("email", value.target.value)
                                           setEdited(true)
                                       }}
                                // inputProps={{readOnly: !props.editing}}
                                       sx={{width: "30ch"}}/>
                            {fieldErrors.name?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {fieldErrors.email?.message.toString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>


                <Fade in={edited}>
                    <Button type="submit" variant="outlined" startIcon={<Save/>}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 230,
                            }}>
                        Zapisz
                    </Button>
                </Fade>
                <Fade in={edited}>
                    <Button variant="outlined" startIcon={<Cancel/>}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 335,
                            }}
                            onClick={resetForm}
                    >
                        Cofnij zmiany
                    </Button>
                </Fade>
            </Box>

            {/*<Box sx={{display: "flex", flexWrap: "wrap", gap: 5, mt: 2}}>*/}
            {/*    <Box>*/}
            {/*        <TextField id="symbol" label="Symbol" variant="outlined"*/}
            {/*                   value={data.symbol}*/}
            {/*                   disabled={true}*/}
            {/*                   inputProps={{readOnly: !props.editing}}*/}
            {/*            // onChange={(value) => {*/}
            {/*            //     setProductModel({...productModel, symbol: value.target.value});*/}
            {/*            // }}*/}
            {/*                   sx={{width: "30ch"}}/>*/}
            {/*    </Box>*/}
            {/*    <Box>*/}
            {/*        <TextField id="quantity" label="Stan" variant="outlined"*/}
            {/*                   value={countQuantityInModel()}*/}
            {/*                   type="number"*/}
            {/*                   inputProps={{readOnly: true}}*/}
            {/*                   disabled={true}*/}
            {/*                   sx={{width: "10ch"}}*/}
            {/*        />*/}
            {/*    </Box>*/}
            {/*    <Box sx={{display: "flex", flexDirection: "column"}}>*/}
            {/*        <TextField id="name" label="Nazwa" variant="outlined"*/}
            {/*                   defaultValue={data.name}*/}
            {/*                   {...register("name")}*/}
            {/*                   color={fieldErrors.name?.message ? "error" : null}*/}
            {/*                   onChange={(value) => {*/}
            {/*                       // setProductModel({...productModel, name: value.target.value});*/}
            {/*                       setData("name", value.target.value)*/}
            {/*                       setEdited(true)*/}
            {/*                   }}*/}
            {/*                   inputProps={{readOnly: !props.editing}}*/}
            {/*                   sx={{width: "30ch"}}/>*/}
            {/*        {fieldErrors.name?.message && (*/}
            {/*            <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
            {/*                {fieldErrors.name?.message.toString()}*/}
            {/*            </Typography>*/}
            {/*        )}*/}
            {/*    </Box>*/}

            {/*    <Box>*/}
            {/*        <FormControl sx={{width: "30ch", display: "flex", flexDirection: "column"}}>*/}
            {/*            <InputLabel id="brand-select-label">Marka</InputLabel>*/}
            {/*            <Select*/}
            {/*                labelId="brand-select-label"*/}
            {/*                id="brand-select"*/}
            {/*                label="Marka"*/}
            {/*                value={data.product_brand_id}*/}
            {/*                color={fieldErrors.brand?.message ? "error" : null}*/}
            {/*                {...register("brand")}*/}
            {/*                onChange={(value) => {*/}
            {/*                    // setProductModel({...productModel, product_group_id: value.target.value});*/}
            {/*                    setData("product_brand_id", value.target.value)*/}
            {/*                    setEdited(true)*/}
            {/*                }}*/}

            {/*                // disabled={!props.editing}*/}
            {/*                inputProps={{readOnly: !props.editing}}*/}
            {/*            >*/}
            {/*                {props.brand.map((brand) => {*/}
            {/*                    return (*/}
            {/*                        <MenuItem key={brand.id} value={brand.id}>*/}
            {/*                            {brand.name}*/}
            {/*                        </MenuItem>*/}
            {/*                    );*/}
            {/*                })}*/}
            {/*            </Select>*/}
            {/*            {fieldErrors.brand?.message && (*/}
            {/*                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>*/}
            {/*                    {fieldErrors.brand?.message.toString()}*/}
            {/*                </Typography>*/}
            {/*            )}*/}

            {/*        </FormControl>*/}
            {/*    </Box>*/}

            {/*    <Fade in={edited}>*/}
            {/*        <Button type="submit" variant="outlined" startIcon={<Save/>}*/}
            {/*                disabled={processing}*/}
            {/*                sx={{*/}
            {/*                    position: "absolute",*/}
            {/*                    top: 7,*/}
            {/*                    right: 230,*/}
            {/*                }}>*/}
            {/*            Zapisz*/}
            {/*        </Button>*/}
            {/*    </Fade>*/}
            {/*</Box>*/}

        </form>
    );
}
