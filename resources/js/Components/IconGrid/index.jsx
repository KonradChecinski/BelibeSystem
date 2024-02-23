import {Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Grid, Typography} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";

export default function IconGrid({iconColor, icon, title, xs, md, lg, children}) {
    return (
        <Grid item xs={xs} md={md} lg={lg} sx={{position: "relative", mt: 2}}>
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                        position: "relative",
                        height: "40px",
                        minHeight: "20px !important"
                    }}
                >
                    <Box sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: iconColor,
                        position: "absolute",
                        top: -20,
                        left: 20,
                        zIndex: 20,
                        "& .MuiSvgIcon-root": {
                            color: "white"
                        }
                    }}>
                        {icon}
                    </Box>
                    <Box sx={{
                        // p: 2,
                        // borderRadius: 1,
                        // // bgcolor: iconColor,
                        // position: "absolute",
                        // top: -5,
                        // right: 40,
                        // zIndex: 20
                        width: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}>
                        <Typography variant="h6" textAlign={"center"} width={"fit-content"}
                                    mr={1}> {title} </Typography>
                    </Box>

                </AccordionSummary>
                <AccordionDetails>
                    {children}
                </AccordionDetails>
            </Accordion>


        </Grid>
    );
}
