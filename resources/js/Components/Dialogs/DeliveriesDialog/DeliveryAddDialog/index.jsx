import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Step,
    StepLabel,
    Stepper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import {AddCircleOutline, Done, Download, Error, Refresh} from '@mui/icons-material';
import {useEffect, useMemo, useState} from 'react';
import Draggable from 'react-draggable';
import {useSnackbar} from 'notistack';
import {useDeliveryAddForm} from '@/Components/Dialogs/DeliveriesDialog/DeliveryAddDialog/form/useDeliveryAddForm';
import {
    defaultShipmentForm,
    schema,
} from '@/Components/Dialogs/DeliveriesDialog/DeliveryAddDialog/form/deliveryAddFormSchema';
import {useTheme} from "@mui/material/styles";

const mapOrderToOption = (order = {}) => ({
    id: `${order.orderType ?? 'ClientOrder'}:${order.id ?? order.number ?? ''}`,
    label: order.label || `Zamówienie #${order.number || order.id || ''}`,
    orderType: order.orderType ?? 'ClientOrder',
    orderId: String(order.id ?? order.number ?? ''),
    isCod: Boolean(order.isCod),
    codValue: order.codValue ?? order.totalGross ?? 0,
    createdAt: order.createdAt || '',
    courierId: order.courierId ?? null,
    customer: {
        name: order.customer?.name || '',
        company: order.customer?.company || '',
        street: order.customer?.street || '',
        buildingNumber: order.customer?.buildingNumber || '',
        apartmentNumber: order.customer?.apartmentNumber || '',
        postalCode: order.customer?.postalCode || '',
        city: order.customer?.city || '',
        country: order.customer?.country || 'PL',
        phone: order.customer?.phone || '',
        email: order.customer?.email || '',
    },
    'totalNet': order.totalNet || 0,
    'totalGross': order.totalGross || 0,
});

const normalizeOrderType = (type) => {
    if (!type) return '';
    const clean = String(type).replace(/^[\\\/]+/, '');
    if (clean === 'App\\Models\\Orders' || clean === 'App\\Models\\Order' || clean === 'Orders' || clean === 'Order') {
        return 'Order';
    }
    if (clean === 'App\\Models\\ClientOrder' || clean === 'App\\Models\\ClientOrders' || clean === 'ClientOrder' || clean === 'ClientOrders') {
        return 'ClientOrder';
    }
    return clean;
};

const parseInitialOrderProps = (initialOrderId, initialOrderType) => {
    if (!initialOrderId) return {id: null, orderType: null};

    if (typeof initialOrderId === 'object') {
        return {
            id: String(initialOrderId.id ?? initialOrderId.orderId ?? initialOrderId.number ?? ''),
            orderType: normalizeOrderType(initialOrderId.orderType ?? initialOrderType),
        };
    }

    const str = String(initialOrderId);
    if (str.includes(':')) {
        const [rawType, rawId] = str.split(':');
        return {
            id: rawId,
            orderType: normalizeOrderType(rawType),
        };
    }

    return {
        id: str,
        orderType: normalizeOrderType(initialOrderType),
    };
};

const findMatchingOrder = (orders, targetId, targetType) => {
    if (!targetId) return null;

    if (targetType) {
        const exactMatch = orders.find(
            (o) => String(o.orderId) === String(targetId) && normalizeOrderType(o.orderType) === targetType
        );
        if (exactMatch) return exactMatch;
    }

    return orders.find((o) => String(o.orderId) === String(targetId)) || null;
};

const getPreferredCourierId = (order = {}, courierList = []) => {
    if (order?.courierId) {
        const sameId = courierList.find((courier) => String(courier.id) === String(order.courierId));
        if (sameId) {
            return sameId.id;
        }
    }

    return courierList[0]?.id ?? '';
};

const mapCourierToOption = (courier = {}) => ({
    id: String(courier.id ?? ''),
    name: courier.name || '',
    logo: courier.logo || (courier.name || '').slice(0, 2).toUpperCase(),
    supportsCOD: Boolean(courier.supportsCOD),
    allowsMultiplePackages: Boolean(courier.allowsMultiplePackages),
    packageFields: courier.packageFields || {
        weight: {enabled: true, required: true},
        width: {enabled: false, required: false},
        height: {enabled: false, required: false},
        depth: {enabled: false, required: false},
    },
});

const getPackageFieldLabel = (field) => ({
    weight: 'waga',
    width: 'szerokość',
    height: 'wysokość',
    depth: 'głębokość',
}[field] || field);

const validateCourierPackageConstraints = (courier, packages = []) => {
    if (!courier) {
        return {valid: true, message: ''};
    }

    const safePackages = Array.isArray(packages) ? packages : [];

    if (!courier.allowsMultiplePackages && safePackages.length > 1) {
        return {
            valid: false,
            message: 'Ten kurier nie obsługuje wielu paczek.',
        };
    }

    for (let packageIndex = 0; packageIndex < safePackages.length; packageIndex += 1) {
        const pkg = safePackages[packageIndex] || {};

        for (const [field, config] of Object.entries(courier.packageFields || {})) {
            const fieldConfig = config || {};
            const isEnabled = Boolean(fieldConfig.enabled);
            const isRequired = Boolean(fieldConfig.required);

            if (!isEnabled || !isRequired) {
                continue;
            }

            const value = pkg[field];
            const hasValue = value !== null && value !== undefined && value !== '' && String(value).trim() !== '';

            if (!hasValue) {
                return {
                    valid: false,
                    message: `Paczka ${packageIndex + 1}: pole ${getPackageFieldLabel(field)} jest wymagane.`,
                };
            }
        }
    }

    return {valid: true, message: ''};
};

const getCourierConfig = (courierId, courierList = []) => courierList.find((courier) => courier.id === courierId) ?? courierList[0] ?? null;

const formatCodValue = (value) => {
    if (value === null || value === undefined) {
        return '';
    }

    const normalized = value
        .toString()
        .replace('.', ',')
        .replace(/[^\d,]/g, '');

    const [wholePart, decimalPart = ''] = normalized.split(',');
    const safeWholePart = wholePart || '0';

    if (!normalized.includes(',')) {
        return safeWholePart;
    }

    return `${safeWholePart},${decimalPart.slice(0, 2)}`;
};

const centsToCurrencyValue = (value) => {
    const numeric = Number(value ?? 0);

    if (!Number.isFinite(numeric)) {
        return '';
    }

    return (numeric / 100).toFixed(2).replace('.', ',');
};

const currencyValueToCents = (value) => {
    if (value === null || value === undefined || value === '') {
        return 0;
    }

    const normalized = value.toString().replace(/\s/g, '').replace(',', '.');
    const numeric = Number(normalized);

    if (!Number.isFinite(numeric)) {
        return 0;
    }

    return Math.round(numeric * 100);
};

