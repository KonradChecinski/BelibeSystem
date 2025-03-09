import {Box, Card, Typography,} from "@mui/material";
import {Inventory} from "@mui/icons-material";
import SettlementItemsTable from "@/Components/Table/Partners/SettlementItemsTable";


export default function SettlementItemsComponent({partner, settlementDocumentItems}) {


    return (
        <Card sx={{flex: 3, p: 1, position: "relative"}}>
            <Box sx={{height: 1, display: "flex", flexDirection: "column", gap: 1, pt: 1}}>

                <Typography
                    sx={{display: "flex", gap: 1, alignItems: "center"}}>
                    <Inventory fontSize={"large"}/>
                    Produkty dokumentu rozliczeniowego
                </Typography>
                <SettlementItemsTable settlementDocumentItems={settlementDocumentItems} readOnly={false}
                                      partner={partner}/>
            </Box>
        </Card>
    );
}
