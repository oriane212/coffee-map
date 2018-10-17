import React, { Component } from 'react';
import './App.css';


class List extends Component {

    constructor(props) {
        super(props);
    }

    createList(geojson) {
        let list =
            geojson.features.map((feature) => {
          return (
            <div>{feature.properties.title}</div>
          )
          })
        return list;
      }

      render() {

        let listDivs = '';
        console.log(this.props.items);
        if (this.props.items !== '') {
            listDivs = this.createList(this.props.items);
        }
        
        return (

            <div>
                {listDivs}
            </div>

        )
      }
}

export default List;