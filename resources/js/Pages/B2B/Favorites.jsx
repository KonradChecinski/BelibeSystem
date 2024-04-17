import {Head, Link, router} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia, Checkbox, CircularProgress, Divider,
    Grid, IconButton, Pagination, PaginationItem,
    Paper,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {sortBySizes} from "@/Functions/sortBySizes";
import {Delete, Favorite, FavoriteBorder} from "@mui/icons-material";
import InfiniteScroll from 'react-infinite-scroll-component';
import {useEffect, useState} from "react";
import ModelList from "@/Components/Pages/B2B/ModelList";

export default function B2bFavorites(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            header={t("Favorites")}
        >
            <Head title={t("Favorites")}/>
            <ModelList {...props} />

        </ClientLayout>
    );
}
