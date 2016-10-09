import React, { Component } from 'react';
import {
  ListView,
} from 'react-native';

import Movie from './movie';


export default class ListMovies extends Component {
  render() {
    return (
      <ListView
        dataSource={this.props.data}
        renderRow={(rowData, sectionID, rowID, highlightRow) => <Movie key={rowID} data={rowData} />}
      />
    )
  }
}
