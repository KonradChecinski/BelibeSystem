import {ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography} from "@mui/material";
import {Link} from "@inertiajs/react";
import {History, Payment, ReceiptLong} from "@mui/icons-material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {useSnackbar} from "notistack";

export default function Shortcut(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();


    return (
        <Paper sx={{height: 1, p: 2}}>

            <Typography variant="h5" gutterBottom sx={{pl: 1}}>
                Skróty
            </Typography>
            <MenuList sx={{height: 1, display: "flex", flexDirection: "column"}}>
                <Link href={route("b2b.orders")}>
                    <MenuItem sx={{height: 1, m: 1}}>
                        <ListItemIcon>
                            <History fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText>
                            {t("Orders")}
                        </ListItemText>
                    </MenuItem>
                </Link>
                <Link href={route("b2b.invoices")}>
                    <MenuItem sx={{height: 1, m: 1}}>
                        <ListItemIcon>
                            <ReceiptLong fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText>
                            {t("Invoices")}
                        </ListItemText>
                    </MenuItem>
                </Link>
                <Link href={route("b2b.settlements")}>
                    <MenuItem sx={{height: 1, m: 1}}>
                        <ListItemIcon>
                            <Payment fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText>
                            {t("Settlements")}
                        </ListItemText>
                    </MenuItem>
                </Link>
            </MenuList>
        </Paper>
    )
}
