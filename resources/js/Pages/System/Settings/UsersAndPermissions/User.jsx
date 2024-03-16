import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import UsersTable from "@/Components/Table/Settings/UsersTable";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function Dashboard2(props) {
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Users")
            }
        >
            <Head title={t("Users")}/>
            <Card sx={{height: "100%", width: 1}}>
                <UsersTable {...props} />
            </Card>
        </UserLayout>
    );
}
