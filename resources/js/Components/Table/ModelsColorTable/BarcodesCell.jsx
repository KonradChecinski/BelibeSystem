import { Box, Typography } from "@mui/material";

export default function BarcodesCell({ barcodes }) {
    return (
        <Box sx={{ height: 1, maxHeight: 1, width: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 0.5, overflowY: "auto", overflowX: "hidden" }}>
            {barcodes.map((value, key) => {
                return (
                    <Typography key={key} color={barcodes.length !== 1 ? value.main ? "primary.main": "primary.third" : "primary.main"}>
                        {value.barcode}
                    </Typography>
                );
            })}
        </Box>
    );
}
