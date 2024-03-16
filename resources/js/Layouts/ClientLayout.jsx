import {useState} from "react";
import Theme from "@/Theme/Theme";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ClientLayout({auth, header, children}) {
    const theme = useTheme();
    const mdBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("sm"));
    const [showMenu, setShowMenu] = useState(
        useMediaQuery(theme.breakpoints.up("md"))
    );
    return (
        <Theme>

        </Theme>
    );
}
