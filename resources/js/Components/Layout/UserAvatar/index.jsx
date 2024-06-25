import stringAvatar from "@/Functions/stringAvatar";
import React from "react";
import {Avatar} from "@mui/material";
import stringToColor from "@/Functions/stringToColor";

export default function UserAvatar({user}) {
    // let src = "/storage/favicons/B.png";

    return (
        <Avatar
            src={user.icon}
            sx={{
                boxShadow: 5,
                bgcolor: user.icon ? "" : stringToColor(user.name)
            }}
            title={user.name}
        >
            {user.name.split(" ")[0] ? user.name.split(" ")[0][0] : ""}
            {user.name.split(" ")[1] ? user.name.split(" ")[1][0] : ""}
        </Avatar>
    );
}
