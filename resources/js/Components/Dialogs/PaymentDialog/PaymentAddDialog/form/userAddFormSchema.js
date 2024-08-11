import * as yup from 'yup'

const addSchema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    subiekt_id: yup
        .string()
        .required("Pole jest wymagane"),
    type: yup
        .string()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        })
        .required("Pole jest wymagane"),
})

const editSchema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    subiekt_id: yup
        .string()
        .required("Pole jest wymagane"),
    type: yup
        .string()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        })
        .required("Pole jest wymagane"),
})

export {addSchema, editSchema}
