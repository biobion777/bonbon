import React, {PropTypes} from 'react'
import {browserHistory, Link} from 'react-router'
import {connect} from 'react-redux'
import moment from 'moment'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Record from '../../models/Record'
import {getPaginatedRecords} from '../selectors'

import Pagination from '../../components/Pagination'

@connect((state, ownProps) => ({
    records: getPaginatedRecords(state),
    page: parseInt(ownProps.params.page) || 1,
}))
export default class List extends React.Component {
    static propTypes = {
        records: ImmutablePropTypes.list.isRequired,
    }

    componentWillMount() {
        this._loadData(this.props.page)
    }

    componentWillReceiveProps(nextProps) {
        // if page changed then fetch it
        if (this.props.page !== nextProps.page) {
            this._loadData(nextProps.page)
        }
    }

    _loadData = (page) => {
        Record.paginate({p: page})
    }

    _handlePageClick = (page) => {
        browserHistory.push('/records/' + page)
    }

    _renderRecord = (recordByDate, index) => {
        const date = moment(recordByDate.get('date'), Record.getDateFormat())
        const record = recordByDate.get('record')

        return (
            <tr key={index}>
                <td>
                    <Link
                        to={record ? `/records/edit/${record.get('id')}` : `/records/add?date=${date.format('MM-DD-YYYY')}`}>
                        {date.format('MM/DD/YYYY')}
                    </Link>
                </td>
                <td>
                    {
                        record ? (
                            <span className="tag tag-success">Done</span>
                        ) : (
                            <span className="tag tag-warning">Empty</span>
                        )
                    }
                </td>
            </tr>
        )
    }

    _renderRecords = () => {
        const {records} = this.props
        return (
            <tbody>
                {records.map(this._renderRecord)}
            </tbody>
        )
    }

    render() {
        return (
            <div>
                <h1>
                    Your records
                    <div className="pull-right">
                        <Link
                            to="/records/add"
                            className="btn btn-primary"
                        >
                            Add a record
                        </Link>
                    </div>
                </h1>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    {this._renderRecords()}
                </table>
                <Pagination
                    pageNum={200}
                    initialSelected={this.props.page - 1}
                    onChange={this._handlePageClick}
                />
            </div>
        )
    }
}
