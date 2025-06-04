import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Fab,
    Grid,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import {useState} from "react";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners, DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {Add, Delete, DragIndicator, Edit, ExpandMore, ChevronRight} from "@mui/icons-material";


export default function LocationsComponent(props) {
    const {t} = useLaravelReactI18n();
    const [locations, setLocations] = useState(props.locations);
    const [activeId, setActiveId] = useState(null);
    const [expandedRooms, setExpandedRooms] = useState({});

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    const handleDragEnd = (event) => {
        setActiveId(null);
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const activeType = active.id.split('-')[0];
        const overType = over.id.split('-')[0];

        setLocations(prevLocations => {
            const newLocations = JSON.parse(JSON.stringify(prevLocations));

            // Dla pokoi
            if (activeType === 'room' && overType === 'room') {
                const oldIndex = newLocations.findIndex(room => room.id === active.id);
                const newIndex = newLocations.findIndex(room => room.id === over.id);
                return arrayMove(newLocations, oldIndex, newIndex);
            }

            // Dla alejek
            if (activeType === 'aisle') {
                if (overType === 'room') {
                    // Przenoszenie alejki do innego pokoju
                    let aisleToMove = null;
                    let sourceRoom = null;
                    let targetRoom = null;

                    for (const room of newLocations) {
                        if (room.id === over.id) {
                            targetRoom = room;
                        }
                        const aisle = room.children?.find(a => a.id === active.id);
                        if (aisle) {
                            aisleToMove = {...aisle};
                            sourceRoom = room;
                        }
                    }

                    if (aisleToMove && sourceRoom && targetRoom) {
                        sourceRoom.children = sourceRoom.children.filter(a => a.id !== active.id);
                        aisleToMove.parent = targetRoom.id;
                        if (!targetRoom.children) targetRoom.children = [];
                        targetRoom.children.push(aisleToMove);
                    }
                } else if (overType === 'aisle') {
                    // Sortowanie alejek w tym samym pokoju
                    for (const room of newLocations) {
                        if (room.children?.some(a => a.id === active.id)) {
                            const oldIndex = room.children.findIndex(a => a.id === active.id);
                            const newIndex = room.children.findIndex(a => a.id === over.id);
                            room.children = arrayMove(room.children, oldIndex, newIndex);
                            break;
                        }
                    }
                }
            }

            // Dla półek
            if (activeType === 'shelf') {
                if (overType === 'aisle') {
                    // Przenoszenie regału do innej alejki
                    let shelfToMove = null;
                    let sourceAisle = null;
                    let targetAisle = null;

                    // Znajdź źródłową i docelową alejkę oraz regał do przeniesienia
                    for (const room of newLocations) {
                        for (const aisle of (room.children || [])) {
                            if (aisle.id === over.id) {
                                targetAisle = aisle;
                            }
                            const shelf = aisle.children?.find(s => s.id === active.id);
                            if (shelf) {
                                shelfToMove = {...shelf};
                                sourceAisle = aisle;
                            }
                        }
                    }

                    if (shelfToMove && sourceAisle && targetAisle) {
                        // Usuń regał ze źródłowej alejki
                        sourceAisle.children = sourceAisle.children.filter(s => s.id !== active.id);

                        // Dodaj regał do docelowej alejki
                        shelfToMove.parent = targetAisle.id;
                        if (!targetAisle.children) targetAisle.children = [];
                        targetAisle.children.push(shelfToMove);
                    }
                } else if (overType === 'shelf') {
                    // Sortowanie regałów w tej samej alejce
                    for (const room of newLocations) {
                        for (const aisle of (room.children || [])) {
                            if (aisle.children?.some(shelf => shelf.id === active.id)) {
                                const oldIndex = aisle.children.findIndex(shelf => shelf.id === active.id);
                                const newIndex = aisle.children.findIndex(shelf => shelf.id === over.id);
                                aisle.children = arrayMove(aisle.children, oldIndex, newIndex);
                                break;
                            }
                        }
                    }
                }
            }

            return newLocations;
        });
    };


    const [activeItem, setActiveItem] = useState(null);

    const handleDragStart = (event) => {
        const {active} = event;
        setActiveId(active.id);

        // Znajdź aktywny element
        const activeItem = findItemById(active.id, locations);
        setActiveItem(activeItem);
    };

    // Pomocnicza funkcja do znajdowania elementu po ID
    const findItemById = (id, items) => {
        // Dla pokoi
        const room = items.find(room => room.id === id);
        if (room) return room;

        // Dla alejek
        for (const room of items) {
            const aisle = room.children?.find(aisle => aisle.id === id);
            if (aisle) return aisle;

            // Dla regałów
            for (const aisle of (room.children || [])) {
                const shelf = aisle.children?.find(shelf => shelf.id === id);
                if (shelf) return shelf;
            }
        }
        return null;
    };


    const collisionDetectionStrategy = (args) => {
        const {active, droppableContainers} = args;
        const activeType = active.id.toString().split('-')[0];
        const activeContainer = active.data.current?.sortable?.containerId;

        // Filtrujemy kontenery w zależności od typu przeciąganego elementu
        const filteredContainers = droppableContainers.filter(container => {
            const containerType = container.id.toString().split('-')[0];
            const containerId = container.id.toString();

            if (activeType === 'aisle') {
                // Pozwalamy na upuszczanie na pokoje i na inne alejki w tym samym pokoju
                if (containerType === 'room') return true;
                if (containerType === 'aisle') {
                    // Sprawdzamy czy alejka jest w tym samym pokoju
                    const activeParentRoom = active.data.current?.parent;
                    const containerParentRoom = container.data.current?.parent;
                    return activeParentRoom === containerParentRoom;
                }
                return false;
            }

            if (activeType === 'shelf') {
                // Pozwalamy na upuszczanie na alejki i na inne półki w tej samej alejce
                if (containerType === 'aisle') return true;
                if (containerType === 'shelf') {
                    // Sprawdzamy czy półka jest w tej samej alejce
                    const activeParentAisle = active.data.current?.parent;
                    const containerParentAisle = container.data.current?.parent;
                    return activeParentAisle === containerParentAisle;
                }
                return false;
            }

            if (activeType === 'room') {
                return containerType === 'room';
            }

            return false;
        });

        return closestCorners({
            ...args,
            droppableContainers: filteredContainers
        });
    };


    const handleDragOver = (event) => {
        const {active, over} = event;
        if (!over) return;

        const activeType = active.id.toString().split('-')[0];
        const overType = over.id.toString().split('-')[0];

        if (activeType === 'aisle' && overType === 'room') {
            // Automatycznie rozwijamy pokój, nad którym przeciągamy alejkę
            setExpandedRooms(prev => ({
                ...prev,
                [over.id]: true
            }));
        }
    };


    return (
        <Box sx={{height: 'calc(100vh - 250px)', overflow: 'auto'}}>
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetectionStrategy}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={locations.map(room => room.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {locations.map((room) => (
                        <RoomItem
                            key={room.id}
                            room={room}
                            isExpanded={expandedRooms[room.id]}
                            onToggle={() => {
                                setExpandedRooms(prev => ({
                                    ...prev,
                                    [room.id]: !prev[room.id]
                                }));
                            }}
                        />
                    ))}
                </SortableContext>
                <DragOverlay>
                    {activeItem && (
                        <DraggingItem item={activeItem}/>
                    )}
                </DragOverlay>
            </DndContext>
        </Box>
    );
}


function RoomItem({room, isExpanded, onToggle}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({
        id: room.id,
        data: {
            type: 'room',
            accepts: ['aisle']
        }
    });


    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
    };


    return (
        <Box sx={{mb: 2}}>
            <Paper
                ref={setNodeRef}
                style={{
                    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                    transition,
                }}
                elevation={1}
                sx={{
                    p: 2,
                    opacity: isDragging ? 0.5 : 1,
                    bgcolor: 'errorBg.main',
                    border: isOver ? '2px dashed #666' : '2px solid transparent',
                    position: 'relative',
                    '&[data-droppable="true"]': {
                        backgroundColor: isOver ? 'action.hover' : 'errorBg.main',
                    }
                }}
                data-droppable="true"
            >


                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <IconButton onClick={onToggle} size="small">
                        {isExpanded ? <ExpandMore/> : <ChevronRight/>}
                    </IconButton>

                    <Box {...attributes} {...listeners} sx={{cursor: 'grab', mr: 2}}>
                        <DragIndicator/>
                    </Box>

                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {room.name}
                    </Typography>

                    <Box>
                        <Tooltip title="Edytuj">
                            <IconButton>
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Usuń">
                            <IconButton>
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>


                {isExpanded && room.children && (
                    <Box sx={{ml: 4, mt: 1}}>
                        <SortableContext
                            items={room.children}
                            strategy={verticalListSortingStrategy}
                        >
                            {room.children.map((aisle) => (
                                <AisleItem
                                    key={aisle.id}
                                    aisle={aisle}
                                    parentRoom={room.id}
                                />
                            ))}
                        </SortableContext>
                    </Box>
                )}


            </Paper>
        </Box>
    );
}

