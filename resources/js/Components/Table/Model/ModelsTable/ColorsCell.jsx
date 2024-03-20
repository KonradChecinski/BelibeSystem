import {Box, Typography} from "@mui/material";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";

export default function ColorsCell({colors}) {
    return (
        <Box sx={{
            height: 1,
            maxHeight: 1,
            width: 1,
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            alignItems: "flex-start",
            gap: 0.5,
            overflowY: "auto",
            overflowX: "hidden",
            py: 0.5,
            "&::before, &::after": {
                content: '""',
                margin: 'auto',
            }
        }}>
            {colors.sort(sortByColorShortcut).map((value, key) =>
                <Typography key={key} sx={{fontSize: "11px", height: 20, width: 1}}>
                    {value.shortcut} - {value.name}
                </Typography>
            )}
        </Box>
    );
}
