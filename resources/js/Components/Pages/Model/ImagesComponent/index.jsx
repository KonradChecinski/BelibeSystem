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
import {Add, ContentCopy, Delete, ExpandMore, FileDownload, Info, Save} from "@mui/icons-material";
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
import DropzoneImagesAddDialog from "@/Components/Dialogs/ModelImageDialog/DropzoneImagesAddDialog";
import ImagesDeleteDialog from "@/Components/Dialogs/ModelImageDialog/ImageDeleteDialog";
import ImagesInfoDialog from "@/Components/Dialogs/ModelImageDialog/ImageInfoDialog";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";


export default function ImagesComponent(props) {
    const [edited, setEdited] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const [accordion, setAccordion] = useState(
        props.productModel.colors_with_images
            .sort(sortByColorShortcut)
            .map((color) => {
                    const {id, shortcut} = color
                    return {id: id, shortcut: shortcut, '2': false, '3': false}
                }
            ))

    const makeDataStructure = () => {
        let newData = [...props.productModel.colors_with_images.map(({id, shortcut, images}) => ({
            id,
            shortcut,
            images: images.reduce((group, image) => {
                const {type} = image;
                group[type] = group[type] ?? [];
                group[type].push(image);
                return group;
            }, {})
        }))]

        const typeOfImages = [1, 2, 3]
        for (const row of newData) {
            for (const type of typeOfImages) {
                row.images[type] = row.images[type] ?? []
                row.images[type].sort((a, b) => a.order - b.order);
            }
        }

        return newData
    }


    const {data, setData, processing, put} = useForm(makeDataStructure())


    useEffect(() => {

        setData(makeDataStructure())

        setAccordion(props.productModel.colors_with_images
            .sort(sortByColorShortcut)
            .map((color) => {
                    const {id, shortcut} = color
                    return {id: id, shortcut: shortcut, '2': false, '3': false}
                }
            ))
    }, [props]);


    const saveImages = () => {

        put(route("system.products.images.update.order", {productModel: props.productModel.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano kolejność zdjęć", {variant: 'success'})
            },
            onError: params => {
                console.error(params);
                enqueueSnackbar("Błąd przy zapisywaniu kolejności zdjęć", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    const onDragEnd = (e) => {
        // console.log(e)
        // console.log("1", data)

        if (!e.destination) return;
        if (e.source.droppableId === e.destination.droppableId && e.source.index === e.destination.index) return;

        setEdited(true);

        const newImageArray = [...data]

        //Source
        const sourceId = e.source.droppableId.split("_")[0]
        const sourceType = e.source.droppableId.split("_")[1]
        const sourceIndex = e.source.index
        let sourceImageRow = newImageArray.find(e => e.id === Number(sourceId)).images[sourceType]

        //Destination
        const destinationId = e.destination.droppableId.split("_")[0]
        const destinationType = e.destination.droppableId.split("_")[1]
        const destinationIndex = e.destination.index
        let destinationImageRow = newImageArray.find(e => e.id === Number(destinationId)).images[destinationType]

        const dropElement = sourceImageRow.splice(sourceIndex, 1)[0]
        destinationImageRow.splice(destinationIndex, 0, dropElement)
    }
    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {props.productModel.colors_with_images.map((color) => {
                    if (accordion.find(e => e.id === color.id)) {
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
                                        <Droppable droppableId={color.id + "_1"} type={"group"}
                                                   direction="horizontal">
                                            {(provided) => (
                                                <Box {...provided.droppableProps} ref={provided.innerRef}
                                                     sx={{height: 270}}>
                                                    <ImageColorList props={props} dropId={color.id + "_1"}
                                                                    color={color}
                                                                    modelSymbol={props.productModel.symbol}
                                                                    imageArray={data.find(e => e.id === color.id).images[1] ?
                                                                        data.find(e => e.id === color.id).images[1] : []}/>

                                                    {provided.placeholder}
                                                </Box>

                                            )}
                                        </Droppable>

                                        <Paper elevation={4}>
                                            <Accordion expanded={accordion.find(e => e.id === color.id)[2]}
                                                       onChange={() => {
                                                           let object = accordion.find(e => e.id === color.id)
                                                           object[2] = !object[2]

                                                           setAccordion([...accordion, object])
                                                       }}
                                                       disableGutters={true}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMore/>}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Typography>Duży format</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Droppable droppableId={color.id + "_2"} type={"group"}
                                                               direction="horizontal">
                                                        {(provided) => (
                                                            <Box {...provided.droppableProps} ref={provided.innerRef}
                                                                 sx={{height: accordion.find(e => e.id === color.id)[2] ? 270 : 0}}>
                                                                <ImageColorList props={props}
                                                                                dropId={color.id + "_2"}
                                                                                color={color}
                                                                                modelSymbol={props.productModel.symbol}
                                                                                imageArray={data.find(e => e.id === color.id).images[2] ?
                                                                                    data.find(e => e.id === color.id).images[2] : []}/>
                                                                {provided.placeholder}
                                                            </Box>

                                                        )}
                                                    </Droppable>

                                                </AccordionDetails>
                                            </Accordion>

                                            {}
                                            <Accordion expanded={accordion.find(e => e.id === color.id)[3]}
                                                       onChange={() => {
                                                           let object = accordion.find(e => e.id === color.id)
                                                           object[3] = !object[3]

                                                           setAccordion([...accordion, object])
                                                       }}
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
                                                    <Droppable droppableId={color.id + "_3"} type={"group"}
                                                               direction="horizontal" style="overflow-y: scroll;">
                                                        {(provided) => (
                                                            <Box {...provided.droppableProps} ref={provided.innerRef}
                                                                 sx={{height: accordion.find(e => e.id === color.id)[3] ? 270 : 0}}>
                                                                <ImageColorList props={props}
                                                                                dropId={color.id + "_3"}
                                                                                color={color}
                                                                                modelSymbol={props.productModel.symbol}
                                                                                imageArray={data.find(e => e.id === color.id).images[3] ?
                                                                                    data.find(e => e.id === color.id).images[3] : []}/>
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
                        )
                    }
                })}
            </DragDropContext>
            {props.editing ?
                <>
                    <Button variant="outlined" startIcon={<Add/>}
                            onClick={() => setOpenAddDialog(true)}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 100,
                            }}>
                        Dodaj
                    </Button>
                    <DropzoneImagesAddDialog open={openAddDialog} setOpen={setOpenAddDialog} props={props}/>


                    <Fade in={edited}>
                        <Button variant="outlined" startIcon={<Save/>}
                                disabled={processing}
                                onClick={saveImages}
                                sx={{
                                    position: "absolute",
                                    top: 7,
                                    right: 200,
                                }}>
                            Zapisz
                        </Button>
                    </Fade>
                </>
                : ""}

        </>
    );
}


const ImageColorList = ({props, dropId, imageArray, modelSymbol, color}) => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("sm"));
    const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const {delete: remove} = useForm()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(
        imageArray.map((image, i) => {
            return false
        })
    )
    const handleSetOpenDeleteDialog = (index, value) => {
        let array = [...openDeleteDialog]
        array[index] = value
        setOpenDeleteDialog(array)
    }
    const handleOpenDeleteDialog = (index) => {
        return openDeleteDialog[index]
    }

    const [openInfoDialog, setOpenInfoDialog] = useState(
        imageArray.map((image, i) => {
            return false
        })
    )
    const handleSetOpenInfoDialog = (index, value) => {
        let array = [...openInfoDialog]
        array[index] = value
        setOpenInfoDialog(array)
    }
    const handleOpenInfoDialog = (index) => {
        return openInfoDialog[index]
    }


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
                        // console.log("change");
                        el.href = pswp.currSlide.data.src;
                    });
                }
            });
        });
        lightbox.init();

        setOpenDeleteDialog([...imageArray.map((image, i) => {
                return false
            }
        )])

        setOpenInfoDialog([...imageArray.map((image, i) => {
                return false
            }
        )])

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
                console.error("copyImg - Error: ", e.message);
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

    const deleteImg = (image) => {

        // console.log(image)
        // remove(route("system.products.images.delete", {image: image.id}),
        //
        //     {
        //         preserveScroll: true,
        //         onSuccess: (e) => {
        //
        //             enqueueSnackbar("Usunięto zdjęcie", {variant: 'success'})
        //         },
        //         onError: errors => {
        //             enqueueSnackbar("Błąd przy usuwaniu zdjęć", {variant: 'error'})
        //             console.error(errors)
        //         },
        //     })
    };

    const InfoImg = () => {
        handleClickOpen();
        // console.log(dropId)
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

                    ...(dropId.includes("_1") && {
                        "&>.MuiBox-root:first-of-type": {
                            borderColor: "info.main",
                        },
                    })


                }}>

                    {imageArray.map((image, i) => {
                        return (
                            <Draggable draggableId={dropId + "_" + i} key={dropId + "_" + i} index={i}
                                       isDragDisabled={!props.editing}>

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
                                                    href={route("images", {slug: image.slug})}
                                                    data-pswp-width={image.width}
                                                    data-pswp-height={image.height}
                                                    key={"pswp-gallery" + "-" + "1"}//index
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={"relative"}
                                                >
                                                    <img
                                                        src={route("images", {slug: image.slug})}
                                                        // srcSet={`https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                        alt={"brak"}
                                                        className={"product-image"}
                                                        loading="lazy"
                                                    />

                                                </a>
                                            </Box>

                                            {image.publish ?
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

                                                : ""}

                                            {image.main ?
                                                <Box sx={{
                                                    // bgcolor: "yellow",
                                                    width: "50px",
                                                    height: "50px",
                                                    overflow: "hidden",
                                                    position: "absolute",
                                                    bottom: "-2px",
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
                                                        right: "0px",
                                                        top: "25px",
                                                        transform: "rotate(45deg)",

                                                        position: "absolute",
                                                        display: "block",
                                                        width: "70px",
                                                        padding: "5px 0",
                                                        backgroundColor: image.main === 1 ? "#13770e" : "#810fa4",
                                                        boxShadow: "0 5px 10px rgba(0,0,0,.1)",
                                                        color: "#fff",
                                                        textShadow: "0 1px 1px rgba(0,0,0,.2)",
                                                        textTransform: "uppercase",
                                                        textAlign: "center",
                                                        fontSize: 6
                                                    }}>
                                                        {image.main === 1 ? "Pierwsze" : "Drugie"}
                                                    </Typography>

                                                </Box>

                                                : ""}

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
                                                    <>
                                                        <Tooltip title="Info">
                                                            <IconButton
                                                                onClick={() => handleSetOpenInfoDialog(i, true)}>
                                                                <Info sx={{fontSize: 20, color: "menuText.main"}}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <ImagesInfoDialog open={Boolean(handleOpenInfoDialog(i))}
                                                                          setOpen={(value) => handleSetOpenInfoDialog(i, value)}
                                                                          image={image}
                                                                          props={props}/>
                                                    </>

                                                    : ""}
                                                <Tooltip title="Download">
                                                    <IconButton onClick={() => {
                                                        // downloadImg(image.path.replaceAll("\\\\", "-").replaceAll("\\", "-"), route("images", {slug: image.slug}));
                                                        downloadImg(modelSymbol + "-" + color.shortcut + "-" + (i + 1), route("images", {slug: image.slug}));
                                                    }}>
                                                        <FileDownload sx={{fontSize: 20, color: "menuText.main"}}/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Copy">
                                                    <IconButton onClick={() => {
                                                        copyImg(route("images", {slug: image.slug}));
                                                    }}>
                                                        <ContentCopy sx={{fontSize: 20, color: "menuText.main"}}/>
                                                    </IconButton>
                                                </Tooltip>
                                                {props.editing && props.auth.permissions.includes("deleteImages") ?
                                                    <>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                onClick={() => handleSetOpenDeleteDialog(i, true)}>
                                                                <Delete sx={{fontSize: 20, color: "menuText.main"}}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <ImagesDeleteDialog open={Boolean(handleOpenDeleteDialog(i))}
                                                                            setOpen={(value) => handleSetOpenDeleteDialog(i, value)}
                                                                            image={image}
                                                                            params={props}/>
                                                    </>

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


        </>
    );
}
