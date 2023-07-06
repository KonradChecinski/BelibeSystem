import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip, IconButton,
    ImageList,
    ImageListItem, Paper,
    Tooltip,
    Typography
} from "@mui/material";
import ModelsColorTable from "@/Components/Table/ModelsColorTable";
import {sortBySizesModelColorObject} from "@/Functions/sortBySizes";
import {ContentCopy, Delete, ExpandMore, FileDownload, Info} from "@mui/icons-material";

export default function ModelColorComponent(props) {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 5, mt: 2}}>
            {props.productModel.colors.map((color) => {
                return (
                    <Paper elevation={12} key={color.id}>
                        <Accordion defaultExpanded={true} disableGutters={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <img
                                    src={route("images") + "/brak.jpg"}
                                    // srcSet={`https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={"brak"}
                                    width={50}
                                    loading="lazy"
                                />
                                <Chip label={`${color.shortcut} - ${color.name}`} color="primary" variant="outlined"
                                      sx={{fontSize: 15, height: 35}}/>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <ModelsColorTable
                                        readOnly={!props.editing}
                                        data={
                                            sortBySizesModelColorObject(props.productModel.products.filter((product) => {
                                                return product.product_model_color_id === color.id;
                                            }))
                                        }
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Paper>

                );
            })}

        </Box>
    )
        ;
}
