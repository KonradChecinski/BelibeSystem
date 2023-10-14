import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import GS1BrandsTable from "@/Components/Table/GS1BrandsTable";

export default function Brand(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Marki GS1")
            }
        >
            <Head title={t("Marki GS1")}/>
            <Card sx={{height: "100%", width: 1}}>
                <GS1BrandsTable {...props} />
            </Card>
        </UserLayout>
    );
}
