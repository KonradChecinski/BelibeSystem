import {Box} from "@mui/material";
import Theme from "@/Theme/Theme";


export default function ClearLayout({children}) {
    return (
        <Theme>
            <Box>
                {children}
            </Box>
        </Theme>
    );
}
