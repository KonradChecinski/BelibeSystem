import stringAvatar from "@/Functions/stringAvatar";
import React from "react";
import { Avatar } from "@mui/material";
import stringToColor from "@/Functions/stringToColor";
export default function UserAvatar({ auth }) {
    let src = "storage/favicons/B.png";
    // let src = "";
    return (
        <Avatar
            src={src}
            sx={{
                boxShadow: 5,
                bgcolor: src ? "" : stringToColor(auth.user.name),
            }}
        >
            {auth.user.name.split(" ")[0][0]}
            {auth.user.name.split(" ")[1][0]}
        </Avatar>
    );
}
