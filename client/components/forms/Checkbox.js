import React, {PropTypes} from 'react'
import classnames from 'classnames'

export default class Checkbox extends React.Component {
    static propTypes = {
        input: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        meta: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
    }

    render() {
        const {
            input,
            label,
            meta,
            placeholder,
            required,
        } = this.props

        const groupClassName = classnames('form-group', {
            'has-danger': meta.invalid,
        })

        if (required) {
            input.required = true
        }

        if (placeholder) {
            input.placeholder = placeholder
        }

        return (
            <div className={groupClassName}>
                <label
                    className="custom-control custom-checkbox"
                    onClick={(event) => {
                        input.onChange(!input.value)
                        event.preventDefault()
                    }}
                >
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        checked={!!input.value}
                        onChange={() => {
                            // empty handler so that React is happy about this input being controlled
                        }}
                    />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description">{label}</span>
                </label>
                {
                    meta.invalid && meta.error && (
                        <div className="form-control-feedback">{meta.error}</div>
                    )
                }
            </div>
        )
    }
}
