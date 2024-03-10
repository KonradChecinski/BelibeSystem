import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import TreeViewComponent from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/TreeViewComponent";

export default function Category(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Categories")
            }
        >
            <Head title={t("Categories")}/>
            <Box sx={{height: "100%", width: 1}}>
                <TreeViewComponent {...props} />
            </Box>
            {/*<Card >*/}

            {/*</Card>*/}
        </UserLayout>
    );
}
