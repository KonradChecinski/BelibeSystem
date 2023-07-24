import {
    Box,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Typography
} from "@mui/material";


export default function ModelB2BComponent({productModel, setProductModel, props}) {

    console.log("cos", props)
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


    return (
        <Box>
            <FormControl sx={{width: "30ch"}}>
                <InputLabel id="category-checkbox-label">Kategoria</InputLabel>
                <Select
                    labelId="category-checkbox-label"
                    id="category-checkbox"
                    multiple
                    value={productModel.categories}
                    onChange={(value) => {
                        console.log(value.target);
                        setProductModel({...productModel, categories: value.target.value});
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
                                checked={productModel.categories.find(e => e == category.id) != null}/>
                            <ListItemText primary={category.name}/>
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>
        </Box>
    );
}

