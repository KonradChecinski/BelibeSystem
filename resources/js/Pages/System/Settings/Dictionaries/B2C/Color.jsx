import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import B2CColorTable from "@/Components/Table/Settings/B2CColorTable";

export default function Color(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("B2C Color")
            }
        >
            <Head title={t("B2C Color")}/>
            <Card sx={{height: "100%", width: 1}}>
                <B2CColorTable {...props} />
            </Card>
        </UserLayout>
    );
}
