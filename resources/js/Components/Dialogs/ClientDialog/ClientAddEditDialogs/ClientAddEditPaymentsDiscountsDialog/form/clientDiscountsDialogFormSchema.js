import * as yup from 'yup'

const schema = yup.object().shape({
    // type: yup
    //     .mixed()
    //     .test('is-empty', 'Pole jest wymagane', function (value) {
    //         return (typeof value === 'string' && value.trim() !== '');
    //     }),

    discount_value: yup
        .number()
        .typeError("Wartość musi być liczbą")
        .required("Pole jest wymagane")
        .min(0, "Wartość musi być większa lub równa 0")
        .max(100, "Wartość musi być mniejsza lub równa 100"),
})


export default schema
