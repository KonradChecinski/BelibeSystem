import * as yup from 'yup'

const createPackage = (id = 1) => ({
    id,
    weight: '',
    width: '',
    height: '',
    depth: '',
})

const packageSchema = yup.object().shape({
    id: yup.number().nullable(),
    weight: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (
            originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
                ? null
                : Number(originalValue)
        )),
    width: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (
            originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
                ? null
                : Number(originalValue)
        )),
    height: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (
            originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
                ? null
                : Number(originalValue)
        )),
    depth: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (
            originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
                ? null
                : Number(originalValue)
        )),
})

const schema = yup.object().shape({
    orderId: yup
        .string()
        .required('Wybierz zamówienie'),
    courierId: yup
        .string()
        .required('Wybierz kuriera'),
    recipientName: yup
        .string()
        .max(40, 'Maksymalna długość 40 znaków')
        .required('Pole jest wymagane'),
    recipientCompany: yup
        .string()
        .max(40, 'Maksymalna długość 40 znaków')
        .nullable(),
    recipientStreet: yup
        .string()
        .max(40, 'Maksymalna długość 40 znaków')
        .required('Pole jest wymagane'),
    recipientBuildingNumber: yup
        .string()
        .max(10, 'Maksymalna długość 10 znaków')
        .required('Pole jest wymagane'),
    recipientApartmentNumber: yup
        .string()
        .max(10, 'Maksymalna długość 10 znaków')
        .nullable(),
    recipientPostalCode: yup
        .string()
        .max(16, 'Maksymalna długość 16 znaków')
        .required('Pole jest wymagane'),
    recipientCity: yup
        .string()
        .max(30, 'Maksymalna długość 30 znaków')
        .required('Pole jest wymagane'),
    recipientCountry: yup
        .string()
        .max(2, 'Maksymalna długość 2 znaków')
        .required('Pole jest wymagane'),
    recipientPhone: yup
        .string()
        .matches(/^\+?\d{9,15}$/, 'Niepoprawny numer telefonu')
        .max(20, 'Maksymalna długość 20 znaków')
        .required('Pole jest wymagane'),
    recipientEmail: yup
        .string()
        .email('Niepoprawny adres e-mail')
        .max(80, 'Maksymalna długość 80 znaków')
        .required('Pole jest wymagane'),
    useCod: yup.boolean(),
    codValue: yup
        .string()
        .nullable()
        .when('useCod', {
            is: true,
            then: (schema) => schema
                .required('Pole jest wymagane')
                .matches(/^(\d+([,.]\d{1,2})?)$/, 'Kwota musi być w formacie 0,00')
                .test('is-positive-or-zero', 'Kwota nie może być ujemna', (value) => {
                    if (!value) {
                        return false;
                    }

                    return Number(value.toString().replace(',', '.')) >= 0;
                }),
            otherwise: (schema) => schema.nullable(),
        }),
    shipmentPackages: yup
        .array()
        .of(packageSchema)
        .min(1, 'Dodaj przynajmniej jedną paczkę')
        .required('Dodaj przynajmniej jedną paczkę'),
})

export {schema, createPackage}

export const defaultShipmentForm = {
    orderId: '',
    courierId: '',
    recipientName: '',
    recipientCompany: '',
    recipientStreet: '',
    recipientBuildingNumber: '',
    recipientApartmentNumber: '',
    recipientPostalCode: '',
    recipientCity: '',
    recipientCountry: 'PL',
    recipientPhone: '',
    recipientEmail: '',
    useCod: false,
    codValue: '',
    shipmentPackages: [createPackage(1)],
}
