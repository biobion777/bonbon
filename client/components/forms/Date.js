import React, {PropTypes} from 'react'
import classnames from 'classnames'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default class Date extends React.Component {
    static propTypes = {
        input: PropTypes.object.isRequired,
        label: PropTypes.string,
        meta: PropTypes.object.isRequired,
        required: PropTypes.bool,
        dateFormat: PropTypes.string,
        todayButton: PropTypes.string,
    }

    constructor(props) {
        super(props)
        this.hasFormat = !!props.dateFormat
    }

    _handleChange = (value) => {
        const date = this.hasFormat ? value.format(this.props.dateFormat) : value.utc().format()
        this.props.input.onChange(date)
    }

    render() {
        const {
            input: {
                value,
            },
            label,
            meta,
            required,
            dateFormat,
            todayButton,
        } = this.props

        const groupClassName = classnames('form-group', {
            'has-danger': meta.invalid,
        })

        const inputClassName = classnames('form-control', {
            'form-control-danger': meta.invalid,
        })

        const date = this.hasFormat ? moment(value, dateFormat) : moment(value)

        return (
            <div className={groupClassName}>
                {
                    label && (
                        <label className="form-control-label">{label}</label>
                    )
                }
                <DatePicker
                    selected={date}
                    onChange={this._handleChange}
                    className={inputClassName}
                    required={required}
                    todayButton={todayButton}
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
