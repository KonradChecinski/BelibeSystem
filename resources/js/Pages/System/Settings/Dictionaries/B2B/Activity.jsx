import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import ActivityTable from "@/Components/Table/Settings/ActivityTable";

export default function Activity(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Activity types")
            }
        >
            <Head title={t("Activity types")}/>
            <Card sx={{height: "100%", width: 1}}>
                <ActivityTable {...props} />
            </Card>
        </UserLayout>
    );
}
