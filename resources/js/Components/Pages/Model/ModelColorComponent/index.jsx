import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button,
    Chip,
    Paper,
    Typography
} from "@mui/material";
import ModelsColorTable from "@/Components/Table/ModelsColorTable";
import {ExpandMore} from "@mui/icons-material";
import ModelColorAddDialog from "@/Components/Dialogs/ModelColorDialog/ModelColorAddDialog";
import {useState} from "react";

export default function ModelColorComponent(props) {
    const countQuantityInColor = (color_id) => {
        let quantity = 0;
        props.productModel.products.filter((product) => {
            return product.product_model_color_id === color_id;
        }).forEach((value) => {
            quantity += value.quantity;
        });
        return quantity;
    }

    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const reloadData = () => {
        // setPaginationModel({...paginationModel})
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 5, mt: 2}}>
            {props.productModel.colors_with_images
                .sort((a, b) => (a.shortcut > b.shortcut) ? 1 : ((b.shortcut > a.shortcut) ? -1 : 0))
                .map((color) => {
                    return (
                        <Paper elevation={12} key={color.id}>
                            <Accordion defaultExpanded={true} disableGutters={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Box sx={{mr: 2}}>
                                        <img
                                            src={color.images.length ? route("images", {path: color.images.find(image => image.order === 0).path}) : route("images", {path: "brak.jpg"})}
                                            // srcSet={`https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            alt={"brak"}
                                            width={50}
                                            loading="lazy"
                                        />
                                    </Box>

                                    <Box sx={{display: "flex", gap: 1}}>
                                        <Chip label={`${color.shortcut} - ${color.name}`} color="primary"
                                              variant="outlined"
                                              sx={{fontSize: 15, height: 35}}/>
                                        <Chip label={`Stan koloru - ${countQuantityInColor(color.id)}`} color="primary"
                                              variant="outlined"
                                              sx={{fontSize: 15, height: 35}}/>
                                    </Box>

                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{position: "relative"}}>
                                        <ModelsColorTable
                                            readOnly={!props.editing}
                                            products={
                                                props.productModel.products.filter((product) => {
                                                    return product.product_model_color_id === color.id;
                                                })
                                            }
                                            units={props.units}
                                            color={color}
                                            props={props}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>

                    );
                })}
            {props.editing ?
                <>
                    <Button variant="outlined" sx={{
                        height: 40,
                        mx: 2,
                        textAlign: "center",
                        border: "2px solid",
                        borderColor: "primary.main",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }} onClick={() => setOpenDialogAdd(true)}><Typography variant={"body1"}>Dodaj
                        kolor</Typography></Button>
                    <ModelColorAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData}
                                         params={props}
                    />
                </> : ""}

        </Box>
    )
        ;
}
