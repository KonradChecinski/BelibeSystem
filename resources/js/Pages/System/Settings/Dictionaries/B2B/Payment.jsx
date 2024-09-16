import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import PaymentTable from "@/Components/Table/Settings/PaymentTable";

export default function Payment(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Payments")
            }
        >
            <Head title={t("Payments")}/>
            <Card sx={{height: "100%", width: 1}}>
                <PaymentTable {...props} />
            </Card>
        </UserLayout>
    );
}
