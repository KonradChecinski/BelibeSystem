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
    DialogTitle,
    IconButton,
    ImageList,
    ImageListItem,
    Paper,
    Tooltip,
    Typography
} from "@mui/material";
import {ContentCopy, Delete, ExpandMore, FileDownload, Info} from "@mui/icons-material";
import {useSnackbar} from "notistack";
import {copyImageToClipboard} from "copy-image-clipboard";
import Draggable from "react-draggable";
import {useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import * as PropTypes from "prop-types";


export default function ImagesComponent(props) {
    return (
        <>
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
                        {props.productModel.colors.map((color) => {
                            return (
                                <Paper elevation={4} key={color.id} sx={{my: 1}}>
                                    <Accordion defaultExpanded={true} disableGutters={true}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMore/>}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Kolor - {color.name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ImageColorList {...props}/>
                                        </AccordionDetails>
                                    </Accordion>
                                </Paper>
                            );
                        })}

                    </AccordionDetails>
                </Accordion>


                <Accordion defaultExpanded={false} disableGutters={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Archiwalne</Typography>
                        <Typography sx={{color: "text.secondary", ml: 10}}>Nie używać</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ImageColorList {...props}/>
                    </AccordionDetails>
                </Accordion>
            </Paper>


        </>
    );
}


const ImageColorList = (props) => {
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
            <Draggable
                handle="#draggable-dialog-title"
                cancel={"[class*=\"MuiDialogContent-root\"]"}
            >
                <Paper {...props} />
            </Draggable>
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
    };

    return (
        <>
            <div className="pswp-gallery" id={"pswp-gallery"}>
                <ImageList cols={matchDownLg ? matchDownMd ? 3 : 4 : 8} sx={{py: 1}}>
                    {Array(5).fill(1).map((num, i) => {
                        return (
                            <ImageListItem key={i} sx={{
                                "&:hover": {
                                    "& .MuiBox-root": {
                                        opacity: "100%"
                                    }

                                }
                            }}>
                                <Box>
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
                                            loading="lazy"
                                        />

                                        {/*<Chip label={`Udostępnione`} color="primary"*/}
                                        {/*      variant="outlined"*/}
                                        {/*      sx={{fontSize: 10, px: 0}}/>*/}

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
                            </ImageListItem>
                        );
                    })
                    }

                </ImageList>
            </div>


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
