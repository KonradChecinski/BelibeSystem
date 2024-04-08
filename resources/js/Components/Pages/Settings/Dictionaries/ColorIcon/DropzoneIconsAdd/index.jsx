import {DropzoneArea, DropzoneAreaBase, DropzoneDialog} from "mui-file-dropzone";
import Button from "@mui/material/Button";
import {useRef, useState} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import ReactDraggable from "react-draggable";
import {
    Autocomplete, Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, Grid,
    Paper, Stack,
    TextField, Typography
} from "@mui/material";
import {getImageSize} from 'react-image-size';

export default function DropzoneIconAdd({props, editedId, setEdited, data, setData, disabled}) {

    const refDrop = useRef();


    const changeDataFiles = async (files) => {
        let dimensions = await getImageSize(URL.createObjectURL(files[0]));
        const {height, width} = dimensions;
        if (width !== 80 || height !== 80) {
            refDrop.current.deleteFile(refDrop.current.state.fileObjects[0].file, 0)
            return;
        }
        setData(data.map(d => {
            if (d.id === editedId) {
                d.files = files;
                setEdited(true);
            }
            return d;
        }))
    }


    return (
        <Box sx={{
            "& .MuiSvgIcon-root": {
                color: disabled ? "primary.second" : ""
            }
        }}>
            <DropzoneArea
                ref={refDrop}
                acceptedFiles={["image/jpeg", "image/png"]}
                showPreviews={true}
                maxFileSize={31457280}
                filesLimit={1}
                showAlerts={null}
                onAlert={(text, type) => {
                }}
                onChange={changeDataFiles}
                clearOnUnmount={false}
                previewText={"Podgląd"}
                showPreviewsInDropzone={false}
                showFileNamesInPreview={false}
                getFileRemovedMessage={(e) => enqueueSnackbar("Usunięto " + e + "", {variant: "default"})}
                getDropRejectMessage={(e) => enqueueSnackbar("Plik " + e.name + " jest niedozwolonego typu", {variant: "warning"})}
                getFileAddedMessage={(e) => enqueueSnackbar("Dodano " + e, {variant: "info"})}
                getFileLimitExceedMessage={(e) => enqueueSnackbar("Przekroczono ilość dozwolonych zdjęć w pojedyńczym przesłaniu: " + e, {variant: "error"})}
                dropzoneText={disabled ?
                    <Typography variant="h5" component="span" sx={{color: "primary.second"}}>
                        Nie można dodać pliku
                    </Typography>
                    :
                    <Typography variant="h5" component="span">
                        Przeciągnij plik lub kliknij tutaj
                    </Typography>
                }
                inputProps={{disabled: disabled}}
                dropzoneProps={{disabled: disabled}}

            />
        </Box>

    );

}

