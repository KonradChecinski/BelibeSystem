import {Head} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useLaravelReactI18n} from "laravel-react-i18n";
import ModelList from "@/Components/Pages/B2B/ModelList";
import {Box, Paper, Typography} from "@mui/material";
import {LocalOffer} from "@mui/icons-material";

export default function B2bPromotions(props) {
    const {t} = useLaravelReactI18n();

    return (
        <ClientLayout
            props={props}
            header={t("Promotions")}
        >
            <Head title={t("Promotions")}/>
            {props.models?.data?.length > 0 ? (
                <ModelList {...props} />
            ) : (
                <Paper elevation={2} sx={{p: 6, m: 2, textAlign: "center"}}>
                    <LocalOffer color="action" sx={{fontSize: 56, mb: 1, opacity: 0.6}}/>
                    <Typography variant="h5" gutterBottom>
                        Brak aktualnych promocji
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Obecnie nie ma aktywnych promocji na produkty. Zapraszamy wkrótce!
                    </Typography>
                </Paper>
            )}
        </ClientLayout>
    );
}
