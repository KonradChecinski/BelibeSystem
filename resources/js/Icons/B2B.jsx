import {Icon} from "@mui/material";
import {Work} from "@mui/icons-material";

export function B2B(props) {
    return (
        <Work color={props.color || "info" || "inherit"} {...props}/>
    );
}

