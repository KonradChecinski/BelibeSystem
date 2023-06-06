import { Box, Typography } from "@mui/material";

export default function ColorsCell({ colors }) {
    return (
        <Box>
            {colors.map((value, key) => {
                return (<Typography key={key}>{value.shortcut} - {value.name}</Typography>);
            })}
        </Box>
    );
}
