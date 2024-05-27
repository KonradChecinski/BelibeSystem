import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {LocalShipping} from "@mui/icons-material";

export default function OrderDeliveries({data}) {

    return (
        <Paper sx={{p: 2, flex: 1}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <LocalShipping sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Dostawa
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
                            {data?.order?.delivery_name}
                        </Typography>
                        <Typography variant="body2">
                            Koszt: {toLocaleString(data?.order?.delivery_gross)} Brutto
                        </Typography>
                    </CardContent>
                </Card>

            </Box>


        </Paper>
    );
}
