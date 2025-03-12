import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import SettlementsComponent from "@/Components/Pages/Partners/SettlementsComponent";
import SettlementItemsComponent from "@/Components/Pages/Partners/SettlementItemsComponent";
import {useEffect, useState} from "react";
import SettlementDocumentsComponent from "@/Components/Pages/Partners/SettlementDocumentsComponent";

export default function Partner(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    const [settlementDocuments, setSettlementDocuments] = useState(null);
    const [settlementDocumentItems, setSettlementDocumentItems] = useState(null);

    useEffect(() => {
        if (settlementDocuments) {
            setSettlementDocuments(props.settlements.find(settlement => settlement.id === settlementDocuments.id));
        }

        if (settlementDocumentItems) {
            setSettlementDocumentItems(props.settlements.find(settlement => settlement.id === settlementDocuments.id).documents.find(document => document.id === settlementDocumentItems.id));
        }
    }, [props]);

    const changeSettlementDocuments = (settlementDocuments) => {
        setSettlementDocuments(settlementDocuments);
    }

    const changeSettlementDocumentItems = (settlementDocumentItems) => {
        setSettlementDocumentItems(settlementDocumentItems);
    }

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Partner") + ": " + props.partner.name
            }
        >
            <Head title={t("Partner") + ": " + props.partner.name}/>
            <Box sx={{height: 1, width: 1, display: "flex", gap: 1, flexWrap: "wrap", maxHeight: 1}}>
                <Box sx={{flex: 1, minWidth: 500}}>
                    <Box sx={{height: 1, width: 1, display: "flex", flexDirection: "column", gap: 1}}>
                        <SettlementsComponent settlements={props.settlements} partner={props.partner}
                                              changeSettlementDocuments={changeSettlementDocuments}/>
                    </Box>
                </Box>
                <Box sx={{flex: 1, minWidth: 500, maxWidth: 1, height: 1}}>
                    <Box sx={{
                        flex: 1,
                        width: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        height: 1,
                        maxHeight: 1
                    }}>
                        <Box sx={{flex: 1, width: 1, display: "flex", flexDirection: "column", gap: 1}}>
                            <SettlementDocumentsComponent
                                settlementDocuments={settlementDocuments}
                                partner={props.partner}
                                changeSettlementDocumentItems={changeSettlementDocumentItems}
                            />
                        </Box>
                        <Box sx={{flex: 1, width: 1, display: "flex", flexDirection: "column", gap: 1}}>
                            <SettlementItemsComponent
                                settlementDocuments={settlementDocuments}
                                settlementDocumentItems={settlementDocumentItems}
                                partner={props.partner}
                            />
                        </Box>
                    </Box>

                </Box>
            </Box>
        </UserLayout>
    );
}
