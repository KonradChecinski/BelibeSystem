import {useState} from "react";
import {Render} from "@measured/puck";
import {PColumns, PContainer, PDivider, PHeading, PParagraph, PTypography} from "puck-mui";
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";
import {Box} from "@mui/material";
import {VerticalSpace} from "@/Pages/System/Pages/blocks/VerticalSpace";
import {ColumnResponsive} from "@/Pages/System/Pages/blocks/ColumnResponsive";

export default function B2BFooter({props, footer}) {
    const initialFooterData = {
        content: footer?.content,
        zones: footer?.zones,
    };

    const [configFooter, setConfigFooter] = useState({
        components: {
            divider: PDivider,
            verticalSpace: VerticalSpace,
            heading: PHeading,
            paragraph: PParagraph,
            typography: PTypography,
            column: PColumns,
            columnResponsive: ColumnResponsive,
            container: PContainer,
            link: PuckLink
        },
    });

    return (
        <Box sx={{px: 2, py: 5}}>
            <Render config={configFooter} data={initialFooterData}/>

        </Box>
    );
}
