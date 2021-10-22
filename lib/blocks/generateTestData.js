const inquirer = require('../inquirer')
const admin = require('../admin')
const functions = require('../functions')

module.exports = {
  default: async () => {
    let chooseDataType = await inquirer.chooseDataType()
    switch(chooseDataType.dataType) {
      case 'Session/Slots':
        let ses_email = await inquirer.enterSessionEmail()
        let ses_slots = await inquirer.enterSessionSlots()
        let ses_mf = await inquirer.chooseMF()
        let existingCreator = await admin.auth.getUserByEmail(ses_email.email)
        let svc = await functions.createService(ses_email.email, ses_slots.slots, ses_mf.mf, existingCreator.uid)
        await admin.setPotential(svc)
        await functions.publishPotential(existingCreator.uid)
        console.log('get fucked')
    }
  }
}