function AisleItem({aisle, parentRoom}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({
        id: aisle.id,
        data: {
            type: 'aisle',
            accepts: ['shelf'],
            parent: parentRoom
        }
    });


    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
    };

    return (
        <Box sx={{mb: 1}}>
            <Paper
                ref={setNodeRef}
                style={style}
                elevation={1}
                sx={{
                    p: 1,
                    opacity: isDragging ? 0.5 : 1,
                    bgcolor: 'successBg.main',
                    border: isOver ? '2px dashed #666' : '2px solid transparent',
                    position: 'relative',
                }}
            >

                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box {...attributes} {...listeners} sx={{cursor: 'grab', mr: 2}}>
                        <DragIndicator/>
                    </Box>

                    <Typography variant="subtitle1" sx={{flexGrow: 1}}>
                        {aisle.name}
                    </Typography>

                    <Box>
                        <Tooltip title="Edytuj">
                            <IconButton size="small">
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Usuń">
                            <IconButton size="small">
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {aisle.children && (
                    <Box sx={{ml: 4, mt: 1}}>
                        <SortableContext
                            items={aisle.children}
                            strategy={verticalListSortingStrategy}
                        >
                            {aisle.children.map((shelf) => (
                                <ShelfItem
                                    key={shelf.id}
                                    shelf={shelf}
                                    parentAisle={aisle.id}
                                />
                            ))}
                        </SortableContext>
                    </Box>
                )}


            </Paper>
        </Box>
    );
}

