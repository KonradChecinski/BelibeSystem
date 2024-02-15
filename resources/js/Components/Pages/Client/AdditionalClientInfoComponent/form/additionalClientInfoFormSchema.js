import * as yup from 'yup'

const schema = yup.object().shape({
    status: yup
        .string()
        .required("Pole jest wymagane"),
    priority: yup
        .string()
        .required("Pole jest wymagane"),
    source_of_acquisition: yup
        .string()
        .required("Pole jest wymagane"),
    payment: yup
        .string()
        .required("Pole jest wymagane"),
    account_manager: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
