import * as yup from 'yup'

const schema = yup.object().shape({
    title: yup
        .string()
        .required("Pole jest wymagane"),
    text: yup
        .string()
        .required("Pole jest wymagane"),
    datetime: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
