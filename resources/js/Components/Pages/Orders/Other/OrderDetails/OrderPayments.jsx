import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import {Payment} from "@mui/icons-material";

export default function OrderPayments({data}) {


    return (
        <Paper sx={{p: 2, flex: 1}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <Payment sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Płatność
                </Typography>
            </Box>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                <Card variant="outlined"
                      sx={{
                          width: 300,
                          height: 100,
                      }}>
                    <CardContent sx={{height: 1, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <Typography variant="h6">
                            {data?.order?.payment_name}
                        </Typography>

                    </CardContent>
                </Card>


            </Box>


        </Paper>
    );
}
