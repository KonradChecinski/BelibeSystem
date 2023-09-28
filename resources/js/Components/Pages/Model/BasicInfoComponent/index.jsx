import {Box, Button, Fade, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {Save} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {useBasicInfoForm} from "@/Components/Pages/Model/BasicInfoComponent/form/useBasicInfoForm";

export default function BasicInfoComponent(props) {
    const [edited, setEdited] = useState(false);

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
    } = useBasicInfoForm()

    const {data, setData, processing, post} = useForm({
        'id': props.productModel.id,
        'symbol': props.productModel.symbol,
        'name': props.productModel.name,
        'product_group_id': props.productModel.product_group_id,
        'name_11_char': props.productModel.name_11_char,
        'name_6_char': props.productModel.name_6_char,
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
        setValue("product_group_id", data.product_group_id)
        setValue("name_6_char", data.name_6_char)
        setValue("name_11_char", data.name_11_char)
    }, [setValue]);

    const onSubmit = (formData) => {
        console.log("Basic info dane: ", {...formData, symbol: data.symbol, id: data.id})
        console.log("data z Inertia: ", data)
        saveBasic()
    }

    const [productModel, setProductModel] = useState({
        ...props.productModel,
        categories: props.productModel.categories.map((value) => {
            // delete value.pivot;
            return value.id;
        })
    });
    const countQuantityInModel = () => {
        let quantity = 0;
        props.productModel.products.forEach((value) => {
            quantity += value.quantity;
        });
        return quantity;
    }
    const saveBasic = () => {
        post(route("system.products.model.update.basic", {productModel: data.id}), {
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

            <Box sx={{display: "flex", flexWrap: "wrap", gap: 5, mt: 2}}>
                <Box>
                    <TextField id="symbol" label="Symbol" variant="outlined"
                               value={data.symbol}
                               disabled={true}
                               inputProps={{readOnly: !props.editing}}
                        // onChange={(value) => {
                        //     setProductModel({...productModel, symbol: value.target.value});
                        // }}
                               sx={{width: "30ch"}}/>
                </Box>
                <Box>
                    <TextField id="quantity" label="Stan" variant="outlined"
                               value={countQuantityInModel()}
                               type="number"
                               inputProps={{readOnly: true}}
                               disabled={true}
                               sx={{width: "10ch"}}/>


                </Box>
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <TextField id="name" label="Nazwa" variant="outlined"
                               defaultValue={data.name}
                               {...register("name")}
                               color={fieldErrors.name?.message ? "error" : null}
                               onChange={(value) => {
                                   // setProductModel({...productModel, name: value.target.value});
                                   setData("name", value.target.value)
                                   setEdited(true)
                               }}
                               inputProps={{readOnly: !props.editing}}
                               sx={{width: "30ch"}}/>
                    {fieldErrors.name?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {fieldErrors.name?.message.toString()}
                        </Typography>
                    )}
                </Box>
                <Box>
                    <FormControl sx={{width: "30ch", display: "flex", flexDirection: "column"}}>
                        <InputLabel id="group-select-label">Grupa</InputLabel>
                        <Select
                            labelId="group-select-label"
                            id="group-select"
                            label="Grupa"
                            value={data.product_group_id}
                            color={fieldErrors.product_group_id?.message ? "error" : null}
                            {...register("product_group_id")}
                            onChange={(value) => {
                                // setProductModel({...productModel, product_group_id: value.target.value});
                                setData("product_group_id", value.target.value)
                                setEdited(true)
                            }}

                            // disabled={!props.editing}
                            inputProps={{readOnly: !props.editing}}
                        >
                            {props.groups.map((group) => {
                                return (
                                    <MenuItem key={group.id} value={group.id}>
                                        {group.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {fieldErrors.product_group_id?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                                {fieldErrors.product_group_id?.message.toString()}
                            </Typography>
                        )}

                    </FormControl>


                </Box>


                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <TextField id="name_6_char" label="Wydruk 6 znaków" variant="outlined"
                               defaultValue={data.name_6_char}
                               {...register("name_6_char")}
                               color={fieldErrors.name_6_char?.message ? "error" : null}
                               onChange={(value) => {
                                   // setProductModel({...productModel, name: value.target.value});
                                   setData("name_6_char", value.target.value)
                                   setEdited(true)
                               }}
                               inputProps={{readOnly: !props.editing}}
                               sx={{width: "30ch"}}
                    />
                    {fieldErrors.name_6_char?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {fieldErrors.name_6_char?.message.toString()}
                        </Typography>
                    )}
                </Box>
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <TextField id="name_11_char" label="Wydruk 11 znaków" variant="outlined"
                               defaultValue={data.name_11_char}
                               {...register("name_11_char")}
                               color={fieldErrors.name_11_char?.message ? "error" : null}
                               onChange={(value) => {
                                   // setProductModel({...productModel, name: value.target.value});
                                   setData("name_11_char", value.target.value)
                                   setEdited(true)
                               }}
                               inputProps={{readOnly: !props.editing}}
                               sx={{width: "30ch"}}
                    />
                    {fieldErrors.name_11_char?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1}}>
                            {fieldErrors.name_11_char?.message.toString()}
                        </Typography>
                    )}
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
            </Box>

        </form>
    );

}
