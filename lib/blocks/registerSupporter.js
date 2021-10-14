const inquirer = require('../inquirer')
const assertions = require('../assertions')
const util = require('../util')
const admin = require('../admin')
const db = require("../db")

module.exports = {
    default: async () => {
        const createSupporter = await admin.mockSupporter([1]);
        const newSupporter = createSupporter[0];
        const wantAssertions = await inquirer.assertions();
        if(wantAssertions.assertions == true) {            
            return assertions.registerSupporter(newSupporter)
        }
        return console.log(newSupporter)
    }
}