import {
    Autocomplete,
    Box, Button,
    Checkbox, Fade,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select, TextField,
    Typography
} from "@mui/material";
import TextEditorB2B from "@/Components/TextEditor/B2B";
import {Category, Description, Save} from "@mui/icons-material";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import TextEditorWebsite from "@/Components/TextEditor/Website";


export default function ModelB2CComponent({productModel, setProductModel, props}) {
    const [edited, setEdited] = useState(false);
    const {data, setData, processing, post} = useForm({
        'id': props.productModel.id,
        "description_b2c": props.productModel.description_b2c,

        "b2c_variant": props.productModel.b2c_variant,

        'product_b2c_category_id': props.productModel.product_b2c_category_id,
        'b2c_category': props.productModel.b2c_category,
    })

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            }
        }
    };
    const saveB2C = () => {
        post(route("system.products.model.update.b2c", {productModel: data.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano B2C", {variant: 'success'})
            },
            onError: params => {
                console.error(params);
                enqueueSnackbar("Błąd przy zapisywaniu B2C", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    const variants = [
        {
            id: 1,
            label: "Zestaw rozmiar"
        },
        {
            id: 2,
            label: "Zestaw kolor"
        }
    ]

    return (
        <>
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <Typography
                    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                    <Category fontSize={"large"}/>
                    Kategorie i Wariantowanie
                </Typography>
                <Autocomplete
                    disablePortal
                    id="b2c_category"
                    options={props.b2c.category.map(e => ({
                        id: e.id,
                        name: e.name,
                        label: e.name
                    }))}
                    sx={{width: "30ch"}}
                    value={data.b2c_category}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => {
                        setData({
                            ...data,
                            b2c_category: value,
                            product_b2c_category_id: value?.id,
                        })
                        setEdited(true)
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="Kategoria"
                            sx={{my: 1}}
                            value={data.b2c_category}
                            //{...register("gs1_gpc")}
                            // color={fieldErrors.gs1_gpc?.message && "error"}
                        />}
                />
                <Autocomplete
                    disablePortal
                    id="b2c_variant"
                    options={variants}
                    sx={{width: "30ch"}}
                    value={variants.find(o => o.id === data.b2c_variant)}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => {
                        console.log(value)
                        setData("b2c_variant", value?.id)
                        setEdited(true)
                        console.log(data)
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="Wariant"
                            sx={{my: 1}}
                            value={variants.find(o => o.id === data.b2c_variant)}
                            //{...register("gs1_gpc")}
                            // color={fieldErrors.gs1_gpc?.message && "error"}
                        />}
                />
                {/*{fieldErrors.gs1_gpc?.message && (*/}
                {/*    <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>*/}
                {/*        {fieldErrors.gs1_gpc?.message.toString()}*/}
                {/*    </Typography>*/}
                {/*)}*/}
            </Box>
            <Box sx={{my: 1}}>
                <Typography
                    sx={{my: 3, display: "flex", gap: 1, alignItems: "center"}}>
                    <Description fontSize={"large"}/>
                    Opis
                </Typography>
                <TextEditorWebsite
                    value={data.description_b2c}
                    setValue={(value) => {
                        setData("description_b2c", value)
                    }}
                    setEdited={value => setEdited(value)}
                    readOnly={!props.editing}
                />
            </Box>


            <Fade in={edited}>
                <Button variant="outlined" startIcon={<Save/>}
                        disabled={processing}
                        onClick={saveB2C}
                        sx={{
                            position: "absolute",
                            top: 7,
                            right: 100,
                        }}>
                    Zapisz
                </Button>
            </Fade>
        </>
    );
}

