import React, {PropTypes} from 'react'
import classnames from 'classnames'

export default class Select extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        helper: PropTypes.string,
        input: PropTypes.object.isRequired,
        label: PropTypes.string,
        meta: PropTypes.object.isRequired,
        required: PropTypes.bool,
    }

    render() {
        const {
            children,
            helper,
            input,
            label,
            meta,
            required,
        } = this.props

        const groupClassName = classnames('form-group', {
            'has-danger': meta.invalid,
        })

        const inputClassName = classnames('form-control', {
            'form-control-danger': meta.invalid,
        })

        if (required) {
            input.required = true
        }

        return (
            <div className={groupClassName}>
                {
                    label && (
                        <label className="form-control-label">{label}</label>
                    )
                }
                <select
                    {...input}
                    className={inputClassName}
                >
                    {children}
                </select>
                {
                    meta.invalid && meta.error && (
                        <div className="form-control-feedback">{meta.error}</div>
                    )
                }
                {
                    helper && (
                        <small className="form-text text-muted">{helper}</small>
                    )
                }
            </div>
        )
    }
}
