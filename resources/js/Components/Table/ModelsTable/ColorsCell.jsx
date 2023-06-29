import { Box, Typography } from "@mui/material";

export default function ColorsCell({ colors }) {
    return (
        <Box sx={{ height: "100%" }}>
            {colors.map((value, key) => {
                return (
                    <Typography key={key}>
                        {value.shortcut} - {value.name}
                    </Typography>
                );
            })}
        </Box>
    );
}
