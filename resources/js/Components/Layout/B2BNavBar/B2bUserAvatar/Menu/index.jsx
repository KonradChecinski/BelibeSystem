import {Avatar, Divider, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {Link} from "@inertiajs/react";
import {Logout, Settings} from "@mui/icons-material";
import * as PropTypes from "prop-types";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function B2bUserAvatarMenu(props) {
    const {t} = useLaravelReactI18n();

    return (
        <Menu
            anchorEl={props.anchorEl}
            id="account-menu"
            open={props.open}
            onClose={props.onClose}
            onClick={props.onClose}
            hideBackdrop={true}
            disableScrollLock
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1
                    },
                    "&:before": {
                        content: "\"\"",
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0
                    }
                }
            }}
            transformOrigin={{
                horizontal: "right",
                vertical: "top"
            }}
            anchorOrigin={{
                horizontal: "right",
                vertical: "bottom"
            }}
        >
            {/*<Link href={route("profile.edit")}>*/}
            {/*    <MenuItem onClick={props.onClose}>*/}
            {/*        <Avatar/> Profile*/}
            {/*    </MenuItem>*/}
            {/*</Link>*/}

            <Divider/>
            {/*<MenuItem onClick={props.onClose}>*/}
            {/*    <Link href={route("system.settings.main")} as="button">*/}
            {/*        <ListItemIcon>*/}
            {/*            <Settings fontSize="small"/>*/}
            {/*        </ListItemIcon>*/}
            {/*        Settings*/}
            {/*    </Link>*/}
            {/*</MenuItem>*/}
            <MenuItem onClick={props.onClose}>
                <Link href={route("logout")} method="post" as="button">
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    {t("Logout")}
                </Link>
            </MenuItem>
        </Menu>
    );
}

B2bUserAvatarMenu.propTypes = {
    anchorEl: PropTypes.any,
    open: PropTypes.bool,
    onClose: PropTypes.func
};
