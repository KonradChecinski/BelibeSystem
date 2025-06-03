import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Fab,
    Grid,
    IconButton,
    Paper,
    Tooltip,
    Typography
} from "@mui/material";
import {useState} from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates, useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {Add, Delete, DragIndicator, Edit} from "@mui/icons-material";


export default function Locations(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)


    const [rooms, setRooms] = useState(props.locations);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            setRooms((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });

            // Tutaj później dodamy wysyłanie nowej kolejności do backendu
        }
    };


    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Locations")
            }
        >
            <Head title={t("Locations")}/>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{p: 2}}>
                        <Box sx={{height: 'calc(100vh - 250px)', overflow: 'auto'}}>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={rooms}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {rooms.map((room) => (
                                        <RoomItem
                                            key={room.id}
                                            room={room}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </Box>

                        <Box sx={{position: "fixed", bottom: 20, right: 20}}>
                            <Fab
                                color="primary"
                                aria-label="add"
                                onClick={() => {
                                    // Tutaj później dodamy dialog do tworzenia pokoju
                                }}
                            >
                                <Add/>
                            </Fab>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>


        </UserLayout>
    );
}


function RoomItem({room}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: room.id});

    const style = {
        transform: transform ?
            `translate3d(${transform.x}px, ${transform.y}px, 0)` :
            undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };


    return (
        <Paper
            ref={setNodeRef}
            style={style}
            elevation={1}
            sx={{
                p: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                bgcolor: isDragging ? 'grey.100' : 'background.paper'
            }}
        >
            <Box {...attributes} {...listeners} sx={{cursor: 'grab', mr: 2}}>
                <DragIndicator/>
            </Box>

            <Typography variant="h6" sx={{flexGrow: 1}}>
                {room.name}
            </Typography>

            <Box>
                {true && (
                    <Tooltip title="Edytuj">
                        <IconButton
                            onClick={() => {
                                // Tutaj później dodamy edycję
                            }}
                        >
                            <Edit/>
                        </IconButton>
                    </Tooltip>
                )}

                {true && (
                    <Tooltip title="Usuń">
                        <IconButton
                            onClick={() => {
                                // Tutaj później dodamy usuwanie
                            }}
                        >
                            <Delete/>
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Paper>
    );
}
