import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import GS1GPCTable from "@/Components/Table/Settings/GS1GPCTable";

export default function GPC(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Klasyfikacja GPC")
            }
        >
            <Head title={t("GS1 Brands")}/>
            <Card sx={{height: "100%", width: 1}}>
                <GS1GPCTable {...props} />
            </Card>
        </UserLayout>
    );
}
