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
                enqueueSnackbar("Błąd przy zapisywaniu B2B", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <>
            <Box>
                <FormControl sx={{width: "30ch"}}>
                    <InputLabel id="category-checkbox-label">Kategoria</InputLabel>
                    <Select
                        labelId="category-checkbox-label"
                        id="category-checkbox"
                        multiple
                        value={data.categories}
                        onChange={(value) => {
                            setEdited(true);
                            // setProductModel({...productModel, categories: value.target.value});
                            setData({...data, categories: value.target.value})
                        }}
                        input={<OutlinedInput label="Kategoria"/>}
                        inputProps={{readOnly: !props.editing}}
                        renderValue={(selected) => selected.map((value) => {
                            return (<Typography key={value} variant="body1" gutterBottom>
                                {props.categories.find(e => e.id == value).name}
                            </Typography>);
                        })}
                        MenuProps={MenuProps}
                    >
                        {props.categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                <Checkbox
                                    checked={data.categories.find(e => e == category.id) != null}/>
                                <ListItemText primary={category.name}/>
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
            </Box>
            <Box sx={{my: 1}}>
                <TextEditorB2B
                    value={data.description_b2b}
                    setValue={(value) => {
                        setData("description_b2b", value)
                    }}
                    setEdited={value => setEdited(value)}
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

