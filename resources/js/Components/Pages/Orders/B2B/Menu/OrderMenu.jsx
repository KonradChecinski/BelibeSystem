import {Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {
    Cancel,
    Edit,
    ListAlt,
    MoreVert,
    Receipt,
    ReceiptLong,
    SettingsBackupRestore,
    TaskAlt
} from "@mui/icons-material";
import {useEffect, useState} from "react";
import OrderDetails from "@/Components/Pages/Orders/B2B/OrderDetails";
import OrderDetailsEdit from "@/Components/Pages/Orders/B2B/OrderDetailsEdit";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function OrderMenu({row}) {
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

    const handleCancel = () => {
        router.patch(
            route("system.orders.order.b2b.update.status", {clientOrder: row.original.id}),
            {
                status: 0
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    handleMenuClose()
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
                <MenuItem disabled={![1, 20, 50, 55, 60, 90].includes(row.original.status)}
                          onClick={handleCancel}>
                    <ListItemIcon><Cancel/></ListItemIcon>
                    <ListItemText>Anuluj zamówienie</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![60, 90].includes(row.original.status)}
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

                <Divider/>

                <MenuItem disabled={![1, 20, 50, 55, 60, 90, 100, 0].includes(row.original.status)}
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
            {/*<OrderDetailsEdit open={openDetailsEdit} handleClose={handleCloseDetailsEdit} row={row}/>*/}
        </>
    );

}
