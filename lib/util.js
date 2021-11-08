const fs = require('fs')
const inquirer = require('./inquirer')
const axios = require('axios').default

module.exports = {
  flushDb: async () => {
    await axios
      .delete('http://localhost:8080/emulator/v1/projects/pv-dev-4e2c2/databases/(default)/documents')
      .catch(err => {
        console.error(err)
      })
    console.log('Flushed Firestore!')
  },

  flushAuth: async () => {
    await axios
      .delete('http://localhost:9099/emulator/v1/projects/pv-dev-4e2c2/accounts')
      .catch(err => {
        console.error(err)
      })
    console.log('Flushed Auth!')
  },
}
