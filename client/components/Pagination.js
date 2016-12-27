import React, {PropTypes} from 'react'
import ReactPaginate from 'react-paginate'

export default class Pagination extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
    }

    _handlePageClick = ({selected}) => this.props.onChange(selected + 1)

    render() {
        const {
            onChange,
            ...properties,
        } = this.props

        return (
            <ReactPaginate
                previousLabel="«"
                nextLabel="»"
                pageNum={10}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                clickCallback={this._handlePageClick}
                containerClassName={"pagination"}
                breakClassName={"page-item"}
                breakLabel={<a className="page-link">...</a>}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
                {...properties}
            />
        )
    }
}
