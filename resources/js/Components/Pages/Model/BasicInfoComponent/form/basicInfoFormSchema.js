import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-_!@#$%^"'`;:|&*()~<>,.?\/\\]+$/, "Pole zawiera niedozwolone znaki"),
    brand: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
