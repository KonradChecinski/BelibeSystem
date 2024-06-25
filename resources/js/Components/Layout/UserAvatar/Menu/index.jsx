import {Avatar, Divider, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {Link, router} from "@inertiajs/react";
import {Logout, Settings} from "@mui/icons-material";
import * as PropTypes from "prop-types";
import {useLaravelReactI18n} from "laravel-react-i18n";
import UserAvatar from "@/Components/Layout/UserAvatar";

export default function UserAvatarMenu(props) {
    const {t} = useLaravelReactI18n();


    const handleLogoutClick = () => {
        props.onClose();
        router.post(route("logout"));
    }
    return (
        <Menu
            anchorEl={props.anchorEl}
            id="account-menu"
            open={props.open}
            onClose={props.onClose}
            onClick={props.onClose}
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
            <Link href={route("profile.edit")}>
                <MenuItem onClick={props.onClose}>
                    <ListItemIcon sx={{mr: 2}}>

                        <UserAvatar user={props.user}/>
                    </ListItemIcon>

                    <ListItemText>{t("Profile")}</ListItemText>
                </MenuItem>
            </Link>

            <Divider/>
            <Link href={route("system.settings.main")}>
                <MenuItem onClick={props.onClose}>

                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        {t("Settings")}
                    </ListItemText>

                </MenuItem> </Link>
            <MenuItem onClick={handleLogoutClick}>

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

UserAvatarMenu.propTypes = {
    anchorEl: PropTypes.any,
    open: PropTypes.bool,
    onClose: PropTypes.func
};
