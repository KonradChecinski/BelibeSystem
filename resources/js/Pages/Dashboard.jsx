import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {Button} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";

export default function Dashboard(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Dashboard")
            }
        >
            <Head title={t("Dashboard")}/>

            {/*<div className="py-12">*/}
            {/*    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">*/}
            {/*        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">*/}
            {/*            <div className="p-6 text-gray-900 dark:text-gray-100">*/}
            {/*                You're logged in!*/}
            {/*            </div>*/}
            {/*            <Button*/}
            {/*                onClick={() =>*/}
            {/*                    enqueueSnackbar("Błąd", {*/}
            {/*                        variant: "error"*/}
            {/*                    })*/}
            {/*                }*/}
            {/*            >*/}
            {/*                Zrób cos*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </UserLayout>
    );
}
