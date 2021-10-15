const inquirer = require('../inquirer')
const assertions = require('../assertions')
const functions = require('../functions')
const db = require("../db")

module.exports = {
    default: async () => {
        let registerSupporter_ready = await inquirer.ready()
        if (registerSupporter_ready.ready === true) {
          let registerSupporter_assertions = await inquirer.assertions()
          if (registerSupporter_assertions.assertions === true) {
            console.log('\n Please wait...')
            await functions.registerSupporter()
            setTimeout(async () => {
              await assertions.registerSupporter()
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
            await functions.registerSupporter()
          }
        }
    }
}
