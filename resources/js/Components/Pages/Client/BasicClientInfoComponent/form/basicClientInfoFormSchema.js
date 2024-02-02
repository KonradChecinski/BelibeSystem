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
    zip_code: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[0-9-]+$/, "Pole zawiera niedozwolone znaki"),
    street: yup
        .string()
        .required("Pole jest wymagane"),
    house_number: yup
        .number()
        .required("Pole jest wymagane"),
    apartment_number: yup
        .number()
        .required("Pole jest wymagane"),

    phone: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[0-9\s]*$|^[0-9\s\-]*$/, "Pole zawiera niedozwolone znaki"),
    email: yup
        .string()
        .required("Pole jest wymagane")
})

export default schema
