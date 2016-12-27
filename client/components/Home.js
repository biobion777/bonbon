import React, {PropTypes} from 'react'

import './home.less'

export default class Home extends React.Component {
    render() {
        return (
            <div className="page home">
                <img
                    className="logo"
                    src={require('../assets/crab.svg')}
                />
            </div>
        )
    }
}
