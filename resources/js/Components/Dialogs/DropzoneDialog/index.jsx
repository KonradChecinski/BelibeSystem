import {DropzoneArea, DropzoneAreaBase, DropzoneDialog} from "mui-file-dropzone";
import Button from "@mui/material/Button";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function DropzoneImagesAddDialog(props) {

    const [open, setOpen] = useState(false)

    const {data, setData, post, processing, errors, clearErrors, reset} = useForm({
        model_color_id: 1,
        type: 1,
        files: []
    })


    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = (files) => {
        // setOpen(false)
        setData("files", files)
        console.log(data)

        post(route("system.products.images.create", {modelColor: data.model_color_id}),

            {
                preserveScroll: true,
                onSuccess: (e) => {

                    reset();
                    enqueueSnackbar("Dodano zdjęcia", {variant: 'success'})
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy dodawniu zdjęć", {variant: 'error'})
                    console.error(errors)
                },
            })
    }
    const handleOpen = () => {
        setOpen(true)

    }

    return (
        <div>
            <Button onClick={handleOpen}>Add Image</Button>
            <DropzoneDialog
                open={open}
                onSave={(e) => handleSave(e)}
                acceptedFiles={["image/jpeg", "image/png"]}
                showPreviews={true}
                maxFileSize={5000000}
                filesLimit={10}
                onClose={handleClose}
                submitButtonText={"Wyślij"}
                cancelButtonText={"Zamknij"}
                dialogTitle={"Wysyłanie zdjęć"}
                showAlerts={null}
                onAlert={(text, type) => {
                }}
                previewText={"Podgląd"}
                showPreviewsInDropzone={false}
                showFileNamesInPreview={false}
                getFileRemovedMessage={(e) => enqueueSnackbar("Usunięto " + e + "", {variant: "default"})}
                getDropRejectMessage={(e) => enqueueSnackbar("Plik " + e.name + " jest niedozwolonego typu", {variant: "warning"})}
                getFileAddedMessage={(e) => enqueueSnackbar("Dodano " + e, {variant: "info"})}
                getFileLimitExceedMessage={(e) => enqueueSnackbar("Przekroczono ilość dozwolonych zdjęć w pojedyńczym przesłaniu: " + e, {variant: "error"})}
                dropzoneText={"Przeciągnij plik lub kliknij tutaj"}

            />
        </div>
    );

}
