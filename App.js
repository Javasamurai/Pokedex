import React, { Component } from 'react';
import { ScrollView, Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';

const instructions = Platform.select({
  ios: 'Preesssss Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Do tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

class PokemonList extends Component {
  render() {
    return (
    <View style= {styles.listItem}>
      <Text style = {{flex: 1,fontSize: 22, color: 'black'}}>{this.props.index}</Text>
      <Text style = {{flex: 1, fontSize: 22, color: 'black'}}>{this.props.name}</Text>
      <Image source = {{uri:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+ this.props.index +'.png'}} style= {{flex: 1, width: 100, height: 100}}></Image>
    </View>
    )
  }
}

export default class App extends Component {
  constructor(props){
    super(props);
    this.spinValue = new Animated.Value(0);
    this.state.pokemonresponse = [];
  }
  state = {
    pokemonresponse: []
  }
  fetchPokemons() {
    let that = this
    fetch('https://pokeapi.co/api/v2/pokemon')
    .then((response) => response.json())
    .then((responseJSON) => {
      that.setState({
        pokemonresponse: responseJSON.results,
        next: responseJSON.next
      })
    })
  }
  componentDidMount() {
    this.fetchPokemons()
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 500
    }).start()
  }
  updateContent(evt) {
    if(event.native.contentOffset.y) {
      this.loadNext();
    }
  }
  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    })
  
    return (
      <View style = {styles.main_container}>
        <View style ={{backgroundColor: '#FBD32C',alignItems: 'center', justifyContent: 'center', height: 120}}>
          <Animated.Image source = {require('./pokeball.png')} style= {{ width: 100, height: 100, transform: [{rotate: spin}]}}/>
        </View>
        <ScrollView style = {{flex: 3, backgroundColor: 'black'}} style= {{pagingEnabled: true}} onScroll={this.updateContent}>
          {this.state.pokemonresponse.map((item, index) => (
            <PokemonList name = {item.name} index= {index + 1} key={index}/>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  listItem: {
    color: 'black',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
