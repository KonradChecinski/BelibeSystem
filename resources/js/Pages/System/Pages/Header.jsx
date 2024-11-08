import {Head, Link, router, useForm} from "@inertiajs/react";
import {Box, Button, Card, Tooltip} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import UserLayout from "@/Layouts/UserLayout";

export default function Header(props) {
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={t("Nowa strona")}
        >
            <Head title={t("Nowa strona")}/>
            <Card sx={{height: "100%", width: 1}}>

            </Card>

        </UserLayout>
    );
}
