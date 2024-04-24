import React from "react";
import styles from "./styles.module.css";
import {getClassNameFactory} from "../../functions";

const getClassName = getClassNameFactory("Hero", styles);

export type HeroProps = {};

export const Hero = {
    fields: {},
    defaultProps: {},
    render: () => {
        return <div className={getClassName()}></div>;
    },
};
