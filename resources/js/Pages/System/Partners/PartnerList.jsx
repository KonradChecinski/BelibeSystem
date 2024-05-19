import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Card, createTheme, Typography} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {useCallback, useState} from "react";
import {Cron} from "@levashovn/react-js-cron-mui5";
import POLISH_LOCALE from "./pl_locale";
import PartnersTable from "@/Components/Table/Partners/PartnersTable";

export default function PartnerList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const defaultValue = '0 2 * * 3'
    const [value, setValue] = useState(defaultValue)
    const [textValue, setTextValue] = useState('');
    const customSetValue = useCallback(
        (newValue) => {
            setValue(newValue)
            setTextValue(newValue);
        },
        [setTextValue]
    )
    const [error, onError] = useState()


    const [cronExp, setCronExp] = useState('0 0 * * *')
    const [cronError, setCronError] = useState('') // get error message if cron is invalid
    const [isAdmin, setIsAdmin] = useState(true) // set admin or non-admin to enable or disable high frequency scheduling (more than once a day)


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Partners")}>
            <Head title={t("Partners")}/>

            <Card sx={{height: "100%", width: 1}}>
                <PartnersTable {...props} />
                {/*<Typography>*/}
                {/*    {textValue}*/}
                {/*</Typography>*/}

                {/*<Cron*/}
                {/*    value={value}*/}
                {/*    setValue={customSetValue}*/}
                {/*    onError={onError}*/}
                {/*    clearButton={false}*/}
                {/*    leadingZero={true}*/}
                {/*    shortcuts={false}*/}
                {/*    locale={POLISH_LOCALE}*/}
                {/*    className={"my-project-cron"}*/}
                {/*/>*/}
            </Card>
        </UserLayout>
    );
}
