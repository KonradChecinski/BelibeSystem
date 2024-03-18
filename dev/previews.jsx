import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import Dashboard from "@/Pages/System/Dashboard";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Dashboard">
                <Dashboard/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
