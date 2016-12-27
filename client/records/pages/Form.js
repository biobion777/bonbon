import React, {PropTypes} from 'react'
import {Link, withRouter} from 'react-router'
import {connect} from 'react-redux'
import {fromJS} from 'immutable'
import moment from 'moment'
import {Field, FieldArray, reduxForm, formValueSelector} from 'redux-form/immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import _get from 'lodash/get'
import _isUndefined from 'lodash/isUndefined'
import _cloneDeep from 'lodash/cloneDeep'

import {formSender} from '../../middlewares/formSender'
import Criterion from '../../models/Criterion'
import {getAllCriteria} from '../../criteria/selectors'
import Record from '../../models/Record'
import {makeGetRecord, makeGetRecordByDate} from '../selectors'

import Date from '../../components/forms/Date'
import Slider from '../../components/forms/Slider'
import Checkbox from '../../components/forms/Checkbox'

const formName = 'record'
const formSelector = formValueSelector(formName)
const defaultValues = {
    date: moment().format(Record.getDateFormat()),
    values: [],
}
const _docToForm = (doc) => {
    let form = doc

    // transforming array of values into objects
    let values = fromJS({})
    form.get('values', fromJS([])).forEach(value => values = values.set(value.get('criterion'), value.get('value')))
    form = form.set('values', values)

    return form
}
const _formToDoc = (form) => {
    let doc = form

    // transforming objects of values into array
    let values = fromJS([])
    doc.get('values', fromJS([])).forEach((value, id) => values = values.push(fromJS({
        criterion: id,
        value,
    })))
    doc = doc.set('values', values)

    return doc
}

@connect((state, ownProps) => {
    const id = ownProps.params.id
    const getRecord = makeGetRecord(id)
    const isUpdate = !_isUndefined(id)

    // update default value according to query params
    const queryDate = _get(ownProps, 'location.query.date')
    const updatedDefaultValues = _cloneDeep(defaultValues)
    if (queryDate) {
        updatedDefaultValues.date = moment(queryDate, 'MM-DD-YYYY').format(Record.getDateFormat())
    }

    const form = isUpdate ? getRecord(state) : fromJS(updatedDefaultValues)
    const fieldValue = (name, defaultValue = '') => formSelector(state, name) || defaultValue
    let existingRecord = makeGetRecordByDate(fieldValue('date'))(state)

    if (!existingRecord.isEmpty() && existingRecord.get('id') === id) {
        existingRecord = fromJS({})
    }

    return {
        criteria: getAllCriteria(state),
        existingRecord,
        fieldValue,
        hasExistingRecord: !existingRecord.isEmpty(),
        id,
        initialValues: _docToForm(form),
        isUpdate,
        loading: state.get('loading'),
    }
})
@reduxForm({
    enableReinitialize: true,
    form: formName,
    keepDirtyOnReinitialize: true,
})
@withRouter
export default class Form extends React.Component {
    static propTypes = {
        criteria: ImmutablePropTypes.list.isRequired,
        error: PropTypes.object,
        existingRecord: ImmutablePropTypes.map.isRequired,
        fieldValue: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        hasExistingRecord: PropTypes.bool.isRequired,
        id: PropTypes.string,
        initialize: PropTypes.func.isRequired,
        initialValues: ImmutablePropTypes.map,
        isUpdate: PropTypes.bool.isRequired,
        loading: ImmutablePropTypes.map.isRequired,
        submitting: PropTypes.bool.isRequired,
    }

    componentDidMount() {
        Criterion.getAll()

        if (this.props.isUpdate) {
            Record.get(this.props.id)
        }
    }

    componentWillReceiveProps(nextProps) {
        // if date changed, check if there is already an existing record at this date
        if (this.props.fieldValue('date') !== nextProps.fieldValue('date')) {
            Record.getByDate(nextProps.fieldValue('date'))
        }

        // if id changes, initialize the form again
        if (this.props.id !== nextProps.id) {
            nextProps.initialize(nextProps.initialValues)
        }
    }

    _handleSubmit = (values) => {
        return formSender(Record.submit(_formToDoc(values)))
            .then(({response: {result}}) => {
                if (result && result.id) {
                    this.props.router.push('/records/edit/' + result.id)
                }
            })
    }

    render() {
        const {
            criteria,
            error,
            existingRecord,
            handleSubmit,
            hasExistingRecord,
            initialValues,
            isUpdate,
            loading,
            submitting,
        } = this.props

        return (
            <div>
                <h1>
                    {isUpdate ? `Editing ${Record.renderDate(initialValues)}` : 'Add a record'}
                    <div className="pull-right">
                        <Link
                            to="/records"
                            className="btn btn-primary"
                        >
                            Back to list
                        </Link>
                    </div>
                </h1>
                <form
                    onSubmit={handleSubmit(this._handleSubmit)}
                >
                    <fieldset disabled={loading.get('getRecord') || loading.get('allCriterion')}>
                        {
                            error && (
                                <div className="alert alert-danger">{error}</div>
                            )
                        }
                        {
                            !isUpdate && (
                                <Field
                                    name="date"
                                    label="Date"
                                    component={Date}
                                    dateFormat={Record.getDateFormat()}
                                    todayButton="Today"
                                />
                            )
                        }
                        {
                            hasExistingRecord ? (
                                <p>
                                    <Link to={'/records/edit/' + existingRecord.get('id')}>
                                        A record already exists for this date
                                    </Link>
                                </p>
                            ) : (
                                <div>
                                    {
                                        criteria
                                            .filter(criterion => criterion.get('type') === 'range')
                                            .map((criterion) =>
                                                <Field
                                                    key={criterion.get('id')}
                                                    label={criterion.get('name')}
                                                    name={`values.${criterion.get('id')}`}
                                                    startValue={criterion.get('defaultValue')}
                                                    component={Slider}
                                                    handles={Criterion.renderIcon(criterion)}
                                                />
                                            )
                                    }
                                    {
                                        criteria
                                            .filter(criterion => criterion.get('type') === 'event')
                                            .map((criterion) =>
                                                <Field
                                                    key={criterion.get('id')}
                                                    label={criterion.get('name')}
                                                    name={`values.${criterion.get('id')}`}
                                                    component={Checkbox}
                                                />
                                            )
                                    }
                                    <div className="form-group">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={submitting || hasExistingRecord}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </fieldset>
                </form>
            </div>
        )
    }
}
