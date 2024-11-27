import {Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {Cancel, Edit, ListAlt, MoreVert, SettingsBackupRestore, TaskAlt} from "@mui/icons-material";
import {useEffect, useState} from "react";
import OrderDetails from "@/Components/Pages/Orders/Other/OrderDetails";

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

                <MenuItem disabled={![1].includes(row.original.status)}>
                    <ListItemIcon><TaskAlt/></ListItemIcon>
                    <ListItemText>Zaakceptuj zamówienie</ListItemText>
                </MenuItem>
                <MenuItem disabled={![1, 20, 55, 90].includes(row.original.status)}>
                    <ListItemIcon><Cancel/></ListItemIcon>
                    <ListItemText>Anuluj zamówienie</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![55, 90].includes(row.original.status)}>
                    <ListItemIcon><SettingsBackupRestore/></ListItemIcon>
                    <ListItemText>Ponów dodawanie do subiekta</ListItemText>
                </MenuItem>

                <Divider/>

                <MenuItem disabled={![1, 20, 55, 90, 100, 0].includes(row.original.status)}
                          onClick={handleOpenDetails}>
                    <ListItemIcon><ListAlt/></ListItemIcon>
                    <ListItemText>Szczegóły zamówienia</ListItemText>
                </MenuItem>
                {/*<MenuItem disabled={![1].includes(row.original.status)}*/}
                {/*          onClick={handleOpenDetailsEdit}>*/}
                {/*    <ListItemIcon><Edit/></ListItemIcon>*/}
                {/*    <ListItemText>Edytuj</ListItemText>*/}
                {/*</MenuItem>*/}
            </Menu>
            <OrderDetails open={openDetails} handleClose={handleCloseDetails} row={row}/>
        </>
    );

}
