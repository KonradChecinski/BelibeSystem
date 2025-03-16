import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";

export default function ChangePassword(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    return (
        <Paper sx={{height: 1, p: 2}}>

            <Typography variant="h5" gutterBottom component="h5">
                {t("Change password")}
            </Typography>
            <Box
                sx={{
                    width: 1,
                    // height: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 2
                }}>
                <Box sx={{width: 1}}>
                    {/*{...register("title")}*/}
                    <TextField
                        type="text"
                        id="title"
                        label={t("New password")}
                        // color={errors.title?.message && "error"}

                        // onChange={(value) => {
                        //     setData('title', value.target.value);
                        // }}
                        // defaultValue={data.title}
                        sx={{width: 1, my: 1}}
                    />
                    {/*{errors.title?.message && (*/}
                    {/*    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                    {/*        {errors.title?.message.toString()}*/}
                    {/*    </Typography>*/}
                    {/*)}*/}

                </Box>
                <Box sx={{width: 1}}>
                    {/*{...register("title")}*/}
                    <TextField
                        type="text"
                        id="title"
                        label={t("Confirm new password")}
                        // color={errors.title?.message && "error"}

                        // onChange={(value) => {
                        //     setData('title', value.target.value);
                        // }}
                        // defaultValue={data.title}
                        sx={{width: 1, my: 1}}
                    />
                    {/*{errors.title?.message && (*/}
                    {/*    <Typography variant="body2" color="error" sx={{ml: 1}}>*/}
                    {/*        {errors.title?.message.toString()}*/}
                    {/*    </Typography>*/}
                    {/*)}*/}

                </Box>
                <Box>
                    <Typography variant="body2" color="info" sx={{ml: 1}}>
                        {t("After changing the password, you will need to log in again.")}
                    </Typography>
                </Box>
                <Box sx={{width: 1, display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                    <Button variant="contained" sx={{my: 2}}>
                        {t("Change password")}
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}
