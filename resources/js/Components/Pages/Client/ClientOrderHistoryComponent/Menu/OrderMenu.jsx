import {Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {Cancel, Edit, ListAlt, MoreVert, SettingsBackupRestore, TaskAlt} from "@mui/icons-material";
import {useEffect, useState} from "react";
import OrderDetails from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetails";
import OrderDetailsEdit from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetailsEdit";

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


    //Details Edit
    const [openDetailsEdit, setOpenDetailsEdit] = useState(false);
    const handleOpenDetailsEdit = () => {
        setOpenDetailsEdit(true);
        handleMenuClose()
    };
    const handleCloseDetailsEdit = () => {
        setOpenDetailsEdit(false);
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

                <MenuItem disabled={![1].includes(row.original.status)}
                          onClick={() => console.log("accept")}>
                    <ListItemIcon><TaskAlt/></ListItemIcon>
                    <ListItemText>Zaakceptuj zamówienie</ListItemText>
                </MenuItem>
                <MenuItem disabled={![1, 2, 3, 4].includes(row.original.status)}
                          onClick={() => console.log("cancel")}>
                    <ListItemIcon><Cancel/></ListItemIcon>
                    <ListItemText>Anuluj zamówienie</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![3, 4].includes(row.original.status)}
                          onClick={() => console.log("subiekt")}>
                    <ListItemIcon><SettingsBackupRestore/></ListItemIcon>
                    <ListItemText>Ponów dodawanie do subiekta</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![1].includes(row.original.status)}
                          onClick={handleOpenDetails}>
                    <ListItemIcon><ListAlt/></ListItemIcon>
                    <ListItemText>Szczegóły zamówienia</ListItemText>
                </MenuItem>
                <MenuItem disabled={![1].includes(row.original.status)}
                          onClick={handleOpenDetailsEdit}>
                    <ListItemIcon><Edit/></ListItemIcon>
                    <ListItemText>Edytuj</ListItemText>
                </MenuItem>
            </Menu>
            <OrderDetails open={openDetails} handleClose={handleCloseDetails} row={row}/>
            <OrderDetailsEdit open={openDetailsEdit} handleClose={handleCloseDetailsEdit} row={row}/>
        </>
    );

}
