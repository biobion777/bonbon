import React, {PropTypes} from 'react'
import classnames from 'classnames'

export default class Input extends React.Component {
    static propTypes = {
        helper: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        input: PropTypes.object.isRequired,
        label: PropTypes.string,
        meta: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        type: PropTypes.string,
    }

    render() {
        const {
            helper,
            input,
            label,
            meta,
            placeholder,
            required,
            type,
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

        if (placeholder) {
            input.placeholder = placeholder
        }

        return (
            <div className={groupClassName}>
                {
                    label && (
                        <label className="form-control-label">{label}</label>
                    )
                }
                <input
                    {...input}
                    type={type}
                    className={inputClassName}
                />
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
