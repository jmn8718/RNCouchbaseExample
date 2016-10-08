import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} from 'react-native';

import {
  manager,
  ReactCBLite,
} from 'react-native-couchbase-lite';

import ListMovies from './components/listMovies';

const SG_URL = '10.111.4.12:4984';
const DB_NAME = 'moviesapp';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      sequence: '',
      filteredMovies: '',
    }
  }

  componentDidMount() {
    ReactCBLite.init(url => {
      console.log(url)
      const database = new manager(url, DB_NAME);
      database.createDatabase()
        .then(res => {
          database.createDesignDocument('main', {
            filters: {
              year: 'function (doc) { if (doc.year === 2004) { return true;} return false;}'
            },
            views: {
              movies: {
                map: 'function (doc) { if (doc.year) { emit(doc._id, null);}}'
              }
            }
          });
          const REPLICATION_OPTIONS = {
            continuous: true,
          };
          database.replicate(`http://${SG_URL}/${DB_NAME}`, DB_NAME, REPLICATION_OPTIONS);
          database.getInfo()
            .then(res => {
              database.listen({
                since: res.update_seq - 1,
                feed: 'longpoll',
              });
              database.changesEventEmitter.on('changes', function (e) {
                this.setState({sequence: e.last_seq});
              }.bind(this));
              // database.listen({
              //   since: 0,
              //   feed: 'longpoll',
              //   filter: 'main/year',
              // });
              // database.changesEventEmitter.on('changes', function (e) {
              //   this.setState({filteredMovies: e.last_seq});
              // }.bind(this));
            })
            .catch(e => console.log('ERROR INFO', e))
        })
        // .then(() => database.getDocuments())
        .then(() => database.queryView('main', 'movies', {include_docs: true}))
        .then(res => this.setState({ data: res.rows }))
        .catch(e => console.log('ERROR', e));
    })
  }

  renderMovie = movie => <Movie data={movie} />

  render() {
    return (
      <View>
        <Text style={styles.seqTextLabel}>
          The database sequence: {this.state.sequence}
        </Text>
        <Text>
          Movies published in 2004: {this.state.filteredMovies}
        </Text>
        <ListMovies
          data={this.state.data}
          style={styles.listView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  seqTextLabel: {
    textAlign: 'center',
    margin: 5
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
});
