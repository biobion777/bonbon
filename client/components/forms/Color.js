import React, {PropTypes} from 'react'
import classnames from 'classnames'
import {CirclePicker} from 'react-color'

export default class Color extends React.Component {
    static propTypes = {
        input: PropTypes.object.isRequired,
        label: PropTypes.string,
        meta: PropTypes.object.isRequired,
    }

    _handleChange = (color) => {
        this.props.input.onChange(color.hex)
    }

    render() {
        const {
            input: {
                value,
            },
            label,
            meta,
        } = this.props

        const groupClassName = classnames('form-group', {
            'has-danger': meta.invalid,
        })

        return (
            <div className={groupClassName}>
                {
                    label && (
                        <label className="form-control-label">{label}</label>
                    )
                }
                <CirclePicker
                    color={value}
                    onChange={this._handleChange}
                />
                {
                    meta.invalid && meta.error && (
                        <div className="form-control-feedback">{meta.error}</div>
                    )
                }
            </div>
        )
    }
}
