const inquirer = require('../inquirer')
const assertions = require('../assertions')
const util = require('../util')
const admin = require('../admin')
const functions = require('../functions')
const db = require("../db")

module.exports = {
    default: async () => {
        const createSupporter = await admin.mockSupporter([1]);
        const newSupporter = createSupporter[0];
        const wantAssertions = await inquirer.assertions();
        if(wantAssertions.assertions == true) {                        
            console.log(`\n ${newSupporter}`);
            console.log( await assertions.registerSupporter(newSupporter));
        }
        return console.log(newSupporter);
    },

    anon: async () => {
        let newSupporter = await inquirer.anonCreateSupporter();
        if(newSupporter === 'start over') newSupporter = inquirer.anonCreateSupporter();


    }
}