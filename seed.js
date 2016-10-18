const Models = require('./models');
const Pokemon = Models.Pokemon;
const Trainer = Models.Trainer;
const Chance = require('chance');
const chance = new Chance()
const Promise = require('bluebird')



function makePokemon () {
  let arr = new Array(50).fill(0);
  let pokemonTypes = ['water', 'fire', 'flying'];
  let pokemonNames = ['Pidgey', 'Charizard', 'Bulbasaur', 'Venusaur', 'Evee', 'Pikachu', 'Blastoise', 'Squirtle', 'Charmander']
  return Promise.all(arr.map(index => {
    let nameIdx = chance.integer({min: 0, max: pokemonNames.length -1});
    let pokemonIdx = chance.integer({min: 0, max: pokemonTypes.length -1});
    return Pokemon.create({name: pokemonNames[nameIdx], type: pokemonTypes[pokemonIdx]});
  }));
}

function makeTrainers () {
  let arr = new Array(10).fill(0);
  return Promise.all(arr.map(index => Trainer.create({name: chance.first()})))
}


Pokemon.sync({force: true})
.then(() => Trainer.sync({force: true}))
.then(() => makePokemon())
.then(() => makeTrainers())
