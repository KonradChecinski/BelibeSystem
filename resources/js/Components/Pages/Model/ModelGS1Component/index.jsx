import {
    Autocomplete,
    Box, Button,
    Fade,
    TextField,
    Typography
} from "@mui/material";
import {Save} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {useModelGS1Form} from "@/Components/Pages/Model/ModelGS1Component/form/useModelGS1Form";


export default function ModelGS1Component({props}) {
    const [edited, setEdited] = useState(false);

    console.log("Props: ", props)

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
    } = useModelGS1Form()

    const {data, setData, processing, post} = useForm({
        'product_gs1_brand_id': props.productModel.product_gs1_brand_id,
        'product_gs1_gpc_id': props.productModel.product_gs1_gpc_id,

        'gs1_gpc': props.productModel.gs1_gpc,
        'gs1_brand': props.productModel.gs1_brand,
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("gs1_gpc", data.gs1_gpc.name)
        setValue("gs1_brand", data.gs1_brand.name)
    }, [setValue]);

    const onSubmit = (formData) => {
        console.log("GS1 form data: ", formData)
        console.log("GS1 data: ", data)
        saveSubiekt()
    }

    const saveSubiekt = () => {
        post(route("system.products.model.update.gs1", {productModel: props.productModel.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano GS1", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu GS1", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

            <Box sx={{display: "flex", flexWrap: "wrap", gap: 5, mt: 2}}>

                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <Autocomplete
                        disablePortal
                        id="gs1_gpc"
                        options={props.gs1.gpc.map(e => ({
                            id: e.id,
                            name: e.name,
                            label: e.name
                        }))}
                        sx={{width: "30ch"}}
                        value={data.gs1_gpc}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(e, value) => {
                            setData({
                                ...data,
                                gs1_gpc: value,
                                product_gs1_gpc_id: value?.id,
                            })
                            setEdited(true)
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Klasyfikacja GPC"
                                sx={{my: 1}}
                                value={data.gs1_gpc}
                                {...register("gs1_gpc")}
                                color={fieldErrors.gs1_gpc?.message && "error"}
                            />}
                    />
                    {fieldErrors.gs1_gpc?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                            {fieldErrors.gs1_gpc?.message.toString()}
                        </Typography>
                    )}
                </Box>

                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <Autocomplete
                        disablePortal
                        id="gs1_brand"
                        options={props.gs1.brand.map(e => ({
                            id: e.id,
                            name: e.name,
                            label: e.name
                        }))}
                        sx={{width: "30ch"}}
                        value={data.gs1_brand}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(e, value) => {
                            setData({
                                ...data,
                                gs1_brand: value,
                                product_gs1_brand_id: value?.id,
                            })
                            setEdited(true)
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Marka GS1"
                                sx={{my: 1}}
                                value={data.gs1_brand}
                                {...register("gs1_brand")}
                                color={fieldErrors.gs1_brand?.message && "error"}
                            />}
                    />
                    {fieldErrors.gs1_gpc?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                            {fieldErrors.gs1_gpc?.message.toString()}
                        </Typography>
                    )}
                </Box>


                <Fade in={edited}>
                    <Button type="submit" variant="outlined" startIcon={<Save/>}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 100,
                            }}>
                        Zapisz
                    </Button>
                </Fade>
            </Box>

        </form>
    );
}

