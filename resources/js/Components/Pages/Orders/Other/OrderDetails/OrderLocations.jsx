import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import {Business} from "@mui/icons-material";
import {useState} from "react";

export default function OrderLocations({data}) {
    return (
        <Paper sx={{p: 2, flex: 1, my: 2}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <Business sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Adres
                </Typography>
            </Box>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                <Card variant="outlined"
                      sx={{
                          width: 1,
                          // height: 100,
                      }}>
                    <CardContent>
                        <Typography variant="h6">
                            {data?.order?.firstname} {data?.order?.lastname}
                        </Typography>
                        <Typography variant={"h6"}>
                            {data?.order?.company} {data?.order?.tax_id}
                        </Typography>

                        <Box sx={{mt: 2}}>
                            <Typography
                                sx={{fontSize: "11px"}}>
                                {data?.order?.street1}
                            </Typography>
                            <Typography
                                sx={{fontSize: "11px"}}>
                                {data?.order?.city}, {data?.order?.postcode} - {data?.order?.country}
                            </Typography>
                        </Box>
                        <Box sx={{mt: 2}}>
                            <Typography
                                sx={{fontSize: "11px"}}>
                                {data?.order?.email}
                            </Typography>
                            <Typography
                                sx={{fontSize: "11px"}}>
                                {data?.order?.phone}
                            </Typography>
                        </Box>

                    </CardContent>

                </Card>


            </Box>


        </Paper>
    );
}
