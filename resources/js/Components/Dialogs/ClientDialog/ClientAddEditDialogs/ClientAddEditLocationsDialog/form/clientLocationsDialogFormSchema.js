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
    name: yup
        .string()
        .required("Pole jest wymagane"),
    phone: yup
        .string()
        .required("Pole jest wymagane")
        .matches(
            /^[0-9+\s()\-]*$/,
            "Pole zawiera niedozwolone znaki"
        )
        .test(
            "phone-digits",
            "Numer telefonu musi zawierać od 9 do 15 cyfr",
            value => {
                const digits = value?.replace(/\D/g, "") ?? "";
                return digits.length >= 9 && digits.length <= 15;
            }
        ),
    email: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Podaj poprawny adres email"),
})

export default schema
