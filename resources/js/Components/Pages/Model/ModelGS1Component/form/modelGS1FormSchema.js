import * as yup from 'yup'

const schema = yup.object().shape({
    gs1_gpc: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        })
        .required("Pole jest wymagane"),
    gs1_brand: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        })
        .required("Pole jest wymagane"),
})

export default schema
