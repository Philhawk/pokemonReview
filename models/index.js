var Sequelize = require('sequelize')
var db = new Sequelize('postgres:localhost:5432/pokemon')

var Pokemon = db.define('pokemon', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

var Trainer = db.define('trainer', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

Trainer.hasMany(Pokemon)

module.exports = {
  Trainer: Trainer,
  Pokemon: Pokemon,
  db: db
}
