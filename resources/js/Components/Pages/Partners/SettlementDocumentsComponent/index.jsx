import {Box, Card, Typography,} from "@mui/material";
import {CreditCard} from "@mui/icons-material";
import SettlementDocumentsTable from "@/Components/Table/Partners/SettlementDocumentsTable";


export default function SettlementDocumentsComponent({partner, settlementDocuments, changeSettlementDocumentItems}) {


    return (
        <Card sx={{flex: 3, p: 1, position: "relative"}}>
            <Box sx={{height: 1, display: "flex", flexDirection: "column", gap: 1, pt: 1}}>

                <Typography
                    sx={{display: "flex", gap: 1, alignItems: "center"}}>
                    <CreditCard fontSize={"large"}/>
                    Dokumenty rozliczeniowe
                </Typography>
                <SettlementDocumentsTable settlementDocuments={settlementDocuments} readOnly={false} partner={partner}
                                          changeSettlementDocumentItems={changeSettlementDocumentItems}/>
            </Box>
        </Card>
    );
}