function ShelfItem({shelf, parentAisle}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: shelf.id,
        data: {
            type: 'shelf',
            parent: parentAisle
        }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
    };

    return (
        <Box sx={{mb: 1, display: 'flex', alignItems: 'center', width: 1}}>

            <Paper
                ref={setNodeRef}
                style={style}
                elevation={1}
                sx={{
                    flex: 1,
                    p: 1,
                    opacity: isDragging ? 0.5 : 1,
                    bgcolor: 'background.paper'
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box {...attributes} {...listeners} sx={{cursor: 'grab', mr: 2}}>
                        <DragIndicator/>
                    </Box>


                    <Typography sx={{flexGrow: 1}}>
                        {shelf.name}
                    </Typography>

                    <Box>
                        <Tooltip title="Edytuj">
                            <IconButton size="small">
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Usuń">
                            <IconButton size="small">
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}


function DraggingItem({item}) {
    const type = item.id.split('-')[0];
    let style = {}

    if (type === 'room') {
        style = {
            backgroundColor: 'errorBg.main',
            width: '100%',
        };
    } else if (type === 'aisle') {
        style = {
            backgroundColor: 'successBg.main',
            width: '90%',
        };
    } else if (type === 'shelf') {
        style = {
            backgroundColor: 'background.paper',
            width: '80%',
        };
    }


    return (
        <Paper
            elevation={3}
            sx={{
                ...style,
                p: 1.5,
                minWidth: '200px',
                opacity: 0.9,
                position: 'relative',
                pointerEvents: 'none',
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <DragIndicator sx={{mr: 2}}/>
                <Typography>
                    {item.name}
                </Typography>
            </Box>
        </Paper>
    );

}
