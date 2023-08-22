import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, Fade,
    IconButton,
    ImageList,
    ImageListItem,
    Paper, Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {ContentCopy, Delete, ExpandMore, FileDownload, Info, Save} from "@mui/icons-material";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {copyImageToClipboard} from "copy-image-clipboard";
import ReactDraggable from "react-draggable";
import {useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import * as PropTypes from "prop-types";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {useForm} from "@inertiajs/react";


export default function ImagesComponent(props) {
    const [edited, setEdited] = useState(false);


    const {data, setData, processing, post} = useForm({
        'id': props.productModel.id,
        "description_b2b": props.productModel.description_b2b,
        "categories": props.productModel.categories.map((value) => {
            return value.id;
        })
    })

    const saveImages = () => {
        setEdited(false);

        // post(route("system.products.model.update.b2b", {productModel: data.id}), {
        //     onSuccess: params => {
        //         setEdited(false);
        //         enqueueSnackbar("Zapisano B2B", {variant: 'success'})
        //     },
        //     onError: params => {
        //         enqueueSnackbar("Błąd przy zapisywaniu B2B", {variant: 'error'})
        //     },
        //     preserveScroll: true
        // })
    }

    const [imageArray, setImageArray] = useState(props.productModel.colors_with_images.map(({shortcut}) => ({
        shortcut, "images": {
            "main": Array.from({length: 5}, (_, i) => shortcut + "main" + (i + 1)),
            "big": Array.from({length: 2}, (_, i) => shortcut + "big" + (i + 1)),
            "old": Array.from({length: 6}, (_, i) => shortcut + "old" + (i + 1)),
        }
    })))
    const onDragEnd = (e) => {
        console.log(e)
        console.log(imageArray)

        if (!e.destination) return;
        if (e.source.droppableId === e.destination.droppableId && e.source.index === e.destination.index) return;

        setEdited(true);

        const newImageArray = [...imageArray]

        //Source
        const sourceShortcut = e.source.droppableId.split("_")[0]
        const sourceType = e.source.droppableId.split("_")[1]
        const sourceIndex = e.source.index
        let sourceImageRow = newImageArray.find(e => e.shortcut === sourceShortcut).images[sourceType]

        //Destination
        const destinationShortcut = e.destination.droppableId.split("_")[0]
        const destinationType = e.destination.droppableId.split("_")[1]
        const destinationIndex = e.destination.index
        let destinationImageRow = newImageArray.find(e => e.shortcut === destinationShortcut).images[destinationType]

        //
        // console.log(newImageArray)
        // console.log("sourceIndex", sourceIndex)
        // console.log(newImageArray.find(e => e.shortcut === sourceShortcut).images[sourceType][sourceIndex])
        // console.log(sourceImageRow)

        const dropElement = sourceImageRow.splice(sourceIndex, 1)
        destinationImageRow.splice(destinationIndex, 0, dropElement)
    }
    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>


                {props.productModel.colors_with_images.map((color) => {
                    const [bigAccordion, setBigAccordion] = useState(false);
                    const [oldAccordion, setOldAccordion] = useState(false);
                    return (
                        <Paper elevation={4} key={color.id} sx={{my: 1}}>

                            <Accordion defaultExpanded={true} disableGutters={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{color.shortcut} - {color.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Droppable droppableId={color.shortcut + "_main"} type={"group"}
                                               direction="horizontal">
                                        {(provided) => (
                                            <Box {...provided.droppableProps} ref={provided.innerRef}
                                                 sx={{height: 270}}>
                                                <ImageColorList props={props} dropId={color.shortcut + "_main"}
                                                                imageArray={imageArray.find(e => e.shortcut === color.shortcut).images.main}/>
                                                {provided.placeholder}
                                            </Box>

                                        )}
                                    </Droppable>

                                    <Paper elevation={4}>
                                        <Accordion expanded={bigAccordion}
                                                   onChange={() => setBigAccordion(!bigAccordion)}
                                                   disableGutters={true}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMore/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography>Duży format</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Droppable droppableId={color.shortcut + "_big"} type={"group"}
                                                           direction="horizontal">
                                                    {(provided) => (
                                                        <Box {...provided.droppableProps} ref={provided.innerRef}
                                                             sx={{height: bigAccordion ? 270 : 0}}>
                                                            <ImageColorList props={props}
                                                                            dropId={color.shortcut + "_big"}
                                                                            imageArray={imageArray.find(e => e.shortcut === color.shortcut).images.big}/>
                                                            {provided.placeholder}
                                                        </Box>

                                                    )}
                                                </Droppable>

                                            </AccordionDetails>
                                        </Accordion>


                                        <Accordion expanded={oldAccordion}
                                                   onChange={() => setOldAccordion(!oldAccordion)}
                                                   disableGutters={true}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMore/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography>Archiwalne</Typography>
                                                <Typography sx={{color: "text.secondary", ml: 10}}>Nie
                                                    używać</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Droppable droppableId={color.shortcut + "_old"} type={"group"}
                                                           direction="horizontal" style="overflow-y: scroll;">
                                                    {(provided) => (
                                                        <Box {...provided.droppableProps} ref={provided.innerRef}
                                                             sx={{height: oldAccordion ? 270 : 0}}>
                                                            <ImageColorList props={props}
                                                                            dropId={color.shortcut + "_old"}
                                                                            imageArray={imageArray.find(e => e.shortcut === color.shortcut).images.old}/>
                                                            {provided.placeholder}
                                                        </Box>

                                                    )}
                                                </Droppable>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Paper>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    );
                })}
            </DragDropContext>
            <Fade in={edited}>
                <Button variant="outlined" startIcon={<Save/>}
                        disabled={processing}
                        onClick={saveImages}
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


const ImageColorList = ({props, dropId, imageArray}) => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("sm"));
    const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [open, setOpen] = useState(false);

    // console.log(props)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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

    function PaperComponent(props) {
        return (
            <ReactDraggable
                handle="#draggable-dialog-title"
                cancel={"[class*=\"MuiDialogContent-root\"]"}
            >
                <Paper {...props} />
            </ReactDraggable>
        );
    }


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
        console.log(dropId)
    };


    return (
        <>

            <Box
                className="pswp-gallery" id={"pswp-gallery"}
                sx={{
                    py: 1,
                    width: 1,
                    overflowY: "hidden",
                    overflowX: "auto",
                }}>
                <Box sx={{
                    display: "flex",
                    gap: 1,
                    "&>.MuiBox-root": {
                        borderStyle: "solid",
                        borderColor: "transparent",
                        borderWidth: 3,
                    },

                    ...(dropId.includes("main") && {
                        "&>.MuiBox-root:first-of-type": {
                            borderColor: "info.main",
                        },
                    })


                }}>


                    {imageArray.map((num, i) => {
                        return (
                            <Draggable draggableId={dropId + "_" + i} key={dropId + "_" + i} index={i}>

                                {(provided) => (
                                    <Box
                                        {...provided.dragHandleProps}
                                        {...provided.draggableProps}
                                        ref={provided.innerRef}
                                    >
                                        <Box sx={{
                                            position: "relative",
                                            "&:hover": {
                                                "& .MuiBox-root": {
                                                    opacity: "100%"
                                                }

                                            }
                                        }}>
                                            <Box sx={{
                                                "& .product-image": {
                                                    height: 200,
                                                    maxWidth: "fit-content"
                                                }
                                            }}>
                                                <a
                                                    href={route("images", {path: "brak.jpg"})}
                                                    data-pswp-width={645}
                                                    data-pswp-height={960}
                                                    key={"pswp-gallery" + "-" + "1"}//index
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={"relative"}
                                                >

                                                    <img
                                                        src={route("images", {path: "brak.jpg"})}
                                                        // srcSet={`https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                        alt={"brak"}
                                                        className={"product-image"}
                                                        loading="lazy"
                                                    />

                                                </a>
                                            </Box>

                                            <Box sx={{
                                                // bgcolor: "yellow",
                                                width: "70px",
                                                height: "70px",
                                                overflow: "hidden",
                                                position: "absolute",
                                                top: "-2px",
                                                left: "-2px",
                                                "&::before, &::after": {
                                                    position: "absolute",
                                                    zIndex: -1,
                                                    content: "''",
                                                    display: "block",
                                                    border: "5px solid #2980b9",
                                                    borderTopColor: "transparent",
                                                    borderLeftColor: "transparent",
                                                },
                                                "&::before": {
                                                    top: 0,
                                                    right: 8,
                                                },
                                                "&::after": {
                                                    bottom: 8,
                                                    left: 0,
                                                },

                                            }}>
                                                <Typography variant="body2" gutterBottom sx={{
                                                    right: "-5px",
                                                    top: "15px",
                                                    transform: "rotate(-45deg)",

                                                    position: "absolute",
                                                    display: "block",
                                                    width: "100px",
                                                    padding: "5px 0",
                                                    backgroundColor: "#3498db",
                                                    boxShadow: "0 5px 10px rgba(0,0,0,.1)",
                                                    color: "#fff",
                                                    textShadow: "0 1px 1px rgba(0,0,0,.2)",
                                                    textTransform: "uppercase",
                                                    textAlign: "center",
                                                    fontSize: 6
                                                }}>
                                                    Udostępnione
                                                </Typography>

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
                                                transition: "opacity 0.3s ease-in-out",

                                            }}>
                                                {props.editing ?
                                                    <Tooltip title="Info">
                                                        <IconButton onClick={InfoImg}>
                                                            <Info sx={{fontSize: 20, color: "menuText.main"}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    : ""}
                                                <Tooltip title="Download">
                                                    <IconButton onClick={() => {
                                                        downloadImg("brak.jpg", route("images", {path: "brak.jpg"}));
                                                    }}>
                                                        <FileDownload sx={{fontSize: 20, color: "menuText.main"}}/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Copy">
                                                    <IconButton onClick={() => {
                                                        copyImg(route("images", {path: "brak.jpg"}));
                                                    }}>
                                                        <ContentCopy sx={{fontSize: 20, color: "menuText.main"}}/>
                                                    </IconButton>
                                                </Tooltip>
                                                {props.editing ?
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={deleteImg}>
                                                            <Delete sx={{fontSize: 20, color: "menuText.main"}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    : ""}
                                            </Box>
                                        </Box>
                                    </Box>
                                )}


                            </Draggable>
                        );
                    })
                    }
                </Box>
            </Box>


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
        </>
    );
}
