import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function Dashboard2(props) {
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Main Settings")
            }
        >
            <Head title={t("Main Settings")}/>

        </UserLayout>
    );
}
