import * as yup from 'yup'

const schema = yup.object().shape({
    room_id: yup
        .number()
        .typeError('Wybierz pokój')
        .integer('ID pokoju musi być liczbą całkowitą')
        .positive('ID pokoju musi być dodatnie')
        .required('Wybierz pokój'),
    aisle_id: yup
        .number()
        .typeError('Wybierz aleję')
        .integer('ID alei musi być liczbą całkowitą')
        .positive('ID alei musi być dodatnie')
        .required('Wybierz aleję'),
    shelf_id: yup
        .number()
        .typeError('Wybierz regał')
        .integer('ID regału musi być liczbą całkowitą')
        .positive('ID regału musi być dodatnie')
        .required('Wybierz regał'),
})


export default schema
