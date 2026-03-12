import * as yup from 'yup'

const schema = yup.object().shape({
    buyer_subiekt_id: yup
        .number()
        .required("Pole jest wymagane")
})


export {schema}
