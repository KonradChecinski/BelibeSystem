import {Avatar, Divider, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {Link, router} from "@inertiajs/react";
import {History, Logout, Payment, Person, ReceiptLong, Savings, Settings} from "@mui/icons-material";
import * as PropTypes from "prop-types";
import {useLaravelReactI18n} from "laravel-react-i18n";
import UserAvatar from "@/Components/Layout/UserAvatar";

export default function B2bUserAvatarMenu({anchorEl, open, onClose, accountManager, props}) {
    const {t} = useLaravelReactI18n();


    const handleLogoutClick = () => {
        onClose()
        router.post(route("logout"))
    }
    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            hideBackdrop={true}
            disableScrollLock
            // slotProps={{
            //     Paper:
            //         {
            //             elevation: 0,
            //             // sx: {
            //             //     overflow: "visible",
            //             //     filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            //             //     mt: 1.5,
            //             //     "& .MuiAvatar-root": {
            //             //         width: 32,
            //             //         height: 32,
            //             //         ml: -0.5,
            //             //         mr: 1
            //             //     },
            //             //     "&:before": {
            //             //         content: "\"\"",
            //             //         display: "block",
            //             //         position: "absolute",
            //             //         top: 0,
            //             //         right: 14,
            //             //         width: 10,
            //             //         height: 10,
            //             //         bgcolor: "background.paper",
            //             //         transform: "translateY(-50%) rotate(45deg)",
            //             //         zIndex: 0
            //             //     }
            //             // }
            //         }
            // }}
            transformOrigin={{
                horizontal: "right",
                vertical: "top"
            }}
            anchorOrigin={{
                horizontal: "right",
                vertical: "bottom"
            }}
        >
            <Link href={route("b2b.client")}>
                <MenuItem onClick={onClose}>
                    <ListItemIcon sx={{mr: 2}}>

                        <Avatar>
                            <Person fontSize={"large"}/>
                        </Avatar>
                    </ListItemIcon>

                    <ListItemText>{t("Client zone")}</ListItemText>
                </MenuItem>
            </Link>

            <Divider/>

            <Link href={route("b2b.orders")}>
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <History fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        {t("Orders")}
                    </ListItemText>
                </MenuItem>
            </Link>
            <Link href={route("b2b.invoices")}>
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <ReceiptLong fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        {t("Invoices")}
                    </ListItemText>
                </MenuItem>
            </Link>
            <Link href={route("b2b.settlements")}>
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <Payment fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        {t("Settlements")}
                    </ListItemText>
                </MenuItem>
            </Link>

            <Divider/>


            <MenuItem onClick={handleLogoutClick} disabled={accountManager}>
                <ListItemIcon>
                    <Logout fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    {t("Logout")}
                </ListItemText>
            </MenuItem>

        </Menu>
    );
}

B2bUserAvatarMenu.propTypes = {
    anchorEl: PropTypes.any,
    open: PropTypes.bool,
    onClose: PropTypes.func,

    props: PropTypes.any,
};
