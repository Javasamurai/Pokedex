import React, { Component } from 'react';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';

import { TextInput, ScrollView, Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';


class PokemonList extends Component {
  state = {
    style: {
      color: 'black',
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: "#2c3e50",
      paddingTop: 20,
      paddingEnd: 20,
      paddingLeft: 10,
      paddingRight: 10,
      height: 125,
      backgroundColor: '#34495e',
      alignItems: 'center'  
    },
    clicked: false,
  }

  onClickPokemon(index, name) {
    this.setState({
      clicked: true
    });
    this.props.updateView(index, name);
  }
  render() {

    return (
    <View style= {this.state.style} onTouchStart={()=> this.setState({ borderTopWidth: 30, backgroundColor: '#95a5a6'})} onTouchCancel={()=>this.setState({ backgroundColor: '#34495e'})} onTouchEnd = {() =>this.onClickPokemon(this.props.index, this.props.name)}>
        {/* <Text style = {{flex: 1, fontFamily: "Early-GameBoy", fontSize: 15, color: "white"}}>{this.props.index}. {JSON.stringify(this.props)}</Text> */}
        <Text style = {{flex: 1, fontFamily: "Early-GameBoy", fontSize: 15, color: "white"}}>{this.props.index}. {this.props.name}</Text>
      <Image source = {{uri:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+ this.props.index +'.png'}} style= {{flex: 0.5, width: 100, height: 100}}></Image>
    </View>
    )
  }
}

class PokemonInfo extends Component {
  state = {
    name: this.props.name,
    index: this.props.index,
    pointer: 0,
    moves: [],
    types: [],
    weight: 0,
    img: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + this.props.index+ ".png"]
  }
  fetchPokemonData(index) {
    let that = this;

    fetch("https://pokeapi.co/api/v2/pokemon/" + index)
    .then((response) => response.json())
    .then((responseJSON) => {
      let img = this.state.img.length == 1 ? this.state.img : [];

      for (let key in responseJSON.sprites) {
        let sprite = responseJSON.sprites[key];
        
        if (sprite != null) {
          img.push(sprite);
        }
      }
      that.setState({
        img: img,
        moves: responseJSON.moves,
        data: responseJSON.sprites,
        types: responseJSON.types,
        weight: responseJSON.weight
      });
    });
  }
  changePokemon() {
    if (this.state.pointer < this.state.img.length) {
      this.setState({
        pointer: this.state.pointer + 1
      });
    } else {
      this.setState({
        pointer: 0
      });
    }

  }
  componentDidMount() {
    this.fetchPokemonData(this.props.index);
  }
  render() {
    return(
      <View style ={{backgroundColor: "#ecf0f1"}}>
        <Image source = {require('./left-arrow.png')} style= {{ width: 25, height: 25, margin: 20}} onTouchStart= {this.props.back}/>
        <View style ={{alignContent:"space-around", flexDirection: "row", padding: 20}}>
          <View style= {{backgroundColor: "#bdc3c7", borderColor: "black", borderRadius: 10, width: 175, height: 175, alignItems: "center"}}>
            <Image source = {{uri: this.state.img[this.state.pointer]}} style= {{flex: 4, width: 150, height: 150}} onTouchStart={()=>{this.changePokemon()}}></Image>
          </View>
          {/* <Text style={{fontFamily: "Early-GameBoy"}}>{this.state.name}</Text> */}
          <View style={{flex: 5, padding: 10}}>
            <Text style={{fontFamily: "Early-GameBoy", fontSize: 18}}>{this.state.name}</Text>
            <Text style= {{fontFamily: "Early-GameBoy"}}>Id: {this.props.index}</Text>
            <Text style= {{fontFamily: "Early-GameBoy"}}>weight: {this.state.weight}</Text>

            {this.state.types.map((type, index) => (
              <Text style= {{fontFamily: "Early-GameBoy"}} key={index}>Type: {type.type.name}</Text>
            ))}
          </View>
        </View>
        <View style={{backgroundColor: "#1abc9c"}}>
            <Text style ={{fontFamily: "Early-GameBoy", padding: 20}}>Moves List</Text>
              <ScrollView style ={{}}>
                {this.state.moves.map((move, index) => (
                  <Text style={{ fontFamily: "Early-GameBoy", color: "white", backgroundColor: "#34495e", padding: 10}} key={index}>{move.move.name}</Text>
                ))}
              </ScrollView>
        </View>
    </View>
    )
  }
}

export default class App extends Component {
  constructor(props){
    super(props);
    this.spinValue = new Animated.Value(0);
    this.state.pokemonresponse = [{}];
  }
  state = {
    pokemonresponse: [],
    test: ""
  }
  spin() {
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 500
    }).start();
  }
  fetchPokemons(next) {
    let that = this;

    if (this.state.loading) {
      return;
    }
    this.spin();

    this.setState({
      loading: true
    });
    fetch( next ? next : 'https://pokeapi.co/api/v2/pokemon')
    .then((response) => response.json())
    .then((responseJSON) => {
      let pokemonList = this.state.pokemonresponse;

      if(next) {
        responseJSON.results.forEach(element => {
          pokemonList.push(element)
        });
      } else {
        pokemonList = responseJSON.results;
      }
      that.setState({
        pokemonresponse: pokemonList,
        next: responseJSON.next,
        loading: false
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
  updateView(index, name_selected) {
    this.setState({
      index: index,
      name_selected: name_selected
    });
  }
  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    if (this.state.index != null) {
      return (<PokemonInfo index={this.state.index + 1} name ={this.state.name_selected} back= {()=> this.updateView(null, null)}/>)
    } else {
      return (
        <View style = {styles.main_container}>
          <View onTouchStart={()=>this.spin.bind(this)} style ={{backgroundColor: '#FBD32C', alignContent:'center', alignItems: 'center', justifyContent: 'center', height: 120}}>
            <Animated.Image source = {require('./pokeball.png')} style= {{ width: 100, height: 100, transform: [{rotate: spin}]}}/>
            {/* <TextInput style={{flex: 1, width: 50, height: 50, borderRadius: 5, borderWidth: 1, borderColor: "gray"}} value= {"dfklj"}></TextInput> */}
          </View>
  
          {/* <Text>{this.state.test} dsfs</Text> */}
          <ScrollView id= "sv" bounces= {true} bouncesZoom = {true} alwaysBounceVertical= {true} style = {{flex: 3, pagingEnabled: true}} onScroll={this.updateContent.bind(this)}>
            {this.state.pokemonresponse.map((item, index) => (
              <PokemonList item ={item.name} name = {item.name} index= {index + 1} key={index} updateView={()=> this.updateView(index, item.name)}/>
            ))}
          </ScrollView>
          {/* <AdMobBanner bannerSize="fullBanner" adUnitID="ca-app-pub-3940256099942544/6300978111" testDeviceID="EMULATOR"/> */}
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
    borderTopWidth: 1,
    borderColor: "#2c3e50",
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
