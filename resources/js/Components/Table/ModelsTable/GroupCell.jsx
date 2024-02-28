import {Box, Typography} from "@mui/material";

export default function GroupCell({group}) {
    return (
        <Box>
            <Typography sx={{fontSize: "11px"}}>{group?.name}</Typography>
        </Box>
    );
}
