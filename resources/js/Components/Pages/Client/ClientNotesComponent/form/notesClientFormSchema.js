import * as yup from 'yup'

const schema = yup.object().shape({
    notes: yup
        .string(),
})

export default schema
