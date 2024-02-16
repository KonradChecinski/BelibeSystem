import * as yup from 'yup'

const schema = yup.object().shape({
    country: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        }),
    city: yup
        .string()
        .required("Pole jest wymagane"),
    street: yup
        .string()
        .required("Pole jest wymagane"),
    building_number: yup
        .string()
        .required("Pole jest wymagane"),
    apartment_number: yup
        .string(),
    postal_code: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie 00-000"),
    note: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
