import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import BasicInfoComponent from "@/Components/Pages/Partners/BasicInfoComponent";
import ExportComponent from "@/Components/Pages/Partners/ExportComponent";
import ProductsComponent from "@/Components/Pages/Partners/ProductsComponent";

export default function PartnerEdit(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Partner") + ": " + props.partner.name
            }
        >
            <Head title={t("Partner") + ": " + props.partner.name}/>
            <Box sx={{height: 1, width: 1, display: "flex", gap: 1, flexWrap: "wrap"}}>
                <Box sx={{flex: 1, minWidth: 500}}>
                    <Box sx={{height: 1, width: 1, display: "flex", flexDirection: "column", gap: 1}}>
                        <BasicInfoComponent partner={props.partner} subiektCategories={props.subiektCategories}
                                            subiektWarehouses={props.subiektWarehouses}/>
                    </Box>

                </Box>

            </Box>
        </UserLayout>
    );
}
