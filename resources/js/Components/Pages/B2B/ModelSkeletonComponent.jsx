import {Box, Button, Card, CardActions, CardContent, Checkbox, Divider, Skeleton, Typography} from "@mui/material";
import {Favorite, FavoriteBorder} from "@mui/icons-material";

export default function ModelSkeletonComponent() {


    return (

        <Card variant="outlined" sx={{
            position: "relative",
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: 1,
            // height: 700,
            height: 1,
            boxSizing: "border-box",
        }}>
            <Box
                sx={{
                    height: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}>
                <Box sx={{
                    width: 1, height: 1,
                    display: "flex",
                    flexDirection: "column"
                }}>


                    <Box sx={{
                        width: 1,
                        height: "auto",
                        aspectRatio: 2 / 3,
                    }}>
                        <Skeleton variant="rectangular" sx={{width: 1, height: 1}}/>

                    </Box>
                    <Box sx={{width: 1, height: "auto",}}>
                        <Divider sx={{mt: 0}}/>
                    </Box>

                    <CardContent sx={{
                        display: "flex",
                        flexDirection: "column",
                        // height: 1,
                        flex: 1,
                        width: 1,
                        pt: 1,
                        pb: 0,
                        px: 1,
                        boxSizing: "border-box",
                        "&:last-child": {
                            pb: 1
                        }
                    }}>


                        <Box>
                            <Typography variant="body1" sx={{fontWeight: 600}}>
                                <Skeleton variant="text"/>
                            </Typography>
                            <Typography variant="body2">
                                <Skeleton variant="text"/>
                            </Typography>
                        </Box>


                        <Box
                            sx={{
                                width: 1,
                                // height: 1,
                                display: "flex",
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>


                            <Box
                                sx={{
                                    mt: 1
                                }}>
                                <Typography
                                    variant="body1"
                                    textAlign={"center"}
                                    sx={{
                                        textAlign: "center",
                                        my: 1
                                    }}>
                                    Kolory
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mb: 1,

                                    minHeight: "1.4rem",
                                    width: 1,
                                }}>

                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>
                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>
                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>
                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>

                                </Box>
                            </Box>

                            <Box sx={{
                                mt: 0
                            }}>
                                <Typography
                                    variant="body1"
                                    textAlign={"center"}
                                    sx={{
                                        textAlign: "center",
                                        my: 1
                                    }}>
                                    Rozmiary
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mb: 1,

                                    minHeight: "1.4rem",
                                    width: 1,
                                }}>
                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>
                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>
                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>
                                    <Skeleton variant="circular" width={"1.4rem"} height={"1.4rem"}/>

                                </Box>
                            </Box>
                            <Box sx={{mt: 1}}>
                                <Typography variant="h6" sx={{textAlign: "center"}}>
                                    <Skeleton variant="text" width={60}/>
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Box>
                <CardActions sx={{width: 1}}>
                    <Box
                        sx={{
                            width: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Button variant="contained" sx={{mt: 1}} component={"div"}>
                            Zobacz
                        </Button>
                    </Box>


                </CardActions>


            </Box>
            <Checkbox
                icon={<FavoriteBorder color={"error"}/>}
                checkedIcon={<Favorite color={"error"}/>}
                // checked={Boolean(isFavorited)}
                // onChange={handleFavorite}
                sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    zIndex: 60
                }}
            />
        </Card>
    )
}
