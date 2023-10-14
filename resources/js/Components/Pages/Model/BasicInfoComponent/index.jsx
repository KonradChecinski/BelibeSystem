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
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
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
