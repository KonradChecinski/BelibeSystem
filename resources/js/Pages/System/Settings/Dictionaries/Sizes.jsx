import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import SizesTable from "@/Components/Table/Settings/SizesTable";

export default function Sizes(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Sizes")
            }
        >
            <Head title={t("Sizes")}/>
            <Card sx={{height: "100%", width: 1}}>
                <SizesTable {...props} />
            </Card>
        </UserLayout>
    );
}
