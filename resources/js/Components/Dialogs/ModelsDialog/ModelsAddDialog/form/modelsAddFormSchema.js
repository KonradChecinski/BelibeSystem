import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    symbol: yup
        .string()
        .required("Pole jest wymagane")
        .matches(/^[a-zA-Z]{1,2}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/, "Format symbolu jest nieprawidłowy"),
})

export default schema
