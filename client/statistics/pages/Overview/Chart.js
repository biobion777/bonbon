import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {fromJS} from 'immutable'
import faIconChars from 'font-awesome-icon-chars'
import ChartJS from 'chart.js'
import {Bar} from 'react-chartjs-2'
import _merge from 'lodash/merge'
import _find from 'lodash/find'

import Record from '../../../models/Record'

import {getIconPosition} from '../../utils'

const lineConfig = {
    borderCapStyle: 'butt',
    borderJoinStyle: 'miter',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 3,
    pointHoverRadius: 5,
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 3,
    pointHitRadius: 10,
    fill: false,
}

// define a plugin to provide icon labels over events records bars
ChartJS.plugins.register({
    afterDatasetsDraw(chartInstance) {
        const ctx = chartInstance.chart.ctx

        const iconsAmountByDate = chartInstance.options.meta.iconsAmountByDate || {}
        const iconsAmountByDateCounter = {}

        const padding = 5
        const fontSize = 14

        // for each date, display icons of events on top of the chart
        chartInstance.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.getDatasetMeta(i)

            if (!meta.hidden && dataset.icon) {
                // for each event criterion at this date
                meta.data.forEach((element, index) => {
                    // if the criterion has a falsey value, it did not occurred so it is not displayed
                    if (dataset.data[index] === 0) {
                        return
                    }

                    // increment icon's counter of this date
                    iconsAmountByDateCounter[index] = iconsAmountByDateCounter[index]
                        ? iconsAmountByDateCounter[index] + 1
                        : 1

                    // calculate icon position
                    const position = getIconPosition(element.tooltipPosition(), fontSize, iconsAmountByDate[index] || 1, iconsAmountByDateCounter[index])

                    // draw circle behind the icon
                    ctx.fillStyle = dataset.iconColor
                    ctx.beginPath()
                    ctx.arc(position.x, position.y - (fontSize / 2) - padding, (fontSize / 2) + 2, 0, Math.PI * 2)
                    ctx.fill()

                    // draw icon
                    const icon = String.fromCharCode(parseInt(dataset.icon, 16))
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillStyle = '#fff'
                    ctx.font = ChartJS.helpers.fontString(fontSize, 'normal', 'FontAwesome')
                    ctx.fillText(icon, position.x, position.y - (fontSize / 2) - padding)
                })
            }
        })
    }
})

@connect((state, ownProps) => {
    const {criteria, records} = ownProps

    const lines = criteria
        .filter(criterion => criterion.get('type') === 'range')
        .map((criterion) => {
            return _merge({
                type: 'line',
                label: criterion.get('name'),
                backgroundColor: criterion.get('color'),
                borderColor: criterion.get('color'),
                pointBorderColor: criterion.get('color'),
                pointHoverBackgroundColor: criterion.get('color'),
                data: records
                    .map((recordByDate) => {
                        const record = recordByDate.get('record')
                        if (record) {
                            const recordValue = record
                                .get('values', fromJS([]))
                                .find(value => value.get('criterion') === criterion.get('id'))

                            return recordValue ? recordValue.get('value') : criterion.get('defaultValue')
                        }

                        return criterion.get('defaultValue')
                    })
                    .reverse()
                    .toJS()
            }, lineConfig)
        })
        .toJS()

    const bars = criteria
        .filter(criterion => criterion.get('type') === 'event')
        .map((criterion) => {
            const options = {}
            const iconConfig = _find(faIconChars, {id: criterion.get('icon')})

            if (iconConfig) {
                options.icon = iconConfig.unicode
            }

            return _merge({
                    type: 'bar',
                    label: criterion.get('name'),
                    iconColor: criterion.get('color'),
                    backgroundColor: '#DCDCDC',
                    data: records
                        .map((recordByDate) => {
                            const record = recordByDate.get('record')
                            if (record) {
                                const recordValue = record
                                    .get('values', fromJS([]))
                                    .find(value => value.get('criterion') === criterion.get('id'))

                                return recordValue && recordValue.get('value') ? 10 : 0
                            }

                            return 0
                        })
                        .reverse()
                        .toJS()
                },
                options,
                lineConfig,
            )
        })
        .toJS()

    const datasets = lines.concat(bars)

    return {
        data: {
            labels: records
                .map(Record.renderDate)
                .reverse()
                .toJS(),
            datasets,
        },
        optionsMeta: {
            iconsAmountByDate: datasets
                .filter(dataset => !!dataset.icon)
                .map(dataset => dataset.data)
                .reduce((result, eventValuesByIndex) => {
                    eventValuesByIndex.forEach((eventValueByIndex, index) => {
                        if (eventValueByIndex) {
                            result[index] = (result[index] + 1) || 1
                        }
                    })
                    return result
                }, {})
        },
    }
})
export default class Chart extends React.Component {
    render() {
        const {
            data,
        } = this.props

        return (
                <Bar
                    data={data}
                    options={{
                        meta: this.props.optionsMeta,
                        layout: {
                            padding: {
                                top: 46,
                            },
                        },
                        legend: {
                            display: false,
                        },
                        tooltips: {
                            enabled: false,
                            mode: 'index',
                            position: 'nearest',
                            intersect: false,
                        },
                        scales: {
                            yAxes: [
                                {
                                    type: 'linear',
                                    ticks: {
                                        min: 0,
                                        max: 10,
                                    },
                                }
                            ],
                            xAxes: [
                                {
                                    stacked: true,
                                    categoryPercentage: 0.5,
                                    barThickness: 2,
                                    barPercentage: 0.5,
                                }
                            ]
                        }
                    }}
                />
        )
    }
}
