import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {fromJS} from 'immutable'
import {Link} from 'react-router'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Criterion from '../../models/Criterion'
import Record from '../../models/Record'
import {getPaginatedRecords} from '../../records/selectors'
import {getAllCriteria} from '../../criteria/selectors'

import Pagination from '../../components/Pagination'
import Chart from './Overview/Chart'

@connect(state => {
    const criteria = getAllCriteria(state)
    const records = getPaginatedRecords(state)

    return {
        criteria,
        records,
        loading: state.get('loading'),
    }
})
export default class Overview extends React.Component {
    state = {
        page: 1,
        isInitiated: false,
    }

    componentDidMount() {
        Criterion.getAll().then(() => {
            this._loadData().then(() => this.setState({isInitiated: true}))
        })
    }

    _loadData = () => {
        return Record.paginate({p: this.state.page})
    }

    _handlePageClick = (page) => {
        this.setState({page}, () => {
            this._loadData()
        })
    }

    render() {
        const {
            criteria,
            records,
            loading,
        } = this.props

        if (loading.get('allCriterion') || !this.state.isInitiated) {
            return null
        }

        return (
            <div>
                <Chart
                    criteria={criteria}
                    records={records}
                />
                <Pagination
                    pageNum={200}
                    onChange={this._handlePageClick}
                />
            </div>
        )
    }
}
