import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import BrandsTable from "@/Components/Table/Settings/BrandsTable";

export default function Brand(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Brands")
            }
        >
            <Head title={t("Brands")}/>
            <Card sx={{height: "100%", width: 1}}>
                <BrandsTable {...props} />
            </Card>
        </UserLayout>
    );
}
