import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import DeliveryTable from "@/Components/Table/Settings/DeliveryTable";

export default function Delivery(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Delivery")
            }
        >
            <Head title={t("Delivery")}/>
            <Card sx={{height: "100%", width: 1}}>
                <DeliveryTable {...props} />
            </Card>
        </UserLayout>
    );
}
