import { Box, Typography } from "@mui/material";

export default function ColorsCell(props) {
    return (
        <Box>
            {props.row.colors.map((value, key) => {
                return (<Typography key={key}>{value.shortcut} - {value.name}</Typography>);
            })}
        </Box>
    );
}
