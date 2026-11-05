import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import B2CTiktokCategoryTable from "@/Components/Table/Settings/B2CTiktokCategoryTable";

export default function TiktokCategory(props) {
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Kategorie TikTok")
            }
        >
            <Head title={t("Kategorie TikTok")}/>
            <Card sx={{height: "100%", width: 1}}>
                <B2CTiktokCategoryTable {...props} />
            </Card>
        </UserLayout>
    );
}

