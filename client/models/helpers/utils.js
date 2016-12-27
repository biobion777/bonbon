import {camelize, decamelize} from 'humps'
import _upperFirst from 'lodash/upperFirst'
import {loadingSuffixes} from '../../config'

const separator = '_'

/**
 * Return action type name based on action name and model name
 * @param functionName
 * @param modelName
 * @returns {*}
 */
export const typeForAction = (functionName, modelName) => {
    return functionName + _upperFirst(decamelize(modelName, {separator}))
}

/**
 * Return actions tyoes names for api calls (request / success / failure)
 * based on action name and model name
 * ex: 'paginate' and 'criterion' => ['PAGINATE_CRITERION_REQUEST', etc.]
 * @param functionName
 * @param modelName
 * @returns {*}
 */
export const typesForCallAPI = (functionName, modelName) => {
    const name = typeForAction(functionName, modelName)
    return loadingSuffixes.map((suffix) => {
        const final = decamelize(name, {separator}) + suffix
        return final.toUpperCase()
    })
}
