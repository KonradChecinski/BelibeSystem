import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import TokenTable from "@/Components/Table/Settings/TokenTable";

export default function Roles(props) {
    const {t} = useLaravelReactI18n();

    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Tokens")
            }
        >
            <Head title={t("Tokens")}/>
            <Card sx={{height: "100%", width: 1}}>
                <TokenTable {...props} />
            </Card>
        </UserLayout>
    );
}
