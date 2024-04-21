import stringAvatar from "@/Functions/stringAvatar";
import React from "react";
import {Avatar} from "@mui/material";
import stringToColor from "@/Functions/stringToColor";

export default function B2bUserAvatar({user}) {
    let src = "/storage/favicons/B.png";
    // let src = "";

    return (
        <Avatar
            src={src}
            sx={{
                boxShadow: 5,
                bgcolor: src ? "" : stringToColor(user.name)
            }}
            title={user.name}
        >
            {user.name.split(" ")[0] ? user.name.split(" ")[0][0] : ""}
            {user.name.split(" ")[1] ? user.name.split(" ")[1][0] : ""}
        </Avatar>
    );
}
