import { Box, Typography } from "@mui/material";

export default function GroupCell({ group }) {
    return (
        <Box>
            <Typography>{group.name}</Typography>
        </Box>
    );
}
