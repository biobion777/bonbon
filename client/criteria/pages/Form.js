import React, {PropTypes} from 'react'
import {Link, withRouter} from 'react-router'
import {connect} from 'react-redux'
import {fromJS} from 'immutable'
import {Field, reduxForm, formValueSelector} from 'redux-form/immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import _isUndefined from 'lodash/isUndefined'

import {formSender} from '../../middlewares/formSender'
import Criterion from '../../models/Criterion'
import {makeGetCriterion} from '../selectors'

import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Color from '../../components/forms/Color'

const formName = 'criterion'
const formSelector = formValueSelector(formName)
const defaultValues = {
    type: 'range',
}

@connect((state, ownProps) => {
    const id = ownProps.params.id
    const getCriterion = makeGetCriterion(id)
    const isUpdate = !_isUndefined(id)

    return {
        fieldType: formSelector(state, 'type'),
        id,
        initialValues: isUpdate ? getCriterion(state) : fromJS(defaultValues),
        isUpdate,
        loading: state.get('loading'),
    }
})
@reduxForm({
    form: formName,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
})
@withRouter
export default class Form extends React.Component {
    static propTypes = {
        error: PropTypes.object,
        fieldType: PropTypes.string,
        handleSubmit: PropTypes.func.isRequired,
        id: PropTypes.string,
        initialValues: ImmutablePropTypes.map,
        isUpdate: PropTypes.bool.isRequired,
        loading: ImmutablePropTypes.map.isRequired,
        submitting: PropTypes.bool.isRequired,
    }

    componentDidMount() {
        if (this.props.isUpdate) {
            Criterion.get(this.props.id)
        }
    }

    componentWillReceiveProps(nextProps) {
        // if id changes, initialize the form again
        if (this.props.id !== nextProps.id) {
            nextProps.initialize(nextProps.initialValues)
        }
    }

    _handleSubmit = (values) => {
        return formSender(Criterion.submit(values))
            .then(({response: {result}}) => {
                if (result && result.id) {
                    this.props.router.push('/criteria/edit/' + result.id)
                }
            })
    }

    render() {
        const {
            error,
            fieldType,
            handleSubmit,
            initialValues,
            isUpdate,
            loading,
            submitting,
        } = this.props

        return (
            <div>
                <h1>
                    {isUpdate ? `Editing ${initialValues.get('name')}` : 'Add a criterion'}
                    <div className="pull-right">
                        <Link
                            to="/criteria"
                            className="btn btn-primary"
                        >
                            Back to list
                        </Link>
                    </div>
                </h1>
                <form
                    onSubmit={handleSubmit(this._handleSubmit)}
                >
                    <fieldset disabled={loading.get('getCriterion')}>
                        {
                            error && (
                                <div className="alert alert-danger">{error}</div>
                            )
                        }
                        <Field
                            name="name"
                            label="Name"
                            placeholder="Sleep, mood, sport, etc."
                            component={Input}
                        />
                        <Field
                            name="type"
                            label="Type"
                            component={Select}
                        >
                            <option value="range">Range (everyday between 0 and 10)</option>
                            <option value="event">Event (for special occasions)</option>
                        </Field>
                        {
                            fieldType === 'range' && (
                                <Field
                                    name="defaultValue"
                                    label="Default value"
                                    placeholder="0"
                                    type="number"
                                    helper="A value between 0 and 10"
                                    component={Input}
                                />
                            )
                        }
                        <Field
                            name="color"
                            label="Color"
                            component={Color}
                        />
                        <Field
                            name="icon"
                            label="Icon"
                            placeholder="plane"
                            helper={
                                <span>From <a
                                    href="http://fontawesome.io/icons/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Font Awesome
                                </a> icons set</span>
                            }
                            component={Input}
                        />
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                Submit
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}
