import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Criterion from '../../models/Criterion'
import {getAllCriteria} from '../selectors'

@connect(state => ({
    criteria: getAllCriteria(state),
}))
export default class List extends React.Component {
    static propTypes = {
        criteria: ImmutablePropTypes.list.isRequired,
    }

    componentDidMount() {
        Criterion.getAll()
    }

    _renderCriterion = (criterion, index) => {
        return (
            <tr key={index}>
                <td width="30">
                    {Criterion.renderIcon(criterion)}
                </td>
                <td>
                    <Link to={`/criteria/edit/${criterion.get('id')}`}>
                        {criterion.get('name')}
                    </Link>
                </td>
                <td>
                    {criterion.get('type')}
                </td>
                <td>
                    {
                        criterion.get('type') === 'range' && (
                            <span>{criterion.get('defaultValue')}</span>
                        )
                    }
                </td>
            </tr>
        )
    }

    _renderCriteria = () => {
        const {criteria} = this.props
        return (
            <tbody>
                {criteria.map(this._renderCriterion)}
            </tbody>
        )
    }

    render() {
        return (
            <div>
                <h1>
                    Your criteria
                    <div className="pull-right">
                        <Link
                            to="/criteria/add"
                            className="btn btn-primary"
                        >
                            Add a criterion
                        </Link>
                    </div>
                </h1>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Default</th>
                        </tr>
                    </thead>
                    {this._renderCriteria()}
                </table>
            </div>
        )
    }
}
