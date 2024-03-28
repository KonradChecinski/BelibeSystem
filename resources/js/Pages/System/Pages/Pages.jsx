import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Puck} from "@measured/puck";
import "@measured/puck/puck.css";
import {ButtonGroup} from "./blocks/ButtonGroup";
import {Hero} from "./blocks/Hero";
import {Heading,} from "./blocks/Heading";
import {FeatureList} from "./blocks/FeatureList";
import {Logos} from "./blocks/Logos";
import {Text} from "./blocks/Text";
import {VerticalSpace} from "./blocks/VerticalSpace";

export default function Pages(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    const config = {
        components: {
            ButtonGroup,
            Hero,
            Heading,
            FeatureList,
            Logos,
            Text,
            VerticalSpace,
        },
    };

// Describe the initial data
    const initialData = {
        content: [],
        root: {},
    };

// Save the data to your database
    const save = (data) => {
        console.log(data)
    };

    return (
        // <UserLayout
        //     auth={props.auth}
        //     errors={props.errors}
        //     header={
        //         t("Pages")
        //     }
        // >
        //     <Head title={t("Pages")}/>
        //     <Card sx={{height: "100%", width: 1}}>
        //
        //     </Card>
        // </UserLayout>
        <Puck config={config} data={initialData} onPublish={save}/>
    );
}
