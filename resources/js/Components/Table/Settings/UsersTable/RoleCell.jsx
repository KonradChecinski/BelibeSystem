import {Box, Typography} from "@mui/material";

export default function RoleCell({roles}) {
    return (
        <Box sx={{
            height: 1,
            maxHeight: 1,
            width: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 0.5,
            overflowY: "auto",
            overflowX: "hidden"
        }}>
            {roles.map((value, key) => {
                return (
                    <Typography key={key}>
                        {value.name}
                    </Typography>
                );
            })}
        </Box>
    );
}
