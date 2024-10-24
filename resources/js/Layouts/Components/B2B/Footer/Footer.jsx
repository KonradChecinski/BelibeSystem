import {useState} from "react";
import {Render} from "@measured/puck";
import {PColumns, PDivider, PHeading, PParagraph, PTypography} from "puck-mui";
import {PuckLink} from "@/Pages/System/Pages/blocks/Link";

export default function B2BFooter({props, footer}) {
    const initialFooterData = {
        content: footer?.content,
        zones: footer?.zones,
    };

    const [configFooter, setConfigFooter] = useState({
        components: {
            divider: PDivider,
            heading: PHeading,
            paragraph: PParagraph,
            typography: PTypography,
            column: PColumns,
            link: PuckLink
        },
    });

    return (
        <Render config={configFooter} data={initialFooterData}/>
    );
}
