import * as yup from 'yup'

const schema = yup.object().shape({
    title: yup
        .string()
        .required("Pole jest wymagane"),
    text: yup
        .string()
        .required("Pole jest wymagane"),
    date: yup
        .string()
        .required("Pole jest wymagane"),
    time: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
