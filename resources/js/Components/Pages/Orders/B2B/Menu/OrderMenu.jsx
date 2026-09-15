import {
    Box,
    Button,
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
    Cancel, Done,
    Edit,
    ListAlt, LocalShipping,
    MoreVert,
    Receipt,
    ReceiptLong,
    SettingsBackupRestore,
    TaskAlt
} from "@mui/icons-material";
import {useEffect, useState} from "react";
import OrderDetails from "@/Components/Pages/Orders/B2B/OrderDetails";
import OrderDetailsEdit from "@/Components/Pages/Orders/B2B/OrderDetailsEdit";
import DeliveryAddDialog from "@/Components/Dialogs/DeliveriesDialog/DeliveryAddDialog";
import {router, usePage} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function OrderMenu({row, ...props}) {
    const pageAuth = usePage()?.props?.auth;
    const auth = props?.auth || pageAuth;

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    //Details
    const [openDetails, setOpenDetails] = useState(false);
    const handleOpenDetails = () => {
        setOpenDetails(true);
        handleMenuClose()
    };
    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    // Delivery Add Dialog
    const [openDeliveryAdd, setOpenDeliveryAdd] = useState(false);
    const handleOpenDeliveryAdd = () => {
        setOpenDeliveryAdd(true);
        handleMenuClose();
    };

    // Cancel Dialog
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const handleOpenCancelDialog = () => {
        setOpenCancelDialog(true);
        handleMenuClose();
    };
    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
    };

    // End Dialog
    const [openEndDialog, setOpenEndDialog] = useState(false);
    const handleOpenEndDialog = () => {
        setOpenEndDialog(true);
        handleMenuClose();
    };
    const handleCloseEndDialog = () => {
        setOpenEndDialog(false);
    };

    // //Details Edit
    // const [openDetailsEdit, setOpenDetailsEdit] = useState(false);
    // const handleOpenDetailsEdit = () => {
    //     setOpenDetailsEdit(true);
    //     handleMenuClose()
    // };
    // const handleCloseDetailsEdit = () => {
    //     setOpenDetailsEdit(false);
    // };


    const handleAccept = () => {
        router.patch(
            route("system.orders.order.b2b.update.status", {clientOrder: row.original.id}),
            {
                status: 20
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    handleMenuClose()
                    enqueueSnackbar("Zaakceptowano zamówienie", {variant: 'success'})
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy akceptacji zamówienia", {variant: 'error'})
                }
            }
        )
    };

    const handleConfirmCancel = () => {
        handleCloseCancelDialog();
        router.patch(
            route("system.orders.order.b2b.update.status", {clientOrder: row.original.id}),
            {
                status: 0
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Anulowano zamówienie", {variant: 'success'})
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy anulowaniu zamówienia", {variant: 'error'})
                }
            }
        )
    };

    const handleProcessAgain = () => {
        router.patch(
            route("system.orders.order.b2b.update.status", {clientOrder: row.original.id}),
            {
                status: 60
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    handleMenuClose()
                    enqueueSnackbar("Zlecono zamówienie do ponownej realizacji", {variant: 'success'})
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy zlecaniu zamówienia do ponownej realizacji", {variant: 'error'})
                }
            }
        )
    };

    const handleConfirmEnd = () => {
        handleCloseEndDialog();
        router.patch(
            route("system.orders.order.b2b.update.status", {clientOrder: row.original.id}),
            {
                status: 100
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Zakończono zamówienie", {variant: 'success'})
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy kończeniu zamówienia", {variant: 'error'})
                }
            }
        )
    };

    const handleGetInvoice = () => {
        console.log('handleGetInvoice')
        router.post(
            route("system.orders.order.b2b.create.invoice", {clientOrder: row.original.id}),
            {
                // status: 2
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    handleMenuClose()
                    enqueueSnackbar("Zlecono wygenerowanie faktury", {variant: 'success'})
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy zlecaniu wygenerowania faktury", {variant: 'error'})
                }
            }
        )
    };

    const handleEdit = () => {

    }

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

                <MenuItem disabled={![1].includes(row.original.status)}
                          onClick={handleAccept}>
                    <ListItemIcon><TaskAlt/></ListItemIcon>
                    <ListItemText>Zaakceptuj zamówienie</ListItemText>
                </MenuItem>
                <MenuItem disabled={![1, 20, 50, 55, 60, 70].includes(row.original.status)}
                          onClick={handleOpenCancelDialog}>
                    <ListItemIcon><Cancel/></ListItemIcon>
                    <ListItemText>Anuluj zamówienie</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![60, 70].includes(row.original.status)}
                          onClick={handleProcessAgain}>
                    <ListItemIcon><SettingsBackupRestore/></ListItemIcon>
                    <ListItemText>Ponów dodawanie do subiekta</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![100].includes(row.original.status)}
                          onClick={handleGetInvoice}>
                    <ListItemIcon><ReceiptLong/></ListItemIcon>
                    <ListItemText>Wygeneruj fakturę do zamówienia</ListItemText>
                </MenuItem>

                {auth?.permissions?.includes("createShipments") && (
                    <>
                        <Divider/>

                        <MenuItem disabled={![70, 71].includes(row.original.status)}
                                  onClick={handleOpenDeliveryAdd}
                        >
                            <ListItemIcon><LocalShipping/></ListItemIcon>
                            <ListItemText>Utwórz przesyłkę</ListItemText>
                        </MenuItem>
                    </>
                )}

                <Divider/>

                <MenuItem disabled={![1, 20, 50, 55, 60, 70, 71, 80, 85, 90, 100, 0].includes(row.original.status)}
                          onClick={handleOpenEndDialog}
                >
                    <ListItemIcon><Done/></ListItemIcon>
                    <ListItemText>Zakończ ręcznie zamówienie</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![1, 20, 50, 55, 60, 70, 71, 80, 85, 90, 100, 0].includes(row.original.status)}
                          onClick={handleOpenDetails}>
                    <ListItemIcon><ListAlt/></ListItemIcon>
                    <ListItemText>Szczegóły zamówienia</ListItemText>
                </MenuItem>
                <MenuItem disabled={![1].includes(row.original.status)}
                          onClick={() => router.post(route("system.b2b.order.edit", {clientOrder: row.original.id}))}>
                    <ListItemIcon><Edit/></ListItemIcon>
                    <ListItemText>Edytuj</ListItemText>
                </MenuItem>
            </Menu>
            <OrderDetails open={openDetails} handleClose={handleCloseDetails} row={row}/>
            {auth?.permissions?.includes("createShipments") && (
                <DeliveryAddDialog open={openDeliveryAdd} setOpen={setOpenDeliveryAdd} initialOrderId={row.original.id}
                                   initialOrderType={row.original.model_class || "App\\Models\\ClientOrder"}/>
            )}

            {/* Modal potwierdzenia anulowania zamówienia */}
            <Dialog
                open={openCancelDialog}
                onClose={handleCloseCancelDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Anulowanie zamówienia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz anulować to zamówienie
                        {row?.original?.number ? ` (${row.original.number})` : ''}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelDialog} variant="outlined">
                        Nie
                    </Button>
                    <Button onClick={handleConfirmCancel} color="error" variant="contained" autoFocus>
                        Tak, anuluj
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal potwierdzenia zakończenia zamówienia */}
            <Dialog
                open={openEndDialog}
                onClose={handleCloseEndDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Zakończenie zamówienia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz ręcznie zakończyć to zamówienie
                        {row?.original?.number ? ` (${row.original.number})` : ''}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEndDialog} variant="outlined">
                        Nie
                    </Button>
                    <Button onClick={handleConfirmEnd} color="primary" variant="contained" autoFocus>
                        Tak, zakończ
                    </Button>
                </DialogActions>
            </Dialog>
            {/*<OrderDetailsEdit open={openDetailsEdit} handleClose={handleCloseDetailsEdit} row={row}/>*/}
        </>
    );

}
