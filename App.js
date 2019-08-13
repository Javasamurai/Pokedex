import React, { Component } from 'react';
import { Button, ScrollView, Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';


class PokemonList extends Component {
  state = {
    clicked: false,
    baseColor: "#ecf0f1",
    clickedColor: "#2980b9"
  }

  onClickPokemon(id) {
    this.setState({
      clicked: true
    });
    this.props.updateView(true)
  }
  render() {
    return (
    <View style= {styles.listItem} onTouchStart= {()=>this.onClickPokemon(this.props.index)} onTouchEnd = {() =>this.setState({clicked: true})}>
        <Text style = {{flex: 1, fontFamily: "Early-GameBoy", fontSize: 15, color: "white"}}>{this.props.index}. {this.props.name}</Text>
      <Image source = {{uri:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+ this.props.index +'.png'}} style= {{flex: 0.5, width: 100, height: 100}}></Image>
    </View>
    )
  }
}

class PokemonInfo extends Component {
  render() {
    <View>
      <Image source = {{uri:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'}} style= {{flex: 0.5, width: 100, height: 100}}></Image>
    </View>
  }
}

export default class App extends Component {
  constructor(props){
    super(props);
    this.spinValue = new Animated.Value(0);
    this.state.pokemonresponse = [{}];
  }
  state = {
    pokemonresponse: [{}],
    test: ""
  }
  fetchPokemons(next) {
    let that = this;

    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 500
    }).start()

    fetch( next ? next : 'https://pokeapi.co/api/v2/pokemon')
    .then((response) => response.json())
    .then((responseJSON) => {
      let pokemonList = this.state.pokemonresponse;
      
      if(next) {
        responseJSON.results.forEach(element => {
          pokemonList.push(element)
        });
      }
      that.setState({
        pokemonresponse: pokemonList,
        next: responseJSON.next
      });
    })
  }
  componentDidMount() {
    this.fetchPokemons()
  }
  updateContent(evt) {
    this.setState({
      test: evt.nativeEvent.contentOffset.y + ":" + styles.listItem.height * this.state.pokemonresponse.length
    })
    if(evt.nativeEvent.contentOffset.y > (styles.listItem.height * this.state.pokemonresponse.length) / 2) {
      this.fetchPokemons(this.state.next);
    }
  }
  updateView(info) {
    this.setState({
      info: info
    })
  }
  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });
    if (this.state.info) {
      return (<PokemonInfo/>)
    } else {
      return (
        <View style = {styles.main_container}>
          <View style ={{backgroundColor: '#FBD32C',alignItems: 'center', justifyContent: 'center', height: 120}}>
            <Animated.Image source = {require('./pokeball.png')} style= {{ width: 100, height: 100, transform: [{rotate: spin}]}}/>
          </View>
  
          {/* <Text>{this.state.test} dsfs</Text> */}
          <ScrollView id= "sv" bounces= {true} bouncesZoom = {true} alwaysBounceVertical= {true} style = {{flex: 3, pagingEnabled: true}} onScroll={this.updateContent.bind(this)}>
            {this.state.pokemonresponse.map((item, index) => (
              <PokemonList item ={item.name} name = {item.name} index= {index + 1} key={index} updateView={()=> this.updateView}/>
            ))}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  listItem: {
    color: 'black',
    flexDirection: 'row',
    paddingTop: 20,
    paddingEnd: 20,
    paddingLeft: 10,
    paddingRight: 10,
    height: 125,
    backgroundColor: '#34495e',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
