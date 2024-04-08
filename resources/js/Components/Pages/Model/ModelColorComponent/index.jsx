import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button,
    Chip, Divider,
    Paper, TextField,
    Typography
} from "@mui/material";
import ModelsColorTable from "@/Components/Table/Model/ModelsColorTable";
import {Edit, ExpandMore, ShoppingBasket} from "@mui/icons-material";
import ModelColorAddDialog from "@/Components/Dialogs/ModelColorDialog/ModelColorAddDialog";
import {useState} from "react";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ModelColorComponent(props) {
    let theme = useTheme();
    const mdBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
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
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [clickedColor, setClickedColor] = useState(null);
    const reloadData = () => {
        // setPaginationModel({...paginationModel})
    }
    // console.log(props)
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 5, mt: 2}}>
            {props.productModel.colors_with_images
                .sort(sortByColorShortcut)
                .map((color) => {
                    // const colorName = props.b2c.color.find((b2cColor) => {
                    //     return b2cColor.id === color.b2c_color_id
                    // })?.name
                    return (
                        <Paper elevation={12} key={color.id}>
                            <Accordion defaultExpanded={true} disableGutters={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: 1,
                                        gap: 2,
                                        flexDirection: {xs: "column ", sm: "row"}
                                    }}>
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            flexDirection: "column"
                                        }}>
                                            <Box
                                                component={"img"}
                                                src={color.images.length ? route("images", {path: color.images.find(image => image.order === 0).path}) : route("images", {path: "brak.jpg"})}
                                                alt={"brak"}
                                                loading="lazy"
                                                width={80}
                                                sx={{}}>
                                            </Box>
                                            {color.color_icon?.type === 1 ?
                                                <Box
                                                    component={"img"}
                                                    src={route("colorIcons", {path: color.color_icon.path})}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "100%",
                                                        border: 1
                                                    }}/>
                                                :
                                                <Box sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "100%",
                                                    bgcolor: color.color_icon?.hex,
                                                    border: 1
                                                }}/>
                                            }

                                        </Box>

                                        <Box sx={{
                                            display: "flex",
                                            width: 1,
                                            gap: 1,
                                            flexDirection: "column"
                                        }}>
                                            <Box sx={{
                                                display: "flex",
                                                gap: 2,
                                                flexWrap: "wrap",
                                                flexDirection: {xs: "column ", md: "row"}
                                            }}>
                                                <TextField id="symbol" label="Symbol" variant="outlined"
                                                           value={color.shortcut}
                                                           inputProps={{readOnly: true}}
                                                           disabled={true}
                                                           sx={{width: "10ch"}}/>

                                                <TextField id="name" label="Nazwa koloru" variant="outlined"
                                                           value={color.name}
                                                           inputProps={{readOnly: true}}
                                                           disabled={true}
                                                           sx={{width: "30ch"}}/>

                                                {mdBreakpointUp ?
                                                    <Divider orientation="vertical" variant="middle" flexItem/> : null}

                                                <TextField id="quantity" label="Stan" variant="outlined"
                                                           value={countQuantityInColor(color.id)}
                                                           type="number"
                                                           inputProps={{readOnly: true}}
                                                           disabled={true}
                                                           sx={{width: "10ch"}}/>
                                            </Box>
                                            <Divider/>
                                            <Typography
                                                sx={{mb: 0.5, display: "flex", gap: 1, alignItems: "center"}}>
                                                <ShoppingBasket fontSize={"large"}/>
                                                Sklep Internetowy
                                            </Typography>


                                            <Box sx={{
                                                display: "flex",
                                                gap: 2,
                                                flexWrap: "wrap",
                                                flexDirection: {xs: "column ", md: "row"}
                                            }}>
                                                <TextField id="symbol_b2c" label="Symbol" variant="outlined"
                                                           value={color.b2c_shortcut}
                                                           inputProps={{readOnly: true}}
                                                           disabled={true}
                                                           sx={{width: "10ch"}}/>
                                                <TextField id="name_b2c" label="Nazwa koloru" variant="outlined"
                                                           value={color.b2c_color ? color?.b2c_color?.name : " "}
                                                           inputProps={{readOnly: true}}
                                                           disabled={true}
                                                           sx={{width: "30ch"}}/>
                                                {mdBreakpointUp ?
                                                    <Divider orientation="vertical" variant="middle" flexItem/> : null}

                                                <TextField id="product_name" label="Nazwa produktu w sklepie"
                                                           variant="outlined"
                                                           value={color.b2c_product_name}
                                                           inputProps={{readOnly: true}}
                                                           disabled={true}
                                                           sx={{width: "100%", maxWidth: "60ch"}}/>
                                            </Box>
                                        </Box>


                                        {props.editing ?
                                            (
                                                <Chip icon={<Edit/>}
                                                      label={"Edytuj kolor"}
                                                      color="secondary"
                                                      sx={{
                                                          fontSize: 15,
                                                          fontWeight: 'bold',
                                                          height: 35,
                                                          position: "absolute",
                                                          right: 40,
                                                          top: 12
                                                      }}
                                                      onClick={(event) => {
                                                          event.stopPropagation();
                                                          setClickedColor(color);
                                                          setOpenDialogEdit(true);
                                                      }}
                                                />
                                            ) : null}
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
                    }} onClick={() => setOpenDialogAdd(true)}>
                        <Typography variant={"body1"}>
                            Dodaj kolor
                        </Typography>
                    </Button>
                    <ModelColorAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData}
                                         params={props} clickedColor={null} setClickedColor={setClickedColor}
                    />
                    <ModelColorAddDialog open={openDialogEdit}
                                         setOpen={setOpenDialogEdit}
                                         reloadData={reloadData}
                                         params={props} clickedColor={clickedColor} setClickedColor={setClickedColor}
                    />
                </> : ""}

        </Box>
    )
        ;
}
