import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import RolesTable from "@/Components/Table/Settings/RolesTable";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function Roles(props) {
    const {t} = useLaravelReactI18n();

    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Roles")
            }
        >
            <Head title={t("Roles")}/>
            <Card sx={{height: "100%", width: 1}}>
                <RolesTable {...props} />
            </Card>
        </UserLayout>
    );
}
