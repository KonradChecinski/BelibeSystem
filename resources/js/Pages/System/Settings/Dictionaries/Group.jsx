import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import GroupsTable from "@/Components/Table/Settings/GroupsTable";

export default function Sizes(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Groups")
            }
        >
            <Head title={t("Groups")}/>
            <Card sx={{height: "100%", width: 1}}>
                <GroupsTable {...props} />
            </Card>
        </UserLayout>
    );
}
