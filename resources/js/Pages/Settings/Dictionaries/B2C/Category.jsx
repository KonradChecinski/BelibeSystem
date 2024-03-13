import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import B2CCategoryTable from "@/Components/Table/Settings/B2CCategoryTable";

export default function Category(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("B2C Category")
            }
        >
            <Head title={t("B2C Category")}/>
            <Card sx={{height: "100%", width: 1}}>
                <B2CCategoryTable {...props} />
            </Card>
        </UserLayout>
    );
}
