const fs = require('fs')
const inquirer = require('./inquirer')
const axios = require('axios').default

module.exports = {
  flushDb: async () => {
    await axios
      .delete('http://localhost:8080/emulator/v1/projects/db-abstract/databases/(default)/documents')
      .catch(err => {
        console.error(err)
      })
  }
}
