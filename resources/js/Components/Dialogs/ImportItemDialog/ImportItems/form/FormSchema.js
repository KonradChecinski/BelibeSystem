import * as yup from 'yup'

const step1 = yup.object().shape({
    file: yup
        .mixed()
        .required("Pole jest wymagane")
        .test('fileSize', 'Plik jest za duży', value => {
            return value && value.size <= 2000000; // 2MB
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
            return value && value.size <= 2000000; // 2MB
        })
        .test('fileType', 'Niepoprawny typ pliku', value => {
            return value && (value.type === 'text/csv' || value.type === 'application/vnd.ms-excel');
        }),
})

export {step1, step2}
