import * as yup from 'yup'

const schema = yup.object().shape({
    country: yup
        .string()
        .required("Pole jest wymagane"),
    nip: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[0-9]{10}$/, "Format nipu jest nieprawidłowy"),
})

export default schema
