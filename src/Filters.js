import React, { Component } from 'react';
import './App.css';

class Filters extends Component {

    createList() {
        let filterList = this.props.filters.map((filter) => {
            return (
                <div key={filter.category}>
                    <label>
                        {filter.category}
                        <input
                            name={filter.category}
                            type='checkbox'
                            checked={filter.show}
                            onChange={(event) => this.props.handleInputChange(filter, event)} />
                    </label>
                </div>
            )
        })

        return filterList;
    }

    render() {

        let filterListDivs = '';
        filterListDivs = this.createList();

        return (
            <div>
                {filterListDivs}
            </div>
            
        )
    }

}

export default Filters;