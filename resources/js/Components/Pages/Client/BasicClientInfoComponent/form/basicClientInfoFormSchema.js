import * as yup from 'yup'

const schema = yup.object().shape({
    nip: yup
        .string()
        .required("Pole jest wymagane"),
    name: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-_!@#$%^"'`;:|&*()~<>,.?\/\\]+$/, "Pole zawiera niedozwolone znaki"),

    country: yup
        .string()
        .required("Pole jest wymagane"),
    city: yup
        .string()
        .required("Pole jest wymagane"),
    postal_code: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[0-9]{2}-[0-9]{3}$/, "Kod powienien być w formacie xx-xxx"),
    street: yup
        .string()
        .required("Pole jest wymagane"),
    building_number: yup
        .string()
        .required("Pole jest wymagane")
        .max(10, "Pole zawiera zbyt dużą ilość znaków"),
    apartment_number: yup
        .number()
        .nullable(),

    phone: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[0-9\s]*$|^[0-9\s\-]*$/, "Pole zawiera niedozwolone znaki"),
    email: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Podaj poprawny adres email"),
})

export default schema
