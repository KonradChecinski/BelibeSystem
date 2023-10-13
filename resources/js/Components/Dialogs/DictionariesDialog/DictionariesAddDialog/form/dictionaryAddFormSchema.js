import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
})

const gpcSchema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    value: yup
        .string()
        .required("Pole jest wymagane"),
})

export {schema, gpcSchema}
