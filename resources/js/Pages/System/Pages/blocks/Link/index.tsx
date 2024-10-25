import React, {useState} from "react";
import {Autocomplete, Box, Grid, TextField, Typography} from "@mui/material";
import {Link} from "@inertiajs/react";
import {useLaravelReactI18n} from "laravel-react-i18n";


const variantOptions = [
    {label: "Nagłówek 1", value: "h1"},
    {label: "Nagłówek 2", value: "h2"},
    {label: "Nagłówek 3", value: "h3"},
    {label: "Nagłówek 4", value: "h4"},
    {label: "Nagłówek 5", value: "h5"},
    {label: "Nagłówek 6", value: "h6"},
    {label: "Tekst 1", value: "body1"},
    {label: "Tekst 2", value: "body2"},
    {label: "Podtytuł", value: "subtitle1"},
    {label: "Podpis", value: "caption"},
];
const alignOptions = [
    {label: "Do lewej", value: "left"},
    {label: "Do środka", value: "center"},
    {label: "Do prawej", value: "right"},
    {label: "Wyjustowany", value: "justify"},
    {label: "Dziedziczony", value: "inherit"},
];

export type PuckLinkProps = {
    link: object;
    variant: string;
    align: string;
};

export const PuckLink = {
    fields: {
        link: {
            type: "custom",
            render: ({name, onChange, value}) => {
                const {t} = useLaravelReactI18n();
                const [links, setLinks] = useState([])
                // let data = null
                // let links = []
                if (links.length === 0) {
                    axios.get(route("system.pages.links"))
                        .then(response => {
                            const data = response.data
                            let tempLinks = [];
                            console.log(response.data)
                            for (const group of data) {
                                for (const link of group.links) {
                                    tempLinks.push({
                                        label: link.name,
                                        url: link.url,
                                        group: group.name
                                    })
                                }

                            }
                            setLinks(tempLinks)

                        })
                        .catch(error => {
                            console.error(error)
                        });
                }


                return (
                    <Autocomplete
                        disablePortal
                        options={links}
                        groupBy={(option) => option.group}
                        value={value}
                        onChange={(e, value) => onChange(value)}
                        sx={{width: 1}}
                        renderInput={(params) => <TextField {...params} label="Strona"/>}
                        renderGroup={(params) => (
                            <li key={params.key}>
                                <Box sx={{bgcolor: "#00000055", p: 1, color: "#fff"}}>
                                    <Typography variant="body1">
                                        {t(params.group)}
                                    </Typography>
                                </Box>
                                <ul>{params.children}</ul>
                            </li>
                        )}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.link}>
                                    {option.label}
                                </li>
                            );
                        }}
                    />

                );
            }
        },
        variant: {
            label: "Wariant",
            type: "select",
            options: variantOptions,
        },
        align: {
            label: "Wyrównanie",
            type: "select",
            options: alignOptions,
        },
    },
    defaultProps: {
        link: null,
        variant: "body1",
        align: "left",
    },
    label: "Link",
    render: ({link, variant, align}) => {
        // console.log(link)
        return (
            <Link href={link?.url}>
                <Typography
                    variant={variant}
                    align={align}
                    sx={{
                        px: 1,
                        // py: 1,
                        my: 1,
                        textDecoration: "underline",
                        "&:hover": {
                            color: "primary.main",
                        }
                    }}>
                    {link?.label}
                </Typography>
            </Link>

        );
    },
};
