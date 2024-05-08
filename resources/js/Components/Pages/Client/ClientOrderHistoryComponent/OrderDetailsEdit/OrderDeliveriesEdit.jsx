import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {LocalShipping} from "@mui/icons-material";

export default function OrderDeliveriesEdit({data}) {

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
                            {data?.delivery?.name}
                        </Typography>
                        <Typography variant="body1">
                            {data?.delivery?.description}
                        </Typography>
                        <Typography variant="body2">
                            Koszt: {toLocaleString(data?.order?.delivery_net / 100)} ({toLocaleString(data?.order?.delivery_gross / 100)} Brutto)
                        </Typography>
                        <Typography variant="body2">
                            Cza dostawy: {data?.delivery?.delivery_time_min} - {data?.delivery?.delivery_time_max}
                        </Typography>
                    </CardContent>
                </Card>

            </Box>


        </Paper>
    );
}
