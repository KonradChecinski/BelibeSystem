import * as yup from 'yup'

const schema = yup.object().shape({
    type: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        }),
    description: yup
        .string(),
    date: yup
        .string()
        .required("Pole jest wymagane"),
    time: yup
        .string()
        .required("Pole jest wymagane"),
    user: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        }),
})

export default schema
