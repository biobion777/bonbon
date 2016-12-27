import {SubmissionError} from 'redux-form/immutable'
import {camelizeKeys} from 'humps'

export const formSender = (callAPIPromise) => {
    // building a form promise reacting to the form API call result
    let formPromise = new Promise((resolve, reject) => {
        if (!(callAPIPromise && callAPIPromise.then)) {
            console.error('The function entering "formSender" is not a promise')
            return
        }

        callAPIPromise
            .then((response = {}) => {
                // if errors from API, reject the form promise
                if (response.error) {
                    return reject(response)
                }

                return resolve(response)
            })
    })

    formPromise = formPromise
        .catch(({errors = {}}) => {
            // catching form validation errors and sending them to Redux form
            console.info('Form received some validation errors from server', errors)
            throw new SubmissionError(camelizeKeys(errors))
        })

    return formPromise
}
