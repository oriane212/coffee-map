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

        // keep filter items in alphabetical order
        filterList.sort(function(a,b) {
            if(a.key < b.key) {
                return -1;
            }
            if(a.key > b.key) {
                return 1;
            }
            return 0;
        });

        return filterList;
    }

    render() {

        let filterListDivs = '';
        if(this.props.filters !== []) {
            filterListDivs = this.createList();
        }
        
        return (
            <div>
                {filterListDivs}
            </div>
            
        )
    }

}

export default Filters;