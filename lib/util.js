const fs = require('fs')
const inquirer = require('./inquirer')
const axios = require('axios').default

module.exports = {
  readcfg: () => {
    fs.readFile(`${process.cwd()}/.config.json`, 'utf8', async (err, json) => {
      if (err) {
        const path = await inquirer.inquirePath()
        console.log(path)
        return
      }
      try {
        const cfg = JSON.parse(json)
        console.log(cfg)
      }
      catch (err) {
        console.log(err)
      }
    })
  },
  writePath: (path) => {
    const conf = {
      "path": path
    }
    const str = JSON.stringify(conf)
    fs.writeFile('.config.json', str, err => {
      if (err) {
        console.error('\n Write error', err)
      }
      else {
        console.log('\n Config updated!')
      }
    })
  },
  flushDb: async () => {
    await axios
      .delete('http://localhost:8080/emulator/v1/projects/db-abstract/databases/(default)/documents')
      .catch(err => {
        console.error(err)
      })
  }
}
