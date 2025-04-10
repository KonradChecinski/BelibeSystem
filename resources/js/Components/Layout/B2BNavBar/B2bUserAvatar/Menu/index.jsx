import {Avatar, Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {Link, router} from "@inertiajs/react";
import {
    Favorite,
    History,
    ImportExport,
    Logout,
    Payment,
    Person,
    ReceiptLong,
    Savings,
    Settings
} from "@mui/icons-material";
import * as PropTypes from "prop-types";
import {useLaravelReactI18n} from "laravel-react-i18n";
import UserAvatar from "@/Components/Layout/UserAvatar";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function B2bUserAvatarMenu({anchorEl, open, onClose, accountManager, props}) {
    const {t} = useLaravelReactI18n();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));


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
            transformOrigin={{
                horizontal: "right",
                vertical: "top"
            }}
            anchorOrigin={{
                horizontal: "right",
                vertical: "bottom"
            }}
        >
            <Box>
                <Link href={route("b2b.client")}>
                    <MenuItem onClick={onClose}>
                        <ListItemIcon sx={{mr: 1}}>

                            <Avatar>
                                <Person fontSize={"large"}/>
                            </Avatar>
                        </ListItemIcon>

                        <ListItemText>{t("Client zone")}</ListItemText>
                    </MenuItem>
                </Link>

                <Divider/>
                {isMobile && (
                    <>
                        <Link href={route("b2b.favorites")}>
                            <MenuItem onClick={onClose}>
                                <ListItemIcon>
                                    <Favorite fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText>
                                    {t("Favorites")}
                                </ListItemText>
                            </MenuItem>
                        </Link>
                        <Divider/>
                    </>
                )}

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

                <Link href={route("b2b.import.items")}>
                    <MenuItem onClick={onClose}>
                        <ListItemIcon>
                            <ImportExport fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>
                            {t("Import products")}
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
            </Box>
        </Menu>
    );
}

B2bUserAvatarMenu.propTypes = {
    anchorEl: PropTypes.any,
    open: PropTypes.bool,
    onClose: PropTypes.func,

    props: PropTypes.any,
};
