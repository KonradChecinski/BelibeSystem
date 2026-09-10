import {useState} from "react";
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";
import {Box} from "@mui/material";
import {VerticalSpace} from "@/Pages/System/Pages/blocks/VerticalSpace";
import {Columns, Container, Divider, Heading, Paragraph, Typography} from "@/Pages/System/Pages/blocks/MuiBlock";
import {ColumnResponsive} from "@/Pages/System/Pages/blocks/ColumnResponsive";
import {Render} from "@puckeditor/core";

export default function B2BFooter({props, footer}) {
    const initialFooterData = {
        content: footer?.content,
        zones: footer?.zones,
    };

    const [configFooter, setConfigFooter] = useState({
        components: {
            divider: Divider,
            verticalSpace: VerticalSpace,
            heading: Heading,
            paragraph: Paragraph,
            typography: Typography,
            column: Columns,
            columnResponsive: ColumnResponsive,
            container: Container,
            link: PuckLink
        },
    });

    return (
        <Box sx={{px: 2, py: 5}}>
            <Render config={configFooter} data={initialFooterData}/>

        </Box>
    );
}