const steps = [
    'Wybór zamówienia',
    'Kurier i dane',
    'Zatwierdzenie',
    'Etykieta',
];

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default function DeliveryAddDialog({open, setOpen, initialOrderId = null, initialOrderType = null}) {
    const {enqueueSnackbar} = useSnackbar();
    const {
        register,
        setValue,
        watch,
        reset,
        trigger,
        setError,
        clearErrors,
        formState: {errors},
    } = useDeliveryAddForm(schema, defaultShipmentForm);

    const shipment = watch();
    const hasInitialOrder = Boolean(initialOrderId);
    const [orderOptions, setOrderOptions] = useState([]);
    const [courierOptions, setCourierOptions] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [isSavingShipment, setIsSavingShipment] = useState(false);
    const [isFetchingLabel, setIsFetchingLabel] = useState(false);
    const [shipmentProgress, setShipmentProgress] = useState({
        save: 'idle',
        send: 'idle',
    });
    const [submitError, setSubmitError] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [createdShipmentId, setCreatedShipmentId] = useState(null);
    const [labelReady, setLabelReady] = useState(false);
    const [labelDownloaded, setLabelDownloaded] = useState(false);
    const [labelProgress, setLabelProgress] = useState({
        generate: 'idle',
        packages: 'idle',
        download: 'idle',
    });
    const [shipmentPackagesData, setShipmentPackagesData] = useState([]);
    const [shipmentLocked, setShipmentLocked] = useState(false);

    const theme = useTheme();

    const selectedOrder = useMemo(
        () => orderOptions.find((order) => order.id === shipment.orderId) || null,
        [shipment.orderId, orderOptions],
    );

    const selectedCourier = useMemo(
        () => getCourierConfig(shipment.courierId, courierOptions),
        [shipment.courierId, courierOptions],
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        const loadResources = async () => {
            setIsLoadingOrder(true);
            setSubmitError('');
            try {
                const [ordersResponse, couriersResponse] = await Promise.all([
                    axios.get(route('system.shipments.orders')),
                    axios.get(route('system.shipments.couriers')),
                ]);

                const nextOrders = (ordersResponse.data || []).map(mapOrderToOption);
                const nextCouriers = (couriersResponse.data || []).map(mapCourierToOption);

                setOrderOptions(nextOrders);
                setCourierOptions(nextCouriers);

                if (hasInitialOrder) {
                    const {
                        id: targetId,
                        orderType: targetType
                    } = parseInitialOrderProps(initialOrderId, initialOrderType);
                    const matchedOrder = findMatchingOrder(nextOrders, targetId, targetType);

                    if (matchedOrder) {
                        setValue('orderId', matchedOrder.id, {shouldValidate: true});
                        setValue('recipientName', matchedOrder.customer?.name || '', {shouldValidate: true});
                        setValue('recipientCompany', matchedOrder.customer?.company || '', {shouldValidate: true});
                        setValue('recipientStreet', matchedOrder.customer?.street || '', {shouldValidate: true});
                        setValue('recipientBuildingNumber', matchedOrder.customer?.buildingNumber || '', {shouldValidate: true});
                        setValue('recipientApartmentNumber', matchedOrder.customer?.apartmentNumber || '', {shouldValidate: true});
                        setValue('recipientPostalCode', matchedOrder.customer?.postalCode || '', {shouldValidate: true});
                        setValue('recipientCity', matchedOrder.customer?.city || '', {shouldValidate: true});
                        setValue('recipientCountry', matchedOrder.customer?.country || 'PL', {shouldValidate: true});
                        setValue('recipientPhone', matchedOrder.customer?.phone || '', {shouldValidate: true});
                        setValue('recipientEmail', matchedOrder.customer?.email || '', {shouldValidate: true});
                        setValue('useCod', Boolean(matchedOrder.isCod), {shouldValidate: true});
                        setValue('codValue', matchedOrder.isCod ? centsToCurrencyValue(matchedOrder.codValue ?? matchedOrder.totalGross ?? 0) : '', {shouldValidate: true});

                        const preferredCourierId = getPreferredCourierId(matchedOrder, nextCouriers);
                        setValue('courierId', preferredCourierId, {shouldValidate: true});

                        setActiveStep(1);
                    } else {
                        setSubmitError('Nie znaleziono wybranego zamówienia na liście zamówień do wysyłki.');
                    }
                } else {
                    const preferredCourierId = getPreferredCourierId(null, nextCouriers);
                    if (!shipment.courierId || !nextCouriers.some((courier) => String(courier.id) === String(shipment.courierId))) {
                        setValue('courierId', preferredCourierId, {shouldValidate: true});
                    }
                    setActiveStep(0);
                }
            } catch (error) {
                setSubmitError('Nie udało się pobrać danych z backendu dla zamówień i kurierów.');
            } finally {
                setIsLoadingOrder(false);
            }
        };

        loadResources();
    }, [open, initialOrderId, initialOrderType, hasInitialOrder, setValue]);

    useEffect(() => {
        if (!selectedCourier) {
            return;
        }

        if (!selectedCourier.supportsCOD && shipment.useCod) {
            setValue('useCod', false, {shouldValidate: true});
            setValue('codValue', '', {shouldValidate: true});
        }

        if (!selectedCourier.allowsMultiplePackages && (shipment.shipmentPackages || []).length > 1) {
            setValue('shipmentPackages', [(shipment.shipmentPackages || [])[0] || {
                id: Date.now(),
                weight: '',
                width: '',
                height: '',
                depth: '',
            }], {shouldValidate: true});
        }

        const validation = validateCourierPackageConstraints(selectedCourier, shipment.shipmentPackages);
        if (!validation.valid) {
            setError('shipmentPackages', {
                type: 'manual',
                message: validation.message,
            });
            return;
        }

        clearErrors('shipmentPackages');
    }, [selectedCourier, shipment.useCod, shipment.shipmentPackages, setValue, setError, clearErrors]);

    const isMissingRequiredPackageField = (index, field) => {
        if (!selectedCourier?.packageFields?.[field]?.required) {
            return false;
        }

        const pkg = (shipment.shipmentPackages || [])[index] || {};
        const value = pkg[field];

        return value === null || value === undefined || value === '' || String(value).trim() === '';
    };

    const updatePackage = (index, field, value) => {
        const nextPackages = [...(shipment.shipmentPackages || [])];
        nextPackages[index] = {
            ...nextPackages[index],
            [field]: value,
        };

        setValue('shipmentPackages', nextPackages, {shouldValidate: true});
    };

    const addPackage = () => {
        const nextPackages = [...(shipment.shipmentPackages || []), {
            id: Date.now(),
            weight: '',
            width: '',
            height: '',
            depth: '',
        }];

        setValue('shipmentPackages', nextPackages, {shouldValidate: true});
    };

    const removePackage = (index) => {
        if ((shipment.shipmentPackages || []).length === 1) {
            return;
        }

        const nextPackages = (shipment.shipmentPackages || []).filter((_, itemIndex) => itemIndex !== index);
        setValue('shipmentPackages', nextPackages, {shouldValidate: true});
    };

    const loadOrderData = async () => {
        const isValid = await trigger('orderId');
        if (!isValid) {
            return;
        }

        setSubmitError('');
        setIsLoadingOrder(true);

        try {
            await new Promise((resolve) => window.setTimeout(resolve, 600));

            const order = orderOptions.find((item) => item.id === shipment.orderId);
            if (!order) {
                throw new Error('Nie znaleziono zamówienia.');
            }

            setValue('recipientName', order.customer.name || '', {shouldValidate: true});
            setValue('recipientCompany', order.customer.company || '', {shouldValidate: true});
            setValue('recipientStreet', order.customer.street || '', {shouldValidate: true});
            setValue('recipientBuildingNumber', order.customer.buildingNumber || '', {shouldValidate: true});
            setValue('recipientApartmentNumber', order.customer.apartmentNumber || '', {shouldValidate: true});
            setValue('recipientPostalCode', order.customer.postalCode || '', {shouldValidate: true});
            setValue('recipientCity', order.customer.city || '', {shouldValidate: true});
            setValue('recipientCountry', order.customer.country || 'PL', {shouldValidate: true});
            setValue('recipientPhone', order.customer.phone || '', {shouldValidate: true});
            setValue('recipientEmail', order.customer.email || '', {shouldValidate: true});
            setValue('useCod', Boolean(order.isCod), {shouldValidate: true});
            setValue('codValue', order.isCod ? centsToCurrencyValue(order.codValue ?? order.totalGross ?? 0) : '', {shouldValidate: true});
            setValue('courierId', getPreferredCourierId(order, courierOptions), {shouldValidate: true});

            setActiveStep(1);
        } catch (error) {
            setSubmitError(error.message || 'Nie udało się pobrać danych zamówienia.');
        } finally {
            setIsLoadingOrder(false);
        }
    };

    const handlePrimaryAction = async () => {
        if (activeStep === 0) {
            await loadOrderData();
            return;
        }

        if (activeStep === 1) {
            const courierValidation = validateCourierPackageConstraints(selectedCourier, shipment.shipmentPackages);
            if (!courierValidation.valid) {
                setError('shipmentPackages', {
                    type: 'manual',
                    message: courierValidation.message,
                });
                setSubmitError(courierValidation.message);
                return;
            }

            setSubmitError('');
            clearErrors('shipmentPackages');

            const isValid = await trigger();
            if (!isValid) {
                return;
            }

            setActiveStep(2);
            return;
        }

        if (activeStep === 2) {
            const courierValidation = validateCourierPackageConstraints(selectedCourier, shipment.shipmentPackages);
            if (!courierValidation.valid) {
                setError('shipmentPackages', {
                    type: 'manual',
                    message: courierValidation.message,
                });
                setSubmitError(courierValidation.message);
                return;
            }

            const isValid = await trigger();
            if (!isValid) {
                return;
            }

            setSubmitError('');
            setIsSavingShipment(true);

            try {
                const [orderType, rawOrderId] = String(shipment.orderId || '').split(':');
                const payload = {
                    order_id: rawOrderId || shipment.orderId,
                    order_type: orderType,
                    courier_id: shipment.courierId,
                    recipient_country: shipment.recipientCountry || 'PL',
                    recipient_name: shipment.recipientName,
                    recipient_company: shipment.recipientCompany,
                    recipient_street: shipment.recipientStreet,
                    recipient_building_number: shipment.recipientBuildingNumber,
                    recipient_apartment_number: shipment.recipientApartmentNumber,
                    recipient_postal_code: shipment.recipientPostalCode,
                    recipient_city: shipment.recipientCity,
                    recipient_phone: shipment.recipientPhone,
                    recipient_email: shipment.recipientEmail,
                    recipient_point: null,
                    cod: Boolean(shipment.useCod),
                    cod_value: shipment.useCod ? currencyValueToCents(shipment.codValue) : 0,
                    package_count: (shipment.shipmentPackages || []).length,
                    shipment_packages: (shipment.shipmentPackages || []).map((pkg) => ({
                        weight: pkg.weight === '' ? null : pkg.weight,
                        width: pkg.width === '' ? null : pkg.width,
                        height: pkg.height === '' ? null : pkg.height,
                        depth: pkg.depth === '' ? null : pkg.depth,
                    })),
                };

                const shouldCreateShipment = !createdShipmentId && shipmentProgress.save !== 'done';
                let shipmentId = createdShipmentId;

                if (shouldCreateShipment) {
                    setShipmentProgress({save: 'loading', send: 'idle'});

                    const response = await axios.post(route('system.shipments.store'), payload);
                    const createdShipment = response.data?.shipment || {};
                    shipmentId = createdShipment.id ?? response.data?.id ?? null;

                    if (!shipmentId) {
                        throw new Error('Backend nie zwrócił identyfikatora przesyłki.');
                    }

                    setShipmentLocked(true);
                    setCreatedShipmentId(shipmentId);
                    setTrackingNumber(createdShipment.tracking_number || createdShipment.external_number || `PL${Math.floor(100000000 + Math.random() * 900000000)}`);
                    setShipmentProgress({save: 'done', send: 'idle'});
                }

                if (!shipmentId) {
                    throw new Error('Brak identyfikatora przesyłki do wysyłki do kuriera.');
                }

                setShipmentProgress((current) => ({...current, send: 'loading'}));

                const sendResponse = await axios.post(
                    route('system.shipments.send', {shipment: shipmentId}),
                    {
                        shipment_id: shipmentId,
                        courier_id: shipment.courierId,
                        order_id: rawOrderId || shipment.orderId,
                        order_type: orderType,
                    },
                );

                const nextTrackingNumber = sendResponse.data?.tracking_number || sendResponse.data?.shipment?.tracking_number || sendResponse.data?.shipment?.external_number || trackingNumber;
                setTrackingNumber(nextTrackingNumber || `PL${Math.floor(100000000 + Math.random() * 900000000)}`);
                setShipmentLocked(true);
                setShipmentProgress({save: 'done', send: 'done'});
                setActiveStep(3);
                handleGenerateLabelAndPackages(shipmentId);
            } catch (error) {
                const message = error?.response?.data?.message || error?.message || 'Nie udało się zapisać przesyłki. Spróbuj ponownie.';
                setSubmitError(message);
                showBackendErrors(error, message);
                setShipmentProgress((current) => ({
                    save: current.save === 'loading' ? 'error' : current.save,
                    send: current.send === 'loading' ? 'error' : current.send,
                }));
            } finally {
                setIsSavingShipment(false);
            }

            return;
        }

        if (activeStep === 3) {
            if (labelProgress.generate === 'error') {
                await handleGenerateLabelAndPackages(createdShipmentId);
            } else if (labelProgress.packages === 'error') {
                await handleFetchPackages(createdShipmentId);
            } else if (labelProgress.generate === 'done' && labelProgress.packages === 'done') {
                handleDownloadLabel();
            }
        }
    };

    const handleGenerateLabelAndPackages = async (shipmentId = createdShipmentId) => {
        const targetShipmentId = shipmentId || createdShipmentId;
        if (!targetShipmentId) {
            return;
        }

        setIsFetchingLabel(true);
        setSubmitError('');
        setLabelProgress((prev) => ({...prev, generate: 'loading'}));

        let labelSuccess = false;
        try {
            const response = await axios.post(
                route('system.shipments.label', {shipment: targetShipmentId}),
                {
                    shipment_id: targetShipmentId,
                    courier_id: shipment.courierId,
                },
            );

            const successMessage = response.data?.message || 'Etykieta została wygenerowana pomyślnie.';
            enqueueSnackbar(successMessage, {variant: 'success'});
            setLabelProgress((prev) => ({...prev, generate: 'done'}));
            labelSuccess = true;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Nie udało się wygenerować etykiety od kuriera.';
            setSubmitError(message);
            showBackendErrors(error, message);
            setLabelProgress((prev) => ({...prev, generate: 'error'}));
            setIsFetchingLabel(false);
            return;
        }

        if (labelSuccess) {
            await handleFetchPackages(targetShipmentId);
        }
    };

    const handleFetchPackages = async (shipmentId = createdShipmentId) => {
        const targetShipmentId = shipmentId || createdShipmentId;
        if (!targetShipmentId) {
            return;
        }

        setIsFetchingLabel(true);
        setSubmitError('');
        setLabelProgress((prev) => ({...prev, packages: 'loading'}));

        try {
            const response = await axios.post(
                route('system.shipments.packages', {shipment: targetShipmentId}),
            );

            const packages = response.data?.shipment?.packages || [];
            if (packages.length > 0) {
                setShipmentPackagesData(packages);
            }

            const successMessage = response.data?.message || 'Numery przesyłek zostały pomyślnie pobrane.';
            enqueueSnackbar(successMessage, {variant: 'success'});
            setLabelReady(true);
            setLabelProgress((prev) => ({...prev, packages: 'done'}));
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Nie udało się pobrać numerów paczek.';
            setSubmitError(message);
            showBackendErrors(error, message);
            setLabelProgress((prev) => ({...prev, packages: 'error'}));
        } finally {
            setIsFetchingLabel(false);
        }
    };

    const handleDownloadLabel = () => {
        if (!createdShipmentId) {
            return;
        }
        const downloadUrl = route('system.shipments.label.download', {shipment: createdShipmentId});
        window.open(downloadUrl, '_blank');
        setLabelDownloaded(true);
        setShipmentLocked(false);
        setLabelProgress((prev) => ({...prev, download: 'done'}));
        enqueueSnackbar('Pobieranie etykiety kurierskiej...', {variant: 'info'});
    };

    useEffect(() => {
        if (activeStep === 3 && createdShipmentId && labelProgress.generate === 'idle' && !isFetchingLabel) {
            handleGenerateLabelAndPackages(createdShipmentId);
        }
    }, [activeStep, createdShipmentId]);

    const showBackendErrors = (error, fallbackMessage = 'Wystąpił błąd.') => {
        const responseErrors = error?.response?.data?.errors;
        const responseMessage = error?.response?.data?.message;

        if (responseErrors && typeof responseErrors === 'object') {
            Object.values(responseErrors).forEach((messages) => {
                const list = Array.isArray(messages) ? messages : [messages];
                list.forEach((message) => enqueueSnackbar(message, {variant: 'error'}));
            });

            return;
        }

        if (responseMessage) {
            enqueueSnackbar(responseMessage, {variant: 'error'});
            return;
        }

        enqueueSnackbar(fallbackMessage, {variant: 'error'});
    };

    const previousStep = () => {
        const minStep = hasInitialOrder ? 1 : 0;
        if (activeStep <= minStep || shipmentLocked) {
            return;
        }

        if (activeStep >= 3 || isSavingShipment || shipmentProgress.save === 'loading' || shipmentProgress.send === 'loading') {
            return;
        }

        setSubmitError('');
        setActiveStep((currentStep) => currentStep - 1);
    };

    const resetDialog = () => {
        clearErrors();
        reset(defaultShipmentForm);
        setActiveStep(0);
        setSubmitError('');
        setTrackingNumber('');
        setCreatedShipmentId(null);
        setLabelReady(false);
        setLabelDownloaded(false);
        setShipmentLocked(false);
        setIsSavingShipment(false);
        setIsFetchingLabel(false);
        setShipmentPackagesData([]);
        setShipmentProgress({save: 'idle', send: 'idle'});
        setLabelProgress({generate: 'idle', packages: 'idle', download: 'idle'});
    };

    const isLocked = (shipmentLocked && !labelDownloaded) || isSavingShipment || isFetchingLabel || shipmentProgress.save === 'loading' || shipmentProgress.send === 'loading' || labelProgress.generate === 'loading' || labelProgress.packages === 'loading';

    const handleClose = (event, reason) => {
        if (isLocked) {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                return;
            }
            return;
        }

        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
            maxWidth="xl"
            fullWidth
            PaperProps={{sx: {minHeight: '90vh'}}}
        >
            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Utwórz przesyłkę
            </DialogTitle>

            <DialogContent>
                <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 3}}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === 0 && (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Autocomplete
                            disablePortal
                            options={orderOptions}
                            value={selectedOrder}
                            onChange={(_, value) => {
                                setValue('orderId', value?.id || '', {shouldValidate: true});
                            }}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}
                                     sx={{
                                         py: 1.2
                                     }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                    }}>
                                        <Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 2
                                                }}
                                            >
                                                <Typography variant="body2" sx={{fontWeight: 700}}>
                                                    {option.label}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {option.createdAt ? `Data: ${new Date(option.createdAt).toLocaleDateString('pl-PL')}` : 'Data: brak'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Wartość {option.totalNet ? `${centsToCurrencyValue(option.totalNet)} zł netto` : 'brak netto'} ({option.totalGross ? `${centsToCurrencyValue(option.totalGross)} zł brutto` : 'brak brutto'})
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            my: 1,
                                        }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.customer?.company || option.customer?.name || 'Brak firmy'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.customer?.street || ''} {option.customer?.buildingNumber || ''}
                                                {option.customer?.apartmentNumber ? `/${option.customer.apartmentNumber}` : ''}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.customer?.postalCode || ''} {option.customer?.city || ''}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Kurier {courierOptions.find((courier) => courier.id == option.courierId)?.name || 'brak'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Pobranie: {option.isCod ? `Tak (${centsToCurrencyValue(option.codValue)} zł)` : ' Nie'}
                                            </Typography>
                                        </Box>


                                    </Box>

                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Wybór zamówienia"
                                    error={Boolean(errors.orderId)}
                                    helperText={errors.orderId?.message}
                                />
                            )}
                        />

                        {selectedOrder && (
                            <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1}}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    <Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 2
                                            }}
                                        >
                                            <Typography variant="body2" sx={{fontWeight: 700}}>
                                                {selectedOrder.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedOrder.createdAt ? `Data: ${new Date(selectedOrder.createdAt).toLocaleDateString('pl-PL')}` : 'Data: brak'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Wartość {selectedOrder.totalNet ? `${centsToCurrencyValue(selectedOrder.totalNet)} zł netto` : 'brak netto'} ({selectedOrder.totalGross ? `${centsToCurrencyValue(selectedOrder.totalGross)} zł brutto` : 'brak brutto'})
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        my: 1,
                                    }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {selectedOrder.customer?.company || selectedOrder.customer?.name || 'Brak firmy'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {selectedOrder.customer?.street || ''} {selectedOrder.customer?.buildingNumber || ''}
                                            {selectedOrder.customer?.apartmentNumber ? `/${selectedOrder.customer.apartmentNumber}` : ''}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {selectedOrder.customer?.postalCode || ''} {selectedOrder.customer?.city || ''}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Kurier {courierOptions.find((courier) => courier.id == selectedOrder.courierId)?.name || 'brak'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Pobranie: {selectedOrder.isCod ? `Tak (${centsToCurrencyValue(selectedOrder.codValue)} zł)` : ' Nie'}
                                        </Typography>
                                    </Box>

                                </Box>

                            </Box>

                        )}

                        {isLoadingOrder && (
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                                <CircularProgress size={18}/>
                                <Typography variant="body2">Pobieram dane z bazy danych...</Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', lg: '0.9fr 1.3fr'},
                        gap: 2,
                        alignItems: 'flex-start'
                    }}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                            <TextField
                                select
                                label="Kurier"
                                value={shipment.courierId}
                                onChange={(event) => setValue('courierId', event.target.value, {shouldValidate: true})}
                                error={Boolean(errors.courierId)}
                                helperText={errors.courierId?.message}
                                SelectProps={{
                                    renderValue: (selected) => {
                                        const option = courierOptions.find((courier) => courier.id === selected);
                                        if (!option) {
                                            return null;
                                        }

                                        return (
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 1,
                                                        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                                        color: '#fff',
                                                        fontWeight: 700,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {option.logo}
                                                </Box>
                                                <Typography variant="body2"
                                                            sx={{fontWeight: 600}}>{option.name}</Typography>
                                            </Box>
                                        );
                                    },
                                }}
                            >
                                {courierOptions.map((courier) => (
                                    <MenuItem key={courier.id} value={courier.id}>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 140}}>
                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 1,
                                                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 12,
                                                }}
                                            >
                                                {courier.logo}
                                            </Box>
                                            <Typography variant="body2">{courier.name}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                                gap: 1.5,
                                marginY: 4
                            }}>
                                <TextField
                                    label="Nazwa 1"
                                    {...register('recipientCompany')}
                                    value={shipment.recipientCompany}
                                    onChange={(event) => setValue('recipientCompany', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientCompany)}
                                    helperText={errors.recipientCompany?.message}
                                    sx={{gridColumn: 'span 12'}}
                                />
                                <TextField
                                    label="Nazwa 2"
                                    {...register('recipientName')}
                                    value={shipment.recipientName}
                                    onChange={(event) => setValue('recipientName', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientName)}
                                    helperText={errors.recipientName?.message}
                                    sx={{gridColumn: 'span 12'}}
                                />

                                <TextField
                                    label="Ulica"
                                    {...register('recipientStreet')}
                                    value={shipment.recipientStreet}
                                    onChange={(event) => setValue('recipientStreet', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientStreet)}
                                    helperText={errors.recipientStreet?.message}
                                    sx={{gridColumn: 'span 6'}}
                                />

                                <TextField
                                    label="Nr domu"
                                    {...register('recipientBuildingNumber')}
                                    value={shipment.recipientBuildingNumber}
                                    onChange={(event) => setValue('recipientBuildingNumber', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientBuildingNumber)}
                                    helperText={errors.recipientBuildingNumber?.message}
                                    sx={{gridColumn: 'span 3'}}
                                />
                                <TextField
                                    label="Nr lokalu"
                                    {...register('recipientApartmentNumber')}
                                    value={shipment.recipientApartmentNumber}
                                    onChange={(event) => setValue('recipientApartmentNumber', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientApartmentNumber)}
                                    helperText={errors.recipientApartmentNumber?.message}
                                    sx={{gridColumn: 'span 3'}}
                                />

                                <TextField
                                    label="Kod pocztowy"
                                    {...register('recipientPostalCode')}
                                    value={shipment.recipientPostalCode}
                                    onChange={(event) => setValue('recipientPostalCode', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientPostalCode)}
                                    helperText={errors.recipientPostalCode?.message}
                                    sx={{gridColumn: 'span 3'}}
                                />
                                <TextField
                                    label="Miasto"
                                    {...register('recipientCity')}
                                    value={shipment.recipientCity}
                                    onChange={(event) => setValue('recipientCity', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientCity)}
                                    helperText={errors.recipientCity?.message}
                                    sx={{gridColumn: 'span 6'}}
                                />
                                <TextField
                                    label="Kraj"
                                    {...register('recipientCountry')}
                                    value={shipment.recipientCountry || 'PL'}
                                    onChange={(event) => setValue('recipientCountry', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientCountry)}
                                    helperText={errors.recipientCountry?.message}
                                    sx={{gridColumn: 'span 3'}}
                                />

                                <TextField
                                    label="E-mail"
                                    {...register('recipientEmail')}
                                    value={shipment.recipientEmail}
                                    onChange={(event) => setValue('recipientEmail', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientEmail)}
                                    helperText={errors.recipientEmail?.message}
                                    sx={{gridColumn: 'span 8'}}
                                />
                                <TextField
                                    label="Telefon"
                                    {...register('recipientPhone')}
                                    value={shipment.recipientPhone}
                                    onChange={(event) => setValue('recipientPhone', event.target.value, {shouldValidate: true})}
                                    error={Boolean(errors.recipientPhone)}
                                    helperText={errors.recipientPhone?.message}
                                    sx={{gridColumn: 'span 4'}}
                                />
                            </Box>
                            <Box sx={{
                                p: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                background: shipment.useCod ? theme.palette.info.main + '55' : '',
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={Boolean(shipment.useCod)}
                                                disabled={!selectedCourier?.supportsCOD}
                                                onChange={(event) => {
                                                    setValue('useCod', event.target.checked, {shouldValidate: true});
                                                    if (!event.target.checked) {
                                                        setValue('codValue', '', {shouldValidate: true});
                                                    }
                                                }}
                                            />
                                        }
                                        label="Usługa pobrania"
                                        sx={{mr: 0}}
                                    />

                                    <TextField
                                        type="text"
                                        label="Kwota pobrania"
                                        value={shipment.codValue}
                                        disabled={!selectedCourier?.supportsCOD || !shipment.useCod}
                                        onChange={(event) => {
                                            const nextValue = formatCodValue(event.target.value);
                                            setValue('codValue', nextValue, {shouldValidate: true});
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                                        }}
                                        error={Boolean(errors.codValue)}
                                        helperText={errors.codValue?.message}
                                        sx={{minWidth: 170}}
                                    />
                                </Box>

                                {!selectedCourier?.supportsCOD && (
                                    <Typography variant="caption" color="text.secondary">
                                        Ten kurier nie obsługuje usługi pobrania.
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>


                            <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1}}>
                                <Typography variant="subtitle2" sx={{mb: 1.5}}>
                                    Paczki
                                </Typography>

                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                                    {(shipment.shipmentPackages || []).map((pkg, index) => {
                                        const packageFields = selectedCourier?.packageFields || {
                                            weight: {enabled: true, required: true},
                                            width: {enabled: true, required: false},
                                            height: {enabled: true, required: false},
                                            depth: {enabled: true, required: false},
                                        };

                                        return (
                                            <Box key={pkg.id ?? index} sx={{
                                                p: 1.5,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1,
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1
                                                }}>
                                                    <Typography variant="subtitle2"
                                                                sx={{fontSize: 13}}>Paczka {index + 1}</Typography>
                                                    {(shipment.shipmentPackages || []).length > 1 && (
                                                        <Button color="error" variant="text" size="small"
                                                                onClick={() => removePackage(index)}>
                                                            Usuń
                                                        </Button>
                                                    )}
                                                </Box>

                                                <Box sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'auto 1fr',
                                                    gap: 8
                                                }}>
                                                    <TextField
                                                        size="small"
                                                        label="Waga [kg]"
                                                        type="number"
                                                        value={pkg.weight}
                                                        InputProps={{
                                                            inputProps: {
                                                                min: 0.1,
                                                                step: 0.1,
                                                            }
                                                        }}
                                                        disabled={!packageFields.weight?.enabled}
                                                        required={packageFields.weight?.required}
                                                        error={isMissingRequiredPackageField(index, 'weight')}
                                                        onChange={(event) => updatePackage(index, 'weight', event.target.value)}
                                                        sx={{gridColumn: 'span 1'}}
                                                    />
                                                    <Box sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                                        gap: 2
                                                    }}>
                                                        <TextField
                                                            size="small"
                                                            label="Szer. [cm]"
                                                            type="number"
                                                            value={pkg.width}
                                                            InputProps={{
                                                                inputProps: {
                                                                    min: 5,
                                                                    step: 1,
                                                                }
                                                            }}
                                                            disabled={!packageFields.width?.enabled}
                                                            required={packageFields.width?.required}
                                                            error={isMissingRequiredPackageField(index, 'width')}
                                                            onChange={(event) => updatePackage(index, 'width', event.target.value)}
                                                            sx={{gridColumn: 'span 1'}}
                                                        />
                                                        <TextField
                                                            size="small"
                                                            label="Wys. [cm]"
                                                            type="number"
                                                            value={pkg.height}
                                                            InputProps={{
                                                                inputProps: {
                                                                    min: 5,
                                                                    step: 1,
                                                                }
                                                            }}
                                                            disabled={!packageFields.height?.enabled}
                                                            required={packageFields.height?.required}
                                                            error={isMissingRequiredPackageField(index, 'height')}
                                                            onChange={(event) => updatePackage(index, 'height', event.target.value)}
                                                            sx={{gridColumn: 'span 1'}}
                                                        />
                                                        <TextField
                                                            size="small"
                                                            label="Gł. [cm]"
                                                            type="number"
                                                            value={pkg.depth}
                                                            InputProps={{
                                                                inputProps: {
                                                                    min: 5,
                                                                    step: 1,
                                                                }
                                                            }}
                                                            disabled={!packageFields.depth?.enabled}
                                                            required={packageFields.depth?.required}
                                                            error={isMissingRequiredPackageField(index, 'depth')}
                                                            onChange={(event) => updatePackage(index, 'depth', event.target.value)}
                                                            sx={{gridColumn: 'span 1'}}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={addPackage}
                                        disabled={!selectedCourier?.allowsMultiplePackages && (shipment.shipmentPackages || []).length >= 1}
                                    >
                                        + Dodaj paczkę
                                    </Button>
                                </Box>

                            </Box>
                        </Box>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box>
                        <Typography variant="h5" sx={{mb: 2}}>Podsumowanie</Typography>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {xs: '1fr', lg: '1fr 300px'},
                            gap: 2,
                            alignItems: 'flex-start'
                        }}>

                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                <Typography variant="body1" sx={{m: 0}}>Szczegóły zamówienia</Typography>
                                <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1}}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                    }}>
                                        <Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 2
                                                }}
                                            >
                                                <Typography variant="body2" sx={{fontWeight: 700}}>
                                                    {selectedOrder.label}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {selectedOrder.createdAt ? `Data: ${new Date(selectedOrder.createdAt).toLocaleDateString('pl-PL')}` : 'Data: brak'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Wartość {selectedOrder.totalNet ? `${centsToCurrencyValue(selectedOrder.totalNet)} zł netto` : 'brak netto'} ({selectedOrder.totalGross ? `${centsToCurrencyValue(selectedOrder.totalGross)} zł brutto` : 'brak brutto'})
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            my: 1,
                                        }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedOrder.customer?.company || selectedOrder.customer?.name || 'Brak firmy'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedOrder.customer?.street || ''} {selectedOrder.customer?.buildingNumber || ''}
                                                {selectedOrder.customer?.apartmentNumber ? `/${selectedOrder.customer.apartmentNumber}` : ''}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedOrder.customer?.postalCode || ''} {selectedOrder.customer?.city || ''}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Kurier {courierOptions.find((courier) => courier.id == selectedOrder.courierId)?.name || 'brak'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Pobranie: {selectedOrder.isCod ? `Tak (${centsToCurrencyValue(selectedOrder.codValue)} zł)` : ' Nie'}
                                            </Typography>
                                        </Box>

                                    </Box>

                                </Box>

                                <Typography variant="body1" sx={{m: 0}}>Szczegóły dostawy</Typography>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {xs: '1fr', lg: '1fr 2fr 1fr'},
                                    gap: 2,
                                    alignItems: 'flex-start'
                                }}>
                                    <Box sx={{
                                        borderRadius: 1,
                                        border: '1px solid #e0e0e0',
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        height: 1,
                                    }}>
                                        <Box
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 1,
                                                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                                color: '#fff',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                            }}
                                        >
                                            {courierOptions.find(courier => courier.id == shipment.courierId)?.logo}
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{fontWeight: 600}}
                                        >
                                            {courierOptions.find(courier => courier.id == shipment.courierId)?.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1}}>
                                        <Typography variant="body2">
                                            {shipment.recipientName || '-'}
                                        </Typography>
                                        <Typography variant="body2">
                                            {shipment.recipientCompany || '-'}
                                        </Typography>
                                        <Typography variant="body2">
                                            {shipment.recipientStreet || '-'} {shipment.recipientBuildingNumber || ''} {shipment.recipientPostalCode ? `/${shipment.recipientPostalCode}` : ''}
                                        </Typography>
                                        <Typography variant="body2">
                                            {shipment.recipientPostalCode || ''} {shipment.recipientCity || ''}
                                        </Typography>
                                        <Typography variant="body2">
                                            {shipment.recipientEmail || '-'}, {shipment.recipientPhone || ''}
                                        </Typography>
                                    </Box>
                                    {shipment.useCod && (
                                        <Box sx={{
                                            borderRadius: 1,
                                            border: '1px solid #e0e0e0',
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            height: 1
                                        }}>
                                            <Typography
                                                variant="body2"
                                            >
                                                Pobranie:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{fontWeight: 600}}
                                            > {shipment.codValue || 0} zł
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>


                                <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1}}>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        Ilość paczek:{(shipment.shipmentPackages || []).length}
                                    </Typography>
                                    <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                                        {(shipment.shipmentPackages || []).map((pkg, index) => (
                                            <Box key={index}
                                                 sx={{
                                                     p: 1,
                                                     border: '1px solid #e0e0e0',
                                                     borderRadius: 1,
                                                     mb: 1,
                                                     maxWidth: 180,
                                                 }}>
                                                <Typography variant="body2">
                                                    <strong>Paczka {index + 1}:</strong>
                                                </Typography>
                                                <Typography variant="body2">
                                                    Waga: {pkg.weight || '-'} kg
                                                </Typography>
                                                <Typography variant="body2">
                                                    Wymiary: {pkg.width || '-'} x {pkg.height || '-'} x {pkg.depth || '-'} cm
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2,}}>
                                <Typography variant="body1" sx={{m: 0}}>Akcje</Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>Zapisywanie
                                        przesyłki</Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        {shipmentProgress.save === 'loading' && <CircularProgress size={18}/>}
                                        {shipmentProgress.save === 'done' &&
                                            <Done sx={{fontSize: 18, color: '#2e7d32'}}/>}
                                        {shipmentProgress.save === 'error' &&
                                            <Error sx={{fontSize: 18, color: '#d32f2f'}}/>}
                                        {shipmentProgress.save === 'idle' && <Box sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: '1px solid #bdbdbd'
                                        }}/>}
                                    </Box>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>Zapisywanie paczek</Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        {shipmentProgress.save === 'loading' && <CircularProgress size={18}/>}
                                        {shipmentProgress.save === 'done' &&
                                            <Done sx={{fontSize: 18, color: '#2e7d32'}}/>}
                                        {shipmentProgress.save === 'error' &&
                                            <Error sx={{fontSize: 18, color: '#d32f2f'}}/>}
                                        {shipmentProgress.save === 'idle' && <Box sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: '1px solid #bdbdbd'
                                        }}/>}
                                    </Box>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>Wysyłanie informacji do firmy
                                        kurierskiej</Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        {shipmentProgress.send === 'loading' && <CircularProgress size={18}/>}
                                        {shipmentProgress.send === 'done' &&
                                            <Done sx={{fontSize: 18, color: '#2e7d32'}}/>}
                                        {shipmentProgress.send === 'error' &&
                                            <Error sx={{fontSize: 18, color: '#d32f2f'}}/>}
                                        {shipmentProgress.send === 'idle' && <Box sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: '1px solid #bdbdbd'
                                        }}/>}
                                    </Box>
                                </Box>
                            </Box>

                        </Box>
                    </Box>


                )}

                {activeStep === 3 && (
                    <Box>
                        <Typography variant="h5" sx={{mb: 2}}>Generowanie i pobieranie etykiety</Typography>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {xs: '1fr', lg: '1fr 320px'},
                            gap: 2,
                            alignItems: 'flex-start'
                        }}>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                <Typography variant="body1" sx={{m: 0}}>Szczegóły nadanej przesyłki</Typography>
                                <Box sx={{p: 2, border: '1px solid #e0e0e0', borderRadius: 1}}>
                                    <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 1.5}}>
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 1,
                                                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                                color: '#fff',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 13,
                                            }}
                                        >
                                            {courierOptions.find(courier => String(courier.id) === String(shipment.courierId))?.logo}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{fontWeight: 700}}>
                                                Kurier: {courierOptions.find(courier => String(courier.id) === String(shipment.courierId))?.name || '-'}
                                            </Typography>
                                            {trackingNumber && (
                                                <Typography variant="caption" color="text.secondary"
                                                            sx={{display: 'block'}}>
                                                    Numer przesyłki: <strong>{trackingNumber}</strong>
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{my: 1}}>
                                        <Typography variant="caption" color="text.secondary" sx={{display: 'block'}}>
                                            Odbiorca: {shipment.recipientName || '-'} ({shipment.recipientCompany || '-'})
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{display: 'block'}}>
                                            Adres: {shipment.recipientStreet || '-'} {shipment.recipientBuildingNumber || ''} {shipment.recipientApartmentNumber ? `/${shipment.recipientApartmentNumber}` : ''}, {shipment.recipientPostalCode || ''} {shipment.recipientCity || ''}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{display: 'block'}}>
                                            Kontakt: {shipment.recipientPhone || '-'} | {shipment.recipientEmail || '-'}
                                        </Typography>
                                        {shipment.useCod && (
                                            <Typography variant="caption" color="text.secondary"
                                                        sx={{display: 'block', fontWeight: 600}}>
                                                Pobranie: {shipment.codValue || 0} zł
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary" sx={{display: 'block'}}>
                                            Liczba paczek: {(shipment.shipmentPackages || []).length}
                                        </Typography>
                                    </Box>

                                    {shipmentPackagesData && shipmentPackagesData.length > 0 && (
                                        <Box sx={{mt: 1.5, pt: 1.5, borderTop: '1px dashed #e0e0e0'}}>
                                            <Typography variant="caption"
                                                        sx={{fontWeight: 700, display: 'block', mb: 0.5}}>
                                                Numery nadawcze paczek:
                                            </Typography>
                                            {shipmentPackagesData.map((pkg, index) => (
                                                <Typography key={pkg.id || index} variant="caption"
                                                            color="text.secondary" sx={{display: 'block'}}>
                                                    Paczka {index + 1}: <strong>{pkg.external_number || 'Brak'}</strong> ({pkg.weight} kg)
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                {submitError && (labelProgress.generate === 'error' || labelProgress.packages === 'error') && (
                                    <Alert severity="error">
                                        {submitError}
                                    </Alert>
                                )}

                                {(labelReady || labelDownloaded) && (
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 3,
                                        borderRadius: 2,
                                        border: '1px solid #c8e6c9',
                                        backgroundColor: '#f1f8e9',
                                        textAlign: 'center',
                                        animation: 'fadeInScale 0.5s ease-in-out',
                                        '@keyframes fadeInScale': {
                                            '0%': {
                                                opacity: 0,
                                                transform: 'scale(0.85)',
                                            },
                                            '50%': {
                                                transform: 'scale(1.03)',
                                            },
                                            '100%': {
                                                opacity: 1,
                                                transform: 'scale(1)',
                                            },
                                        },
                                    }}>
                                        <Box sx={{
                                            width: 68,
                                            height: 68,
                                            borderRadius: '50%',
                                            backgroundColor: '#2e7d32',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 0 0 8px rgba(46, 125, 50, 0.2)',
                                            animation: 'pulseGreen 2s infinite',
                                            '@keyframes pulseGreen': {
                                                '0%': {
                                                    boxShadow: '0 0 0 0 rgba(46, 125, 50, 0.4)',
                                                },
                                                '70%': {
                                                    boxShadow: '0 0 0 18px rgba(46, 125, 50, 0)',
                                                },
                                                '100%': {
                                                    boxShadow: '0 0 0 0 rgba(46, 125, 50, 0)',
                                                },
                                            },
                                            mb: 2,
                                        }}>
                                            <Done sx={{fontSize: 44}}/>
                                        </Box>
                                        <Typography variant="h6" sx={{fontWeight: 700, color: '#1b5e20', mb: 0.5}}>
                                            {labelDownloaded ? 'Przesyłka została w pełni zrealizowana!' : 'Etykieta gotowa do pobrania!'}
                                        </Typography>
                                        <Typography variant="body2" sx={{color: '#2e7d32', mb: 2}}>
                                            {labelDownloaded
                                                ? 'Etykieta została pobrana. Możesz zamknąć okno lub nadać kolejną paczkę.'
                                                : 'Kliknij przycisk poniżej, aby pobrać etykietę kurierską w nowej karcie.'}
                                        </Typography>
                                        <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center'}}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleDownloadLabel}
                                                startIcon={<Download/>}
                                                size="medium"
                                            >
                                                {labelDownloaded ? 'Pobierz etykietę ponownie' : 'Pobierz etykietę'}
                                            </Button>
                                            {labelDownloaded && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={resetDialog}
                                                    startIcon={<AddCircleOutline/>}
                                                    size="medium"
                                                >
                                                    Nadaj kolejną paczkę
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                <Typography variant="body1" sx={{m: 0}}>Akcje</Typography>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>
                                        Generowanie etykiety kurierskiej
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        {labelProgress.generate === 'loading' && <CircularProgress size={18}/>}
                                        {labelProgress.generate === 'done' &&
                                            <Done sx={{fontSize: 18, color: '#2e7d32'}}/>}
                                        {labelProgress.generate === 'error' &&
                                            <Error sx={{fontSize: 18, color: '#d32f2f'}}/>}
                                        {labelProgress.generate === 'idle' && <Box sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: '1px solid #bdbdbd'
                                        }}/>}
                                    </Box>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>
                                        Pobieranie numerów paczek
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        {labelProgress.packages === 'loading' && <CircularProgress size={18}/>}
                                        {labelProgress.packages === 'done' &&
                                            <Done sx={{fontSize: 18, color: '#2e7d32'}}/>}
                                        {labelProgress.packages === 'error' &&
                                            <Error sx={{fontSize: 18, color: '#d32f2f'}}/>}
                                        {labelProgress.packages === 'idle' && <Box sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: '1px solid #bdbdbd'
                                        }}/>}
                                    </Box>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body2" sx={{fontWeight: 600}}>
                                        Pobieranie etykiety kurierskiej
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        {labelProgress.download === 'loading' && <CircularProgress size={18}/>}
                                        {labelProgress.download === 'done' &&
                                            <Done sx={{fontSize: 18, color: '#2e7d32'}}/>}
                                        {labelProgress.download === 'idle' && <Box sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: '1px solid #bdbdbd'
                                        }}/>}
                                    </Box>
                                </Box>

                                {labelProgress.generate === 'error' && (
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => handleGenerateLabelAndPackages(createdShipmentId)}
                                        disabled={isFetchingLabel}
                                        startIcon={<Refresh/>}
                                        fullWidth
                                    >
                                        Ponów próbę generowania etykiety
                                    </Button>
                                )}

                                {labelProgress.generate === 'done' && labelProgress.packages === 'error' && (
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => handleFetchPackages(createdShipmentId)}
                                        disabled={isFetchingLabel}
                                        startIcon={<Refresh/>}
                                        fullWidth
                                    >
                                        Ponów pobieranie numerów paczek
                                    </Button>
                                )}

                                {labelProgress.generate === 'done' && labelProgress.packages === 'done' && !labelDownloaded && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleDownloadLabel}
                                        startIcon={<Download/>}
                                        fullWidth
                                    >
                                        Pobierz etykietę
                                    </Button>
                                )}

                                {labelDownloaded && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={resetDialog}
                                        startIcon={<AddCircleOutline/>}
                                        fullWidth
                                    >
                                        Nadaj kolejną paczkę
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{px: 3, pb: 2, pt: 1}}>
                <Button
                    onClick={() => {
                        if (labelDownloaded) {
                            resetDialog();
                        }
                        setOpen(false);
                    }}
                    disabled={isLocked}
                >
                    Zamknij
                </Button>

                <Button
                    onClick={previousStep}
                    disabled={activeStep <= (hasInitialOrder ? 1 : 0) || isLoadingOrder || isSavingShipment || isFetchingLabel || isLocked || activeStep >= 3}
                >
                    Wstecz
                </Button>

                {activeStep < 3 && (
                    <Button
                        variant="contained"
                        onClick={handlePrimaryAction}
                        disabled={isLoadingOrder || isSavingShipment || isFetchingLabel}
                    >
                        {activeStep === 0 && 'Wybierz tę przesyłkę'}
                        {activeStep === 1 && 'Dalej'}
                        {activeStep === 2 && 'Zapisz'}
                    </Button>
                )}

                {activeStep === 3 && labelProgress.generate === 'error' && (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleGenerateLabel(createdShipmentId)}
                        disabled={isFetchingLabel}
                        startIcon={<Refresh/>}
                    >
                        Ponów generowanie etykiety
                    </Button>
                )}

                {activeStep === 3 && labelProgress.generate === 'done' && !labelDownloaded && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadLabel}
                        startIcon={<Download/>}
                    >
                        Pobierz etykietę
                    </Button>
                )}

                {activeStep === 3 && labelDownloaded && (
                    <>
                        <Button
                            variant="outlined"
                            onClick={handleDownloadLabel}
                            startIcon={<Download/>}
                        >
                            Pobierz etykietę
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={resetDialog}
                            startIcon={<AddCircleOutline/>}
                        >
                            Nadaj kolejną paczkę
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}


