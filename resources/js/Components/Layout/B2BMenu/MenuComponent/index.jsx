import React, {useEffect, useState} from "react";
import {Box, Button, Typography, IconButton, Grow, Collapse} from "@mui/material";
import {Link} from "@inertiajs/react";
import {Add, KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";


export default function MenuComponent({categories}) {
    if (route().current() === "b2b.category") {
        let tempCategory = {};
        for (const node of categories) {
            if (route().current("b2b.category", {slug: node.slug})) {
                node.active = true;
                tempCategory = node;
            }
        }
        while (tempCategory.parent !== 0) {
            tempCategory = categories.find((category) => category.id === tempCategory.parent);
            tempCategory.childActive = true;
        }
    }


    const filteredParentMenu = categories.filter((category) => {
        return category.parent === 0;
    }).sort((a, b) => a.order - b.order);

    return (
        <>
            {filteredParentMenu.map((category, i) => {
                const children = getDescendants(category, categories);
                return (
                    <MenuElement key={0 + "_" + i} id={0 + "_" + i} node={category} children={children}
                                 defaultShowChildren={false}
                                 categories={categories}/>
                )
            })
            }
        </>
    );
}


function getDescendants(node, nodes) {
    return nodes.filter((n) => n.parent === node.id);
}

function MenuElement({node, children, defaultShowChildren, categories, id = "1"}) {
    const [showChildren, setShowChildren] = useState(defaultShowChildren || node.childActive);

    const hasChildren = Boolean(children.length)
    return (
        <Box sx={{width: 1}}>

            <Box sx={{
                width: 1,
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Button
                    component={Link}
                    href={route("b2b.category", {slug: node.slug})}
                    sx={{
                        width: 1,
                        textTransform: 'none',
                        justifyContent: "flex-start",
                        bgcolor: node.active ? "#1967d225" : "",
                    }}
                >
                    <Typography variant="body1" color={"menuText.main"}>
                        {node.name}
                    </Typography>
                </Button>
                {hasChildren && (
                    <Box>
                        <IconButton aria-label="add" onClick={() => setShowChildren(!showChildren)}>
                            {showChildren ? (
                                <KeyboardArrowDown sx={{color: "menuText.main"}}/>
                            ) : (
                                <KeyboardArrowUp sx={{color: "menuText.main"}}/>
                            )}
                        </IconButton>
                    </Box>
                )
                }
            </Box>

            {hasChildren && (
                <Collapse in={showChildren}>
                    <Box sx={{pl: 2}}>
                        {children.map((child, i) => {
                            const childChildren = getDescendants(child, categories);
                            return (
                                <MenuElement key={id + "_" + i} id={id + "_" + i} node={child} children={childChildren}
                                             defaultShowChildren={false}
                                             categories={categories}/>
                            )
                        })
                        }
                    </Box>
                </Collapse>
            )}
        </Box>
    )
}
