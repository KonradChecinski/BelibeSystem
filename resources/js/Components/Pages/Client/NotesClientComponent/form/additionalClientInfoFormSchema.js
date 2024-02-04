import * as yup from 'yup'

const schema = yup.object().shape({
    status: yup
        .string()
        .required("Pole jest wymagane"),
    priority: yup
        .number()
        .required("Pole jest wymagane"),
    source: yup
        .string()
        .required("Pole jest wymagane"),
    payment: yup
        .string()
        .required("Pole jest wymagane"),
    blacklisted: yup
        .boolean()
        .required("Pole jest wymagane"),
})

export default schema
