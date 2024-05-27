import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import {Payment} from "@mui/icons-material";

export default function OrderComment({data}) {


    return (
        <>
            {data?.order.comment === null ? null : (
                <Paper sx={{p: 2, flex: 1}}>
                    <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                        <Payment sx={{
                            width: 40,
                            height: 40,
                        }}/>
                        <Typography variant="h5">
                            Uwagi do zamówienia
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                        <Card variant="outlined" sx={{width: 1}}>
                            <CardContent>
                                <Typography variant="body2" gutterBottom>
                                    {data?.order.comment}
                                </Typography>
                            </CardContent>
                        </Card>


                    </Box>


                </Paper>
            )}
        </>
    );
}
