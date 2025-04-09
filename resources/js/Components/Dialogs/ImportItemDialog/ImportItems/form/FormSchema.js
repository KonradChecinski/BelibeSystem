import * as yup from 'yup'

const step1 = yup.object().shape({
    file: yup
        .mixed()
        .required("Pole jest wymagane")
        .test('fileSize', 'Plik jest za duży', value => {
            return value && value.size <= 80000000; // 2MB
        })
        .test('fileType', 'Niepoprawny typ pliku', value => {
            console.log(value.type)
            return value && (value.type === 'text/csv' || value.type === 'application/vnd.ms-excel' || value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }),
})

const step2 = yup.object().shape({
    file: yup
        .mixed()
        .required("Pole jest wymagane")
        .test('fileSize', 'Plik jest za duży', value => {
            return value && value.size <= 80000000;
        })
        .test('fileType', 'Niepoprawny typ pliku', value => {
            return (
                value &&
                (
                    value.type === 'text/csv' ||
                    value.type === 'application/vnd.ms-excel' ||
                    value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
            );
        }),
    identification: yup
        .number()
        .required("Pole jest wymagane"),
    selectedHeaders: yup.object().when('identification', (identification, schema) => {
        return schema.shape({
            symbol: identification[0] === 1
                ? yup.string().required("Pole symbol jest wymagane")
                : yup.string().nullable(),
            ean: identification[0] === 2
                ? yup.string().required("Pole ean jest wymagane")
                : yup.string().nullable(),
            quantity: yup.string().required("Pole quantity jest wymagane"),
        });
    }),
});

const step3 = yup.object().shape({
    items: yup,
})

export {step1, step2, step3}
