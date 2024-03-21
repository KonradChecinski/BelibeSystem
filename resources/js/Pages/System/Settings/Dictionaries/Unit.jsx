import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import UnitsTable from "@/Components/Table/Settings/UnitsTable";

export default function Unit(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Units")
            }
        >
            <Head title={t("Units")}/>
            <Card sx={{height: "100%", width: 1}}>
                <UnitsTable {...props} />
            </Card>
        </UserLayout>
    );
}
