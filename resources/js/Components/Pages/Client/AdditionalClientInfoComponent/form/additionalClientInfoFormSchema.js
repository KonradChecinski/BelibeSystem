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
    industry: yup
        .string()
        .required("Pole jest wymagane"),
    payments: yup
        .mixed(),
    // .required("Pole jest wymagane")
    // // .test('is-empty', 'Pole jest wymagane (test)', function (value) {
    // //     return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
    // // }),
    // .test('is-not-empty', 'Pole jest wymagane (test)', function (value) {
    //     console.log(value);
    //     return !!value && Array.isArray(value) && value.length > 0; // Ensure the value is truthy and not an empty array
    // }),
    // .nullable(),
    // .array()
    // .of(yup.object())
    // .min(1, "Pole jest wymagane")
    // .required("Pole jest wymagane"),
    account_manager: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
