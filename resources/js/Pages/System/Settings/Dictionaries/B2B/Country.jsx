import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import CountryTable from "@/Components/Table/Settings/CountryTable";

export default function Country(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Countries")
            }
        >
            <Head title={t("Countries")}/>
            <Card sx={{height: "100%", width: 1}}>
                <CountryTable {...props} />
            </Card>
        </UserLayout>
    );
}
