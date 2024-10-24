import React, {useState} from "react";
import {Autocomplete, Box, Grid, TextField, Typography} from "@mui/material";
import {Link} from "@inertiajs/react";
import {useLaravelReactI18n} from "laravel-react-i18n";


export type ColumnProps = {
    link: object;
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
    },
    defaultProps: {
        link: null,
    },
    label: "Link",
    render: ({link}) => {
        // console.log(link)
        return (
            <Link href={link?.url}>
                <Typography variant="body1" gutterBottom>
                    {link?.label}
                </Typography>
            </Link>

        );
    },
};
