import {Box, Card, CardContent, Paper, Typography} from "@mui/material";
import {Business} from "@mui/icons-material";

export default function OrderLocations({data}) {
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
                          height: 120,
                      }}>
                    <CardContent>
                        <Typography variant="h6">
                            {data?.location.name}
                        </Typography>
                        <Box>
                            <Typography
                                variant={'body2'}>{data?.location.street} {data?.location.building_number} {data?.location.apartment_number ? "/" + data?.location.apartment_number : ""}</Typography>
                            <Typography
                                variant={'body2'}>{data?.location.postal_code}, {data?.location.city} - {data?.location.country?.name}</Typography>
                            <Typography variant={'body2'}>
                                tel: {data?.location.phone}
                            </Typography>
                            <Typography variant={'body2'}>
                                email: {data?.location.email}
                            </Typography>
                        </Box>


                    </CardContent>

                </Card>


            </Box>


        </Paper>
    );
}
