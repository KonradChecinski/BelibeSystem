import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import IndustryTable from "@/Components/Table/Settings/IndustryTable";

export default function Industry(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Industries")
            }
        >
            <Head title={t("Industries")}/>
            <Card sx={{height: "100%", width: 1}}>
                <IndustryTable {...props} />
            </Card>
        </UserLayout>
    );
}
