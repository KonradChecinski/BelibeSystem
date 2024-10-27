import {
    Box, Button,
    Card,
    CardActionArea, CardActions,
    CardContent,
    CardMedia, Checkbox,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import {router, useForm} from "@inertiajs/react";
import {sortBySizes} from "@/Functions/sortBySizes";
import toLocaleString from "@/Functions/toLocaleString";
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import {useState} from "react";
import {enqueueSnackbar} from "notistack";
import ModelComponent from "@/Components/Pages/B2B/ModelComponent";

export default function ModelList(props) {
    const [items, setItems] = useState(props.models.data);
    const [hasMore, setHasMore] = useState(props.models.current_page !== props.models.last_page)
    const [page, setPage] = useState(props.models.current_page);
    const [totalPages, setTotalPages] = useState(props.models.last_page);
    const [totalItems, setTotalItems] = useState(props.models.total);
    const [path, setPath] = useState(props.models.path);

    const fetchMoreData = () => {
        if (page + 1 > totalPages) {
            setHasMore(false)
        } else {
            fetch(path + `?page=${page + 1}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(result => {
                    if (result.data.length === 0) setHasMore(false)

                    setPage(result.current_page)
                    setItems([...items, ...result.data])

                    if (totalPages === page) setHasMore(false)
                })
        }
    }


    return (
        <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            style={{
                overflow: "hidden",
            }}
            scrollThreshold={"300px"}
            loader={
                <Box
                    sx={{
                        width: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 1,
                        mb: 1

                    }}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1

                    }}>
                        <CircularProgress/>
                        <Typography variant="body1" gutterBottom textAlign={"center"}>
                            Widziałeś/-aś {items.length} z {totalItems}
                        </Typography>
                    </Box>

                </Box>
            }
            endMessage={
                <>
                    <Typography variant="h6" gutterBottom textAlign={"center"}>
                        Widziałeś/-aś wszystkie produkty
                    </Typography>
                    <Typography variant="body1" gutterBottom textAlign={"center"}>
                        {items.length} z {totalItems}
                    </Typography>
                </>
            }
        >

            <Grid container spacing={3} sx={{minHeight: "95%", p: 1}} alignItems="stretch">
                {items.map((model) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={model.id} sx={{display: "flex"}}>
                            <ModelComponent model={model} key={model.id}/>
                        </Grid>
                    )
                )}
            </Grid>

        </InfiniteScroll>
    )
}
