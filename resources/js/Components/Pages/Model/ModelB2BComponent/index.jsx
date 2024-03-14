import {
    Box, Button,
    Checkbox, Fade,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Typography
} from "@mui/material";
import TextEditorB2B from "@/Components/TextEditor/B2B";
import {Category, Description, Save} from "@mui/icons-material";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import CategoryComponent from "@/Components/Pages/Model/ModelB2BComponent/CategoryComponent";


export default function ModelB2BComponent({productModel, setProductModel, props}) {
    const [edited, setEdited] = useState(false);
    const {data, setData, processing, post} = useForm({
        'id': props.productModel.id,
        "description_b2b": props.productModel.description_b2b,
        "categories": props.productModel.categories.map((value) => {
            return value.id;
        })
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
    const saveB2B = () => {
        post(route("system.products.model.update.b2b", {productModel: data.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano B2B", {variant: 'success'})
            },
            onError: params => {
                console.error(params);
                enqueueSnackbar("Błąd przy zapisywaniu B2B", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <>
            <Box>
                <Typography
                    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                    <Category fontSize={"large"}/>
                    Kategorie
                </Typography>
                <CategoryComponent categories={props.categories} data={data} setData={setData}
                                   setEdited={value => setEdited(value)}/>
            </Box>
            <Box sx={{my: 1}}>
                <Typography
                    sx={{my: 3, display: "flex", gap: 1, alignItems: "center"}}>
                    <Description fontSize={"large"}/>
                    Opis
                </Typography>
                <TextEditorB2B
                    value={data.description_b2b}
                    setValue={(value) => {
                        setData("description_b2b", value)
                    }}
                    setEdited={value => setEdited(value)}
                    readOnly={!props.editing}
                />
            </Box>


            <Fade in={edited}>
                <Button variant="outlined" startIcon={<Save/>}
                        disabled={processing}
                        onClick={saveB2B}
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

