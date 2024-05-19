import {Box, Card, Typography,} from "@mui/material";
import {ImportExport} from "@mui/icons-material";
import ExportTable from "@/Components/Table/Partners/ExportTable";


export default function ExportComponent({partner, exports}) {


    return (
        <Card sx={{flex: 3, p: 1, position: "relative"}}>
            <Box sx={{height: 1, display: "flex", flexDirection: "column", gap: 1, pt: 1}}>

                <Typography
                    sx={{display: "flex", gap: 1, alignItems: "center"}}>
                    <ImportExport fontSize={"large"}/>
                    Export informacji o produktach
                </Typography>
                <ExportTable exports={exports} readOnly={false}/>
            </Box>
        </Card>
    );
}
