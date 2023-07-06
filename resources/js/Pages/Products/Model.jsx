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
import {useEffect, useState} from "react";
import ModelsColorTable from "@/Components/Table/ModelsColorTable";

import {sortBySizesModelColorObject} from "@/Functions/sortBySizes";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import UserAvatar from "@/Components/UserAvatar";
import {copyImageToClipboard} from "copy-image-clipboard";
import Draggable from "react-draggable";
import ModelColorComponent from "@/Components/Pages/Model/ModelColorComponent";

export default function Model(props) {

    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("sm"));
    const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));

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

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function PaperComponent(props) {
        return (
            <Draggable
                handle="#draggable-dialog-title"
                cancel={"[class*=\"MuiDialogContent-root\"]"}
            >
                <Paper {...props} />
            </Draggable>
        );
    }

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

    const copyImg = async (src) => {
        copyImageToClipboard(src)
            .then(() => {
                enqueueSnackbar("Skopiowano do schowka", {
                    variant: "success"
                });
            })
            .catch((e) => {
                console.log("copyImg - Error: ", e.message);
                enqueueSnackbar("Coś poszło nie tak", {
                    variant: "Error"
                });
            });
    };

    const downloadImg = (name, url) => {
        const link = document.createElement("a");
        link.download = name;
        link.target = "_blank";
        link.href = url;

        link.click();
        enqueueSnackbar("Rozpoczęto pobieranie", {
            variant: "success"
        });
    };

    const deleteImg = () => {
        enqueueSnackbar("Usunięto", {
            variant: "success"
        });
    };

    const InfoImg = () => {
        handleClickOpen();
    };


    useEffect(() => {
        let lightbox = new PhotoSwipeLightbox({
            gallery: "#" + "pswp-gallery", //props.galleryID,
            children: "a",
            pswpModule: () => import("photoswipe")
        });
        lightbox.on("uiRegister", function () {
            lightbox.pswp.ui.registerElement({
                name: "download-button",
                order: 8,
                isButton: true,
                tagName: "a",
                html: {
                    isCustomSVG: true,
                    inner: "<path d=\"M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z\" id=\"pswp__icn-download\"/>",
                    outlineID: "pswp__icn-download"
                },

                onInit: (el, pswp) => {
                    el.setAttribute("download", "");
                    el.setAttribute("target", "_blank");
                    el.setAttribute("rel", "noopener");
                    el.onclick = () => {
                        enqueueSnackbar("Rozpoczęto pobieranie", {
                            variant: "success"
                        });
                    };

                    pswp.on("change", () => {
                        console.log("change");
                        el.href = pswp.currSlide.data.src;
                    });
                }
            });
        });
        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, []);

    return (

        <UserLayout auth={props.auth} errors={props.errors} header={"Model: " + props.productModel.name}>
            <Head title="Dashboard"/>
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
                    </Box>

                </IconGrid>

                <IconGrid xs={12} md={12} title={"Kolory"} icon={<Palette/>} iconColor={"blue"}>
                    <ModelColorComponent {...props}/>
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Zdjęcia"} icon={<Category/>} iconColor={"blue"}>

                    <Paper elevation={4}>
                        <Accordion defaultExpanded={true} disableGutters={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Aktualne</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="pswp-gallery" id={"pswp-gallery"}>
                                    <ImageList cols={matchDownLg ? matchDownMd ? 3 : 4 : 8}>
                                        {Array(10).fill(1).map((el, i) => {
                                            return (<ImageListItem key={i} sx={{
                                                "&:hover": {
                                                    "& .MuiBox-root": {
                                                        opacity: "100%"
                                                    }

                                                }
                                            }}>
                                                <Box>
                                                    <a
                                                        href={route("images") + "/brak.jpg"}
                                                        data-pswp-width={645}
                                                        data-pswp-height={960}
                                                        key={"pswp-gallery" + "-" + "1"}//index
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >

                                                        <img
                                                            src={route("images") + "/brak.jpg"}
                                                            // srcSet={`https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                            alt={"brak"}
                                                            loading="lazy"
                                                        />

                                                    </a>
                                                </Box>

                                                <Box sx={{
                                                    bgcolor: "rgba(0,0,0,0.5)",
                                                    position: "absolute",
                                                    bottom: 0,
                                                    width: 1,
                                                    zIndex: 20,
                                                    display: "flex",
                                                    justifyContent: "space-evenly",
                                                    alignItems: "center",
                                                    opacity: "0%",
                                                    transition: "opacity 0.3s ease-in-out"
                                                }}>
                                                    <Tooltip title="Info">
                                                        <IconButton onClick={InfoImg}>
                                                            <Info sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Download">
                                                        <IconButton onClick={() => {
                                                            downloadImg("brak.jpg", route("images") + "/brak.jpg");
                                                        }}>
                                                            <FileDownload sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Copy">
                                                        <IconButton onClick={() => {
                                                            copyImg(route("images") + "/brak.jpg");
                                                        }}>
                                                            <ContentCopy sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={deleteImg}>
                                                            <Delete sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>

                                                </Box>
                                            </ImageListItem>);
                                        })
                                        }

                                    </ImageList>
                                </div>
                            </AccordionDetails>
                        </Accordion>


                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Archiwalne</Typography>
                                <Typography sx={{color: "text.secondary", ml: 10}}>Nie używać</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="pswp-gallery" id={"pswp-gallery"}>
                                    <ImageList cols={matchDownLg ? matchDownMd ? 3 : 4 : 8}>
                                        {Array(2).fill(1).map((el, i) => {
                                            return (<ImageListItem key={i} sx={{
                                                "&:hover": {
                                                    "& .MuiBox-root": {
                                                        opacity: "100%"
                                                    }

                                                }
                                            }}>
                                                <Box>
                                                    <a
                                                        href={route("images") + "/brak.jpg"}
                                                        data-pswp-width={645}
                                                        data-pswp-height={960}
                                                        key={"pswp-gallery" + "-" + "1"}//index
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >

                                                        <img
                                                            src={route("images") + "/brak.jpg"}
                                                            // srcSet={`https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                            alt={"brak"}
                                                            loading="lazy"
                                                        />

                                                    </a>
                                                </Box>

                                                <Box sx={{
                                                    bgcolor: "rgba(0,0,0,0.5)",
                                                    position: "absolute",
                                                    bottom: 0,
                                                    width: 1,
                                                    zIndex: 20,
                                                    display: "flex",
                                                    justifyContent: "space-evenly",
                                                    alignItems: "center",
                                                    opacity: "0%",
                                                    transition: "opacity 0.3s ease-in-out"
                                                }}>
                                                    <Tooltip title="Info">
                                                        <IconButton>
                                                            <Info sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Download">
                                                        <IconButton onClick={() => {
                                                            downloadImg("brak.jpg", route("images") + "/brak.jpg");
                                                        }}>
                                                            <FileDownload sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Copy">
                                                        <IconButton onClick={() => {
                                                            copyImg(route("images") + "/brak.jpg");
                                                        }}>
                                                            <ContentCopy sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={deleteImg}>
                                                            <Delete sx={{fontSize: 25}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </ImageListItem>);
                                        })
                                        }

                                    </ImageList>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                </IconGrid>
                {/*<IconGrid xs={12} md={12} icon={<Palette />} iconColor={"green"} />*/}
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
            </Grid>


            <Paper>
                {/*<ModelsTable {...props} />*/}
            </Paper>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: "move"}} id="draggable-dialog-title">
                    Zdjęcie
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Data utworzenia: dd.mm.YYYY HH:MM
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Zamknij
                    </Button>
                </DialogActions>
            </Dialog>
        </UserLayout>
    );
}
