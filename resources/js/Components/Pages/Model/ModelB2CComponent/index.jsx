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
import {Save} from "@mui/icons-material";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import TextEditorWebsite from "@/Components/TextEditor/Website";


export default function ModelB2CComponent({productModel, setProductModel, props}) {
    const [edited, setEdited] = useState(false);
    const {data, setData, processing, post} = useForm({
        'id': props.productModel.id,
        "description_b2c": props.productModel.description_b2c,
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
                enqueueSnackbar("Błąd przy zapisywaniu B2C", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <>
            <Box sx={{my: 1}}>
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

