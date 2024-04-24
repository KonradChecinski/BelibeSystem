import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import {Business} from "@mui/icons-material";
import {useState} from "react";

export default function CartLocations({props, setData}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [selectedLocation, setSelectedLocation] = useState(0);

    const handleLocationChange = (location) => {
        setSelectedLocation(location.id);
        setData("location", location)
    }

    return (
        <Paper sx={{my: 2, p: 2}}>
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
                {props.locations.map((location) => {


                    return (
                        <Card variant="outlined"
                              key={location.id}
                              sx={{
                                  width: 300,
                                  height: 100,
                                  bgcolor: selectedLocation === location.id ? "successBg.main" : ""
                              }}>
                            <CardActionArea sx={{width: 1, height: 1}}
                                            onClick={() => handleLocationChange(location)}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {location.note}
                                    </Typography>
                                    {/*<Typography variant="body2" gutterBottom>*/}
                                    {/*</Typography>*/}
                                    <Box>
                                        <Typography
                                            sx={{fontSize: "11px"}}>{location.street} {location.building_number}{location.apartment_number ? "/" + location.apartment_number : ""}</Typography>
                                        <Typography
                                            sx={{fontSize: "11px"}}>{location.city}, {location.postal_code} - {location.country?.name}</Typography>
                                    </Box>


                                </CardContent>
                            </CardActionArea>
                        </Card>
                    );

                })}

            </Box>


        </Paper>
    );
}
