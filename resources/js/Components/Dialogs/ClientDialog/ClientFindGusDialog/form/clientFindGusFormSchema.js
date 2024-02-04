import * as yup from 'yup'

const schema = yup.object().shape({
    nip: yup
        .string()
        .required("Pole jest wymagane"),
})

export {schema}
