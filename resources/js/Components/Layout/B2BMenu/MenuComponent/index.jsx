import React, {useEffect, useState} from "react";
import {DndProvider} from "react-dnd";
import {getBackendOptions, getDescendants, MultiBackend, Tree} from "@minoru/react-dnd-treeview";
import {Node} from "@/Components/Layout/B2BMenu/MenuComponent/Components/Node";
import styles from "@/Components/Layout/B2BMenu/MenuComponent/Components/Tree.module.css";
import {Paper} from "@mui/material";


export default function MenuComponent({categories}) {
    return (
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Tree
                tree={categories}
                rootId={0}
                render={(node, {depth, isOpen, onToggle, handleRef}) => (
                    <Node
                        node={node}
                        depth={depth}
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
    );
}
