import {Head, Link, router} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    OutlinedInput,
    Chip,
    IconButton,
    ImageListItem,
    ImageList,
    Tooltip,
    Badge,
    Fade,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import {useSnackbar} from "notistack";
import ModelsTable from "@/Components/Table/ModelsTable";
import {
    Category,
    ContentCopy,
    Delete,
    Edit,
    ExpandMore,
    FileDownload, Info,
    Palette,
    Visibility
} from "@mui/icons-material";
import IconGrid from "@/Components/IconGrid";
import {useState} from "react";
import ModelColorComponent from "@/Components/Pages/Model/ModelColorComponent";
import ImagesComponent from "@/Components/Pages/Model/ImagesComponent";

export default function Model(props) {
    const countQuantityInModel = () => {
        let quantity = 0;
        props.productModel.products.forEach((value) => {
            quantity += value.quantity;
        });
        return quantity;
    }

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [productModel, setProductModel] = useState({
        ...props.productModel,
        categories: props.productModel.categories.map((value) => {
            // delete value.pivot;
            return value.id;
        })
    });
    console.log(props);
    // console.log(productModel);

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

        <UserLayout auth={props.auth} errors={props.errors} header={"Model: " + props.productModel.name}>
            <Head title={props.productModel.name}/>
            <Grid container spacing={2}>
                <IconGrid xs={12} md={12} title={"Podstawowe informacje"} icon={<Category/>} iconColor={"green"}>
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 5, mt: 2}}>
                        <Box>
                            <TextField id="symbol" label="Symbol" variant="outlined"
                                       value={productModel.symbol}
                                // disabled={!props.editing}
                                       inputProps={{readOnly: !props.editing}}
                                       onChange={(value) => {
                                           setProductModel({...productModel, symbol: value.target.value});
                                       }}
                                       sx={{width: "30ch"}}/>
                        </Box>
                        <Box>
                            <TextField id="name" label="Nazwa" variant="outlined"
                                       value={productModel.name}
                                // disabled={!props.editing}
                                       onChange={(value) => {
                                           setProductModel({...productModel, name: value.target.value});
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
                                    value={productModel.product_group_id}
                                    onChange={(value) => {
                                        setProductModel({...productModel, product_group_id: value.target.value});
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
                        <Box>
                            <TextField id="quantity" label="Stan w magazynie ogólnie" variant="outlined"
                                       value={countQuantityInModel()}
                                       type="number"
                                       inputProps={{readOnly: true}}
                                       sx={{width: "30ch"}}/>


                        </Box>
                    </Box>

                </IconGrid>

                <IconGrid xs={12} md={12} title={"Kolory"} icon={<Palette/>} iconColor={"blue"}>
                    <ModelColorComponent {...props} />
                </IconGrid>
                <IconGrid xs={12} md={12} title={"Sklep"} icon={<Palette/>} iconColor={"green"}>

                </IconGrid>

                <IconGrid xs={12} md={12} title={"Zdjęcia"} icon={<Category/>} iconColor={"blue"}>
                    <ImagesComponent/>
                </IconGrid>

                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
            </Grid>

        </UserLayout>
    );
}
