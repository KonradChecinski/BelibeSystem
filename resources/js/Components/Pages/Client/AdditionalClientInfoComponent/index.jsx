import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Button,
    Fade, FormControl, InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";
import {useBasicClientInfoForm} from "@/Components/Pages/Client/BasicClientInfoComponent/form/useBasicClientInfoForm";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
    useAdditionalClientInfoForm
} from "@/Components/Pages/Client/AdditionalClientInfoComponent/form/useAdditionalClientInfoForm";


export default function AdditionalClientInfoComponent(props) {
    const [edited, setEdited] = useState(false);

    console.log("Propsy: ", props)

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors,
    } = useAdditionalClientInfoForm()

    const {data, setData, processing, post} = useForm({
        'status': "active",
        'priority': 1,
        'source': "web",
        'payment': "cash",
        'blacklisted': false,
    })

    const initializeFieldValues = () => {
        setValue('status', data.status)
        setValue('priority', data.priority)
        setValue('source', data.source)
        setValue('payment', data.payment)
        setValue('blacklisted', data.blacklisted)
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
            'status': "active",
            'priority': 1,
            'source': "web",
            'payment': "cash",
            'blacklisted': false,
        });

        initializeFieldValues()
        setEdited(false);

        clearErrors('status')
        clearErrors('priority')
        clearErrors('source')
        clearErrors('payment')
        clearErrors('blacklisted')
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
            <Box sx={{display: "flex", flexDirection: "column", gap: 8}}>
                <Box>
                    <Typography
                        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                        <AddBoxIcon fontSize={"large"}/>
                        Informacje dodatkowe
                    </Typography>

                    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                        <Box>
                            <Autocomplete
                                id="status"
                                // options={params.b2c.color.map(e => ({
                                //     id: e.id,
                                //     name: e.name,
                                //     label: e.name
                                // }))}
                                options={["active", "disabled", "expired"]}
                                sx={{width: "30ch"}}
                                value={data.status}
                                // isOptionEqualToValue={(option, value) => option.id === value.id}
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
                                        value={data.status}
                                        color={fieldErrors.status?.message && "error"}
                                    />
                                }
                            />
                            {fieldErrors.status?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                    {fieldErrors.status?.message.toString()}
                                </Typography>
                            )}
                        </Box>


                        <FormControl sx={{width: "30ch", display: "flex", flexDirection: "column"}}>
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
                                // inputProps={{readOnly: !props.editing}}
                            >
                                {/*{props.brand.map((brand) => {*/}
                                {/*    return (*/}
                                {/*        <MenuItem key={brand.id} value={brand.id}>*/}
                                {/*            {brand.name}*/}
                                {/*        </MenuItem>*/}
                                {/*    );*/}
                                {/*})}*/}

                                <MenuItem key={1} value={1}>
                                    {"niski"}
                                </MenuItem>,
                                <MenuItem key={2} value={2}>
                                    {"średni"}
                                </MenuItem>,
                                <MenuItem key={3} value={3}>
                                    {"wysoki"}
                                </MenuItem>
                            </Select>
                            {fieldErrors.priority?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                    {fieldErrors.priority?.message.toString()}
                                </Typography>
                            )}
                        </FormControl>


                        <Box>
                            <Autocomplete
                                id="source"
                                // options={params.b2c.color.map(e => ({
                                //     id: e.id,
                                //     name: e.name,
                                //     label: e.name
                                // }))}
                                options={["web", "cos", "cos2"]}
                                sx={{width: "30ch"}}
                                value={data.source}
                                // isOptionEqualToValue={(option, value) => option.id === value.id}
                                onChange={(e, value) => {
                                    setData({
                                        ...data,
                                        source: value,
                                    })
                                    setEdited(true)
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        label="Źródło pozyskania"
                                        sx={{my: 1}}
                                        {...register("source")}
                                        value={data.source}
                                        color={fieldErrors.source?.message && "error"}
                                    />
                                }
                            />
                            {fieldErrors.source?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                    {fieldErrors.source?.message.toString()}
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <Autocomplete
                                id="payment"
                                // options={params.b2c.color.map(e => ({
                                //     id: e.id,
                                //     name: e.name,
                                //     label: e.name
                                // }))}
                                options={["cash", "credit card", "cos"]}
                                sx={{width: "30ch"}}
                                value={data.payment}
                                // isOptionEqualToValue={(option, value) => option.id === value.id}
                                onChange={(e, value) => {
                                    setData({
                                        ...data,
                                        payment: value,
                                    })
                                    setEdited(true)
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        label="Płatność"
                                        sx={{my: 1}}
                                        {...register("payment")}
                                        value={data.payment}
                                        color={fieldErrors.payment?.message && "error"}
                                    />
                                }
                            />
                            {fieldErrors.payment?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                                    {fieldErrors.payment?.message.toString()}
                                </Typography>
                            )}
                        </Box>

                        <FormControl sx={{width: "30ch", display: "flex", flexDirection: "column"}}>
                            <InputLabel id="blacklisted-select-label">Czarna lista</InputLabel>
                            <Select
                                id="blacklisted-select"
                                labelId="blacklisted-select-label"
                                label="Czarna lista"
                                value={data.blacklisted}
                                color={fieldErrors.blacklisted?.message ? "error" : null}
                                {...register("blacklisted")}
                                onChange={(value) => {
                                    // setProductModel({...productModel, product_group_id: value.target.value});
                                    setData({
                                        ...data,
                                        blacklisted: value.target.value,
                                    })
                                    setEdited(true)
                                }}

                                // disabled={!props.editing}
                                // inputProps={{readOnly: !props.editing}}
                            >
                                <MenuItem value={true}>
                                    Tak
                                </MenuItem>,
                                <MenuItem value={false}>
                                    Nie
                                </MenuItem>
                            </Select>
                            {fieldErrors.blacklisted?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                    {fieldErrors.blacklisted?.message.toString()}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                </Box>

                {/*<Box>*/}
                {/*    <Typography*/}
                {/*        sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>*/}
                {/*        <HomeIcon fontSize={"large"}/>*/}
                {/*        Informacje adresowe*/}
                {/*    </Typography>*/}

                {/*    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>*/}

                {/*        <Autocomplete*/}
                {/*            id="country"*/}
                {/*            // options={params.b2c.color.map(e => ({*/}
                {/*            //     id: e.id,*/}
                {/*            //     name: e.name,*/}
                {/*            //     label: e.name*/}
                {/*            // }))}*/}
                {/*            options={["test1", "test2", "test3"]}*/}
                {/*            sx={{width: "30ch"}}*/}
                {/*            value={data.country}*/}
                {/*            // isOptionEqualToValue={(option, value) => option.id === value.id}*/}
                {/*            onChange={(e, value) => {*/}
                {/*                setData({*/}
                {/*                    ...data,*/}
                {/*                    country: value,*/}
                {/*                })*/}
                {/*                setEdited(true)*/}
                {/*            }}*/}
                {/*            renderInput={(params) =>*/}
                {/*                <TextField*/}
                {/*                    {...params}*/}
                {/*                    label="Kraj"*/}
                {/*                    sx={{my: 1}}*/}
                {/*                    {...register("country")}*/}
                {/*                    value={data.country}*/}
                {/*                    color={fieldErrors.country?.message && "error"}*/}
                {/*                />*/}
                {/*            }*/}
                {/*        />*/}
                {/*        {fieldErrors.country?.message && (*/}
                {/*            <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>*/}
                {/*                {fieldErrors.country?.message.toString()}*/}
                {/*            </Typography>*/}
                {/*        )}*/}

                {/*        <Box sx={{display: "flex", flexWrap: "wrap", gap: 5}}>*/}
                {/*            <Box>*/}
                {/*                <TextField id="zip_code" label="Kod pocztowy" variant="outlined"*/}
                {/*                           value={data.zip_code}*/}
                {/*                           {...register("zip_code")}*/}
                {/*                           color={fieldErrors.zip_code?.message ? "error" : null}*/}
                {/*                           onChange={(value) => {*/}
                {/*                               // setProductModel({...productModel, name: value.target.value});*/}
                {/*                               setData("zip_code", value.target.value)*/}
                {/*                               setEdited(true)*/}
                {/*                           }}*/}
                {/*                    // inputProps={{readOnly: !props.editing}}*/}
                {/*                           sx={{width: "30ch"}}/>*/}
                {/*                {fieldErrors.zip_code?.message && (*/}
                {/*                    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                {/*                        {fieldErrors.zip_code?.message.toString()}*/}
                {/*                    </Typography>*/}
                {/*                )}*/}
                {/*            </Box>*/}

                {/*            <Box>*/}
                {/*                <TextField id="city" label="Miasto" variant="outlined"*/}
                {/*                           value={data.city}*/}
                {/*                           {...register("city")}*/}
                {/*                           color={fieldErrors.city?.message ? "error" : null}*/}
                {/*                           onChange={(value) => {*/}
                {/*                               // setProductModel({...productModel, name: value.target.value});*/}
                {/*                               setData("city", value.target.value)*/}
                {/*                               setEdited(true)*/}
                {/*                           }}*/}
                {/*                    // inputProps={{readOnly: !props.editing}}*/}
                {/*                           sx={{width: "30ch"}}/>*/}
                {/*                {fieldErrors.city?.message && (*/}
                {/*                    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                {/*                        {fieldErrors.city?.message.toString()}*/}
                {/*                    </Typography>*/}
                {/*                )}*/}
                {/*            </Box>*/}
                {/*        </Box>*/}

                {/*        <Box sx={{display: "flex", flexWrap: "wrap", gap: 5}}>*/}
                {/*            <Box>*/}
                {/*                <TextField id="street" label="Ulica" variant="outlined"*/}
                {/*                           value={data.street}*/}
                {/*                           {...register("street")}*/}
                {/*                           color={fieldErrors.street?.message ? "error" : null}*/}
                {/*                           onChange={(value) => {*/}
                {/*                               // setProductModel({...productModel, name: value.target.value});*/}
                {/*                               setData("street", value.target.value)*/}
                {/*                               setEdited(true)*/}
                {/*                           }}*/}
                {/*                    // inputProps={{readOnly: !props.editing}}*/}
                {/*                           sx={{width: "30ch"}}/>*/}
                {/*                {fieldErrors.street?.message && (*/}
                {/*                    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                {/*                        {fieldErrors.street?.message.toString()}*/}
                {/*                    </Typography>*/}
                {/*                )}*/}
                {/*            </Box>*/}

                {/*            <Box>*/}
                {/*                <TextField id="house_number" label="Numer budynku" variant="outlined"*/}
                {/*                           type={"number"}*/}
                {/*                           value={data.house_number}*/}
                {/*                           {...register("house_number")}*/}
                {/*                           color={fieldErrors.city?.message ? "error" : null}*/}
                {/*                           onChange={(value) => {*/}
                {/*                               // setProductModel({...productModel, name: value.target.value});*/}
                {/*                               setData("house_number", value.target.value)*/}
                {/*                               setEdited(true)*/}
                {/*                           }}*/}
                {/*                    // inputProps={{readOnly: !props.editing}}*/}
                {/*                           inputProps={{style: {textAlign: 'center'}}}*/}
                {/*                           sx={{width: "12.5ch"}}/>*/}
                {/*                {fieldErrors.house_number?.message && (*/}
                {/*                    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                {/*                        {fieldErrors.house_number?.message.toString()}*/}
                {/*                    </Typography>*/}
                {/*                )}*/}
                {/*            </Box>*/}

                {/*            <Box>*/}
                {/*                <TextField id="apartment_number" label="Numer lokalu" variant="outlined"*/}
                {/*                           type={"number"}*/}
                {/*                           value={data.apartment_number}*/}
                {/*                           {...register("apartment_number")}*/}
                {/*                           color={fieldErrors.city?.message ? "error" : null}*/}
                {/*                           onChange={(value) => {*/}
                {/*                               // setProductModel({...productModel, name: value.target.value});*/}
                {/*                               setData("apartment_number", value.target.value)*/}
                {/*                               setEdited(true)*/}
                {/*                           }}*/}
                {/*                    // inputProps={{readOnly: !props.editing}}*/}
                {/*                           inputProps={{style: {textAlign: 'center'}}}*/}
                {/*                           InputLabelProps={{shrink: true}}*/}
                {/*                           sx={{width: "12.5ch"}}/>*/}
                {/*                {fieldErrors.apartment_number?.message && (*/}
                {/*                    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                {/*                        {fieldErrors.apartment_number?.message.toString()}*/}
                {/*                    </Typography>*/}
                {/*                )}*/}
                {/*            </Box>*/}
                {/*        </Box>*/}
                {/*    </Box>*/}
                {/*</Box>*/}


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
