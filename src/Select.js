import React, { Component } from 'react';
import './App.css';

class Select extends Component {

    render() {

        const categories = [
            'All', 'Cafe', 'Restaurant'
        ]

        return (
            <select 
                value={this.props.selection}
                onChange={(event) => this.props.onSelection(event)}>
                {categories.map((category) => {
                    return (
                        <option key={category} value={category}>{category}</option>
                    )
                })}
            </select>
        )
    }
}

export default Select;