import {Box, Card, Typography,} from "@mui/material";
import {AccountBalanceWallet} from "@mui/icons-material";
import SettlementsTable from "@/Components/Table/Partners/SettlementsTable";


export default function SettlementsComponent({partner, settlements, changeSettlementDocuments}) {


    return (
        <Card sx={{flex: 3, p: 1, position: "relative"}}>
            <Box sx={{height: 1, display: "flex", flexDirection: "column", gap: 1, pt: 1}}>

                <Typography
                    sx={{display: "flex", gap: 1, alignItems: "center"}}>
                    <AccountBalanceWallet fontSize={"large"}/>
                    Rozliczenia partnera
                </Typography>
                <SettlementsTable settlements={settlements} readOnly={false} partner={partner}
                                  changeSettlementDocuments={changeSettlementDocuments}/>
            </Box>
        </Card>
    );
}
