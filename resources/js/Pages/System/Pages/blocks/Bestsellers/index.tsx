import React from "react";
import B2BBestsellers from "@/Components/Pages/B2B/ExtraMainPage/Bestsellers";


export type BestsellersProps = {
    quantity: number;
};

export const Bestsellers = {
    fields: {
        quantity: {
            type: "number",
            label: "Ilość bestsellerów",
            min: 1,
            max: 30,
        },
    },
    defaultProps: {
        quantity: 5,
    },
    label: "Bestsellery",
    render: ({quantity}) => {
        return (
            <B2BBestsellers quantity={quantity}/>
        );
    },
};
