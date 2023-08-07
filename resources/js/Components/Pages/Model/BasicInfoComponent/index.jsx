import {Box, Button, Fade, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {Save} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";

export default function BasicInfoComponent(props) {
    const [edited, setEdited] = useState(false);
    const {data, setData, processing, post} = useForm({
        'id': props.productModel.id,
        'symbol': props.productModel.symbol,
        'name': props.productModel.name,
        'product_group_id': props.productModel.product_group_id,

    })

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
                enqueueSnackbar("Błąd przy zapisywaniu podstawowych informacji", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
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
                <TextField id="name" label="Nazwa" variant="outlined"
                           value={data.name}
                    // disabled={!props.editing}
                           onChange={(value) => {
                               // setProductModel({...productModel, name: value.target.value});
                               setData("name", value.target.value)
                               setEdited(true)
                           }}
                           inputProps={{readOnly: !props.editing}}
                           sx={{width: "30ch"}}/>


            </Box>
            <Box>
                <FormControl sx={{width: "30ch"}}>
                    <InputLabel id="group-select-label">Grupa</InputLabel>
                    <Select
                        labelId="group-select-label"
                        id="group-select"
                        label="Grupa"
                        value={data.product_group_id}
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

                </FormControl>


            </Box>

            <Box>
                <TextField id="quantity" label="Stan w magazynie ogólnie" variant="outlined"
                           value={countQuantityInModel()}
                           type="number"
                           inputProps={{readOnly: true}}
                           sx={{width: "20ch"}}/>


            </Box>


            <Fade in={edited}>
                <Button variant="outlined" startIcon={<Save/>}
                        disabled={processing}
                        onClick={saveBasic}
                        sx={{
                            position: "absolute",
                            top: 7,
                            right: 230,
                        }}>
                    Zapisz
                </Button>
            </Fade>
        </Box>
    );

}
