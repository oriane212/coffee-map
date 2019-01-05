import React, { Component } from 'react';
import './App.css';

// Select menu for filtering list of venues by category
class Select extends Component {

    render() {

        const categories = [
            'All', 'Cafe', 'Diner', 'Restaurant'
        ]

        return (
            <nav className='select-container' aria-labelledby="filter-list">
                <select
                    id="filter-list"
                    value={this.props.selection}
                    onChange={(event) => this.props.onSelection(event)}>
                    {categories.map((category) => {
                        return (
                            <option key={category} value={category}>{category}</option>
                        )
                    })}
                </select>
            </nav>
        )
    }
}

export default Select;