import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import CurrentUser from '../models/CurrentUser'
import {isLoggedIn} from '../common/currentUser/selectors'

@connect(state => ({
    isLoggedIn: isLoggedIn(state),
}))
export default class App extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        isLoggedIn: PropTypes.bool.isRequired,
    }

    componentDidMount() {
        CurrentUser.get()
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
                    <div className="container">
                        <Link
                            className="navbar-brand"
                            to="/"
                        >
                            Crab
                        </Link>
                        <ul className="nav navbar-nav">
                            {
                                this.props.isLoggedIn ? (
                                    <div>
                                        <li className="nav-item">
                                            <Link
                                                to="/criteria"
                                                className="nav-link"
                                                activeClassName="active"
                                            >
                                                Criteria
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/records"
                                                className="nav-link"
                                                activeClassName="active"
                                            >
                                                Records
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/statistics"
                                                className="nav-link"
                                                activeClassName="active"
                                            >
                                                Statistics
                                            </Link>
                                        </li>
                                    </div>
                                ) : (
                                    <div>
                                        <li className="nav-item">
                                            <a
                                                href="/api/auth/google"
                                                className="nav-link"
                                            >
                                                Auth
                                            </a>
                                        </li>
                                    </div>
                                )
                            }
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
