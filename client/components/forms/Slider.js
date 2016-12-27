import React, {PropTypes} from 'react'
import classnames from 'classnames'
import ReactSlider from 'react-slider'
import _isString from 'lodash/isString'

export default class Slider extends React.Component {
    static propTypes = {
        startValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        input: PropTypes.object.isRequired,
        label: PropTypes.string,
        meta: PropTypes.object.isRequired,
        handles: PropTypes.node,
    }

    render() {
        const {
            startValue = 0,
            input: {
                value,
                onChange,
            },
            label,
            meta,
            handles = <div></div>,
        } = this.props

        const groupClassName = classnames('form-group', {
            'has-danger': meta.invalid,
        })

        const v = _isString(value) && !value ? startValue : value

        return (
            <div className={groupClassName}>
                {
                    label && (
                        <label className="form-control-label">{label} ({v})</label>
                    )
                }
                <ReactSlider
                    value={v}
                    max={10}
                    withBars
                    onChange={onChange}
                >
                    {handles}
                </ReactSlider>
                {
                    meta.invalid && meta.error && (
                        <div className="form-control-feedback">{meta.error}</div>
                    )
                }
            </div>
        )
    }
}
