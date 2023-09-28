import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    symbol: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
