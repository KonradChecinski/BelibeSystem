import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import ColorIconComponent from "@/Components/Pages/Settings/Dictionaries/ColorIcon/ColorIconComponent";

export default function Category(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Color Icons")
            }
        >
            <Head title={t("Color Icons")}/>
            <Box sx={{height: "100%", width: 1}}>
                <ColorIconComponent {...props} />
            </Box>
        </UserLayout>
    );
}
