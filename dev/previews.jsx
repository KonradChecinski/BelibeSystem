import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import { PaletteTree } from "./palette";
import Dashboard2 from "@/Pages/Settings/UsersAndPermissions/User";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree />}>
            <ComponentPreview path="/Dashboard2">
                <Dashboard2/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
