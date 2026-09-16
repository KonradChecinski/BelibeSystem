import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem
} from "@mui/material";
import {
    Delete,
    FileDownload,
    LocalShipping,
    MoreVert,
    Print
} from "@mui/icons-material";
import {useState} from "react";
import axios from "axios";
import {router, usePage} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function ShipmentMenu({row, auth: propAuth}) {
    const pageAuth = usePage()?.props?.auth;
    const auth = propAuth || pageAuth || {permissions: []};

    const canEdit = auth?.permissions?.includes("editShipments");
    const canDelete = auth?.permissions?.includes("deleteShipments");

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const shipment = row?.original;

    if (!canEdit && !canDelete) {
        return null;
    }

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSendToCourier = async () => {
        handleMenuClose();
        if (!shipment?.id) return;

        setLoading(true);
        try {
            const response = await axios.post(route("system.shipments.send", {shipment: shipment.id}));
            const message = response.data?.message || "Przesyłka została przekazana do kuriera.";
            enqueueSnackbar(message, {variant: "success"});
            router.reload({preserveScroll: true});
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Wystąpił błąd podczas wysyłania do firmy kurierskiej.";
            enqueueSnackbar(message, {variant: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLabel = async () => {
        handleMenuClose();
        if (!shipment?.id) return;

        setLoading(true);
        try {
            const response = await axios.post(route("system.shipments.label", {shipment: shipment.id}));
            const message = response.data?.message || "Etykieta została wygenerowana.";
            enqueueSnackbar(message, {variant: "success"});
            router.reload({preserveScroll: true});
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Wystąpił błąd podczas generowania etykiety.";
            enqueueSnackbar(message, {variant: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadLabel = () => {
        handleMenuClose();
        if (!shipment?.id) return;

        window.open(route("system.shipments.label.download", {shipment: shipment.id}), "_blank");
    };

    const handleOpenDelete = () => {
        handleMenuClose();
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        if (!shipment?.id) {
            handleCloseDeleteDialog();
            return;
        }

        handleCloseDeleteDialog();
        setLoading(true);
        try {
            await axios.delete(route("system.shipments.delete", {shipment: shipment.id}));
            enqueueSnackbar("Paczka została usunięta.", {variant: "success"});
            router.reload({preserveScroll: true});
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Wystąpił błąd podczas usuwania paczki.";
            enqueueSnackbar(message, {variant: "error"});
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box>
                <IconButton
                    aria-label="more"
                    onClick={handleMenuClick}
                >
                    <MoreVert/>
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
            >
                {canEdit && (
                    <>
                        <MenuItem
                            disabled={Boolean(shipment?.external_number)}
                            onClick={handleSendToCourier}
                        >
                            <ListItemIcon><LocalShipping/></ListItemIcon>
                            <ListItemText>Wysyłanie informacji do firmy kurierskiej</ListItemText>
                        </MenuItem>

                        <Divider/>

                        <MenuItem
                            disabled={!Boolean(shipment?.external_number) || Boolean(shipment?.label_path)}
                            onClick={handleGenerateLabel}
                        >
                            <ListItemIcon><Print/></ListItemIcon>
                            <ListItemText>Generowanie etykiety kurierskiej</ListItemText>
                        </MenuItem>

                        <MenuItem
                            disabled={!shipment?.label_path}
                            onClick={handleDownloadLabel}
                        >
                            <ListItemIcon><FileDownload/></ListItemIcon>
                            <ListItemText>Pobieranie etykiety kurierskiej</ListItemText>
                        </MenuItem>
                    </>
                )}

                {canEdit && canDelete && <Divider/>}

                {canDelete && (
                    <MenuItem onClick={handleOpenDelete}>
                        <ListItemIcon><Delete color="error"/></ListItemIcon>
                        <ListItemText sx={{color: 'error.main'}}>Usuwanie paczki</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Usuwanie paczki</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć tę paczkę
                        {shipment?.id ? ` (ID: ${shipment.id})` : ''}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        disabled={loading}
                    >
                        Anuluj
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                        disabled={loading}
                    >
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={loading}
                disableEscapeKeyDown
                PaperProps={{
                    sx: {
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: 3,
                        borderRadius: 2,
                    }
                }}
            >
                <CircularProgress/>
            </Dialog>
        </>
    );
}
