import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {LocalShipping, Sell} from "@mui/icons-material";

export default function OrderCode({data}) {

    return (
        <Paper sx={{p: 2, flex: 1}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <Sell sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Kod promocyjny
                </Typography>
            </Box>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>

                <Card variant="outlined"
                      sx={{
                          width: 300,
                          height: 100,
                      }}>
                    <CardContent>
                        <Typography variant="h6">
                            {data?.order?.promo_code}
                        </Typography>
                    </CardContent>
                </Card>

            </Box>


        </Paper>
    );
}
