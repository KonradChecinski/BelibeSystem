import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

export default function IconGrid({ iconColor, icon, title, xs, md, children }) {
    return (
        <Grid item xs={xs} md={md} sx={{ position: "relative", mt: 2 }}>
            <Box sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: iconColor,
                position: "absolute",
                top: -10,
                left: 40,
                zIndex: 20,
                "& .MuiSvgIcon-root": {
                    color: "white"
                }
            }}>
                {icon}
            </Box>
            <Box sx={{
                p: 2,
                borderRadius: 1,
                // bgcolor: iconColor,
                position: "absolute",
                top: 5,
                right: 20,
                zIndex: 20
            }}>
                <Typography variant="h6"> {title} </Typography>
            </Box>
            <Card variant="elevation" sx={{ pt: 2 }}>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </Grid>
    );
}
