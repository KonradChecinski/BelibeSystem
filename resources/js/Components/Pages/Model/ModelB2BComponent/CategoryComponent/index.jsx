import React, {useEffect, useState} from "react";
import {DndProvider} from "react-dnd";
import {getBackendOptions, getDescendants, MultiBackend, Tree} from "@minoru/react-dnd-treeview";
import {Node} from "@/Components/Pages/Model/ModelB2BComponent/CategoryComponent/Components/Node";
import styles from "@/Components/Pages/Model/ModelB2BComponent/CategoryComponent/Components/Tree.module.css";
import {Paper} from "@mui/material";


export default function CategoryComponent({categories, data, setData, setEdited}) {
    return (

        <Paper sx={{p: 1}} elevation={5}>
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <Tree
                    tree={categories}
                    rootId={0}
                    render={(node, {depth, isOpen, onToggle, handleRef}) => (
                        <Node
                            node={node}
                            depth={depth}
                            categories={categories}
                            data={data}
                            setData={setData}
                            setEdited={setEdited}
                        />
                    )}
                    onDrop={() => {
                    }}
                    classes={{
                        root: styles.treeRoot,
                        draggingSource: styles.draggingSource,
                        placeholder: styles.placeholderContainer
                    }}
                    sort={false}
                    insertDroppableFirst={false}
                    enableAnimateExpand={true}
                    canDrag={() => false}
                    canDrop={() => false}
                    dropTargetOffset={10}
                    initialOpen={true}
                />
            </DndProvider>
        </Paper>

    );
}
