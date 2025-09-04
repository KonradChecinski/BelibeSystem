import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Autocomplete,
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Popover,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {DayPicker} from "react-day-picker";
import {pl} from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import {Fragment, useEffect, useMemo, useState} from "react";
import moment from "moment";
import {Abc, Attachment, MailOutline, Notifications} from "@mui/icons-material";
import * as PropTypes from "prop-types";

function AttachmentIcon(props) {
    return null;
}

AttachmentIcon.propTypes = {fontSize: PropTypes.string};
export default function EmailHistory(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    const emails = props.emails;

    const [selectedDate, setSelectedDate] = useState(null);
    const [type, setType] = useState("");
    const [classFilter, setClassFilter] = useState("");

    const [anchorEl, setAnchorEl] = useState(null);

    const [selectedEmail, setSelectedEmail] = useState(null);
    const [iframeLoading, setIframeLoading] = useState(false);
    useEffect(() => {
        if (selectedEmail?.id) {
            setIframeLoading(true);
        }
    }, [selectedEmail?.id]);


    const selectEmail = (email) => {
        setSelectedEmail(email);
    }

    const uniqueClasses = useMemo(
        () => Array.from(new Set(emails.map((e) => e.class))),
        [emails]
    );

    const uniqueTypes = useMemo(
        () => Array.from(new Set(emails.map((e) => e.type))),
        [emails]
    );

    const filteredEmails = emails.filter((email) => {
        let match = true;
        if (selectedDate) {
            const dateStrFrom = moment(selectedDate["from"]);
            const dateStrTo = moment(selectedDate["to"]);
            if (!moment(email.sent_at).isBetween(dateStrFrom, dateStrTo)) match = false;
        }
        if (type && email.type !== type) match = false;
        if (classFilter && email.class !== classFilter) match = false;
        return match;
    });

    const handleOpenDatePicker = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseDatePicker = () => {
        setAnchorEl(null);
    };

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Client's email history") + ": " + props.client.name
            }
        >
            <Head title={t("Client's email history") + ": " + props.client.name}/>
            <Grid container spacing={2} sx={{height: "100%", minHeight: 0}}>
                <Grid item xs={12} md={7} sx={{display: "flex", flexDirection: "column", minHeight: 0}}>
                    {/*<Paper sx={{height: "100%", display: "flex"}} elevation={1}>*/}
                    {/*<ClientEmailHistoryTable emails={props.emails} props={props}/>*/}
                    {/*</Paper>*/}
                    {/* FILTRY */}
                    <Paper sx={{p: 2, mb: 2}}>
                        <Grid container spacing={2} alignItems="center">
                            {/* Date filter with popover */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Data"
                                    value={selectedDate ? selectedDate["from"].toLocaleDateString() + "-" + selectedDate["to"].toLocaleDateString() : ""}
                                    // value={""}
                                    onClick={handleOpenDatePicker}
                                    readOnly={true}
                                />
                                <Popover
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={handleCloseDatePicker}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                >
                                    <Box p={2}>
                                        <DayPicker
                                            mode="range"
                                            selected={selectedDate}
                                            locale={pl}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                // handleCloseDatePicker();
                                            }}
                                            showWeekNumber
                                            numberOfMonths={2}
                                            animate={true}
                                            role={"dialog"}
                                            showOutsideDays
                                            disabled={{after: new Date()}}
                                            defaultMonth={moment().subtract(1, 'month').toDate()}
                                        />
                                        <Button size="small" onClick={() => setSelectedDate(null)}>
                                            Wyczyść
                                        </Button>
                                    </Box>
                                </Popover>
                            </Grid>

                            {/* Type filter */}
                            <Grid item xs={12} md={4}>
                                <Autocomplete
                                    options={uniqueTypes}
                                    value={type}
                                    onChange={(e, newValue) => setType(e.target.value)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Typ" fullWidth/>
                                    )}
                                />
                            </Grid>

                            {/* Class filter with Autocomplete */}
                            <Grid item xs={12} md={4}>
                                <Autocomplete
                                    options={uniqueClasses}
                                    value={classFilter || null}
                                    onChange={(e, newValue) => setClassFilter(newValue || "")}
                                    getOptionLabel={(opt) =>
                                        typeof opt === "string" ? opt.split("\\").pop() : ""
                                    }
                                    // na liście rozwijanej pokazujemy pełną nazwę
                                    renderOption={(props, option) => (
                                        <li {...props}>{option}</li>
                                    )}
                                    isOptionEqualToValue={(opt, val) => opt === val}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Klasa" fullWidth/>
                                    )
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Paper>


                    <Paper sx={{flex: "1 1 0", overflowY: "auto"}} elevation={1}>
                        {/* LISTA MAILI */}
                        <List disablePadding>
                            {filteredEmails.sort((a, b) => b.id - a.id).map((email, i) => {

                                const from = email.from?.[0]?.name + " (" + email.from?.[0]?.address + ")" || "(brak)";
                                const to = email.to?.map((t) => t.address).join(", ") || "(brak)";
                                const cc = email.cc?.map((c) => c.address).join(", ");
                                const bcc = email.bcc?.map((b) => b.address).join(", ");
                                const time = moment(email.sent_at).format("HH:mm:ss DD.MM.YYYY");
                                const attachmentsCount = email.attachments?.length || 0;
                                const getTypeIcon = (type) => {
                                    switch (type) {
                                        case "notification":
                                            return <Notifications fontSize="small"/>;
                                        case "mailable":
                                            return <MailOutline fontSize="small"/>;
                                        default:
                                            return <Abc fontSize="small"/>;
                                    }
                                };

                                const getTypeLabel = (type) => {
                                    switch (type) {
                                        case "notification":
                                            return "Powiadomienie";
                                        case "mailable":
                                            return "Mail";
                                        default:
                                            return "Inny";
                                    }
                                }

                                return (
                                    <Fragment key={email.id}>
                                        <ListItem disablePadding onClick={() => selectEmail(email)}
                                                  selected={selectedEmail?.id === email.id}
                                        >
                                            <ListItemButton alignItems="flex-start">
                                                <ListItemAvatar>

                                                    <Tooltip
                                                        title={getTypeLabel(email.type)}
                                                        arrow>
                                                        <Avatar
                                                            sx={{bgcolor: "primary.main"}}>{getTypeIcon(email.type)}</Avatar>
                                                    </Tooltip>

                                                </ListItemAvatar>


                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" justifyContent="space-between"
                                                               alignItems="center">
                                                            <Box>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <Typography variant="caption"> Do:</Typography>
                                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                                        {to}
                                                                    </Typography>
                                                                </Stack>

                                                                {cc && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                                noWrap>
                                                                        DW: {cc}
                                                                    </Typography>
                                                                )}
                                                                {bcc && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                                noWrap>
                                                                        UDW: {bcc}
                                                                    </Typography>
                                                                )}
                                                            </Box>

                                                            <Typography variant="caption" color="text.secondary"
                                                                        sx={{ml: 1}}>
                                                                {time}
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                    secondary={
                                                        <Stack direction="column" spacing={0.5} sx={{mt: 0.5}}>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.primary"
                                                                sx={{
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap"
                                                                }}
                                                            >
                                                                {email.subject}
                                                            </Typography>

                                                            <Typography variant="caption" noWrap>
                                                                Od: {from}
                                                            </Typography>


                                                            <Stack direction="row" spacing={1} alignItems="center"
                                                                   justifyContent="space-between"
                                                                   flexWrap="wrap">
                                                                <Chip
                                                                    size="small"
                                                                    label={email.class}
                                                                    sx={{maxWidth: 250}}
                                                                />
                                                                {attachmentsCount > 0 && (
                                                                    <Tooltip title={`${attachmentsCount} załącznik(i)`}>
                                                                        <Badge badgeContent={attachmentsCount}
                                                                               color="secondary">
                                                                            <Attachment fontSize="medium"/>
                                                                        </Badge>
                                                                    </Tooltip>
                                                                )}
                                                            </Stack>
                                                        </Stack>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        {i < filteredEmails.length - 1 && <Divider component="li"/>}
                                    </Fragment>
                                );

                            })}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{height: "100%", position: "relative"}} elevation={1}>
                        {selectedEmail?.id && (
                            <>
                                {iframeLoading && (
                                    <Paper
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            bgcolor: "disabled.background",
                                            zIndex: 1
                                        }}
                                    >
                                        <CircularProgress size={32}/>
                                    </Paper>
                                )}
                                <iframe
                                    key={selectedEmail.id} // wymusza przeładowanie przy zmianie
                                    src={route("system.emailLogs.show", {emailLog: selectedEmail.id})}
                                    onLoad={() => setIframeLoading(false)}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                        borderRadius: "16px",
                                    }}
                                />
                            </>


                        )}

                    </Paper>
                </Grid>
            </Grid>


        </UserLayout>
    );
}
