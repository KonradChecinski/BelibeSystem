import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";

export default function Dashboard2(props) {
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                // <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                //     Dashboard
                // </h2>
                "Main Settings"
            }
        >
            <Head title="Main Settings" />

        </UserLayout>
    );
}
