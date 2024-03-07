import {useState} from "react";
import {DndProvider} from "react-dnd";
import {getBackendOptions, MultiBackend, Tree} from "@minoru/react-dnd-treeview";
import {CustomNode} from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/CustomNode";
import {
    CustomDragPreview
} from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/CustomDragPreview";
import {Placeholder} from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/Placeholder";
import styles from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/Tree.module.css";
import {Box} from "@mui/material";

export default function TreeViewComponent(props) {


    // const [treeData, setTreeData] = useState(props.categories);
    const [treeData, setTreeData] = useState([
            {
                "id": 1,
                "parent": 0,
                "droppable": true,
                "text": "Folder 1"
            },
            {
                "id": 2,
                "parent": 1,
                "text": "File 1-01",
                "droppable": true,
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 3,
                "parent": 1,
                "text": "File 1-02",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 4,
                "parent": 1,
                "text": "File 1-03",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 5,
                "parent": 1,
                "text": "File 1-04",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 6,
                "parent": 1,
                "text": "File 1-05",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 7,
                "parent": 1,
                "text": "File 1-06",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 8,
                "parent": 1,
                "text": "File 1-07",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 9,
                "parent": 1,
                "text": "File 1-08",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 10,
                "parent": 1,
                "text": "File 1-09",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 11,
                "parent": 1,
                "text": "File 1-10",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 12,
                "parent": 1,
                "text": "File 1-11",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 13,
                "parent": 1,
                "text": "File 1-12",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },
            {
                "id": 14,
                "parent": 1,
                "text": "File 1-13",
                "data": {
                    "fileType": "text",
                    "fileSize": "4.8MB"
                }
            },

        ]
    );
    const handleDrop = (newTreeData) => setTreeData(newTreeData);

    return (
        <Box
            sx={{
                overflowY: "auto",
                height: 1
            }}>


            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <Tree
                    tree={treeData}
                    rootId={0}
                    render={(node, {depth, isOpen, onToggle}) => (
                        <CustomNode
                            node={node}
                            depth={depth}
                            isOpen={isOpen}
                            onToggle={onToggle}
                        />
                    )}
                    dragPreviewRender={(monitorProps) => (
                        <CustomDragPreview monitorProps={monitorProps}/>
                    )}
                    onDrop={handleDrop}

                    classes={{
                        root: styles.treeRoot,
                        draggingSource: styles.draggingSource,
                        placeholder: styles.placeholderContainer
                    }}
                    sort={false}
                    insertDroppableFirst={false}
                    enableAnimateExpand={true}
                    // canDrag={false}
                    canDrop={(tree, {dragSource, dropTargetId, dropTarget}) => {
                        if (dragSource?.parent === dropTargetId) {
                            return true;
                        }
                    }}
                    dropTargetOffset={5}
                    placeholderRender={(node, {depth}) => (
                        <Placeholder node={node} depth={depth}/>
                    )}
                />
            </DndProvider>
        </Box>
    );
}
