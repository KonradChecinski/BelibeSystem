import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import {Business} from "@mui/icons-material";
import {useState} from "react";

export default function OrderLocationsEdit({data}) {
    return (
        <Paper sx={{p: 2, flex: 1}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <Business sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Adres dostawy
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
                            {data?.location.note}
                        </Typography>
                        <Box>
                            <Typography
                                sx={{fontSize: "11px"}}>{data?.location.street} {data?.location.building_number}{data?.location.apartment_number ? "/" + data?.location.apartment_number : ""}</Typography>
                            <Typography
                                sx={{fontSize: "11px"}}>{data?.location.city}, {data?.location.postal_code} - {data?.location.country?.name}</Typography>
                        </Box>


                    </CardContent>

                </Card>


            </Box>


        </Paper>
    );
}
