const inquirer = require('../inquirer')
const assertions = require('../assertions')
const devUtils = require('../developerUtilities')

module.exports = {
  default: async () => {
    let chooseUserType = await inquirer.chooseUserType()
    switch (chooseUserType.usertype) {
      case 'Creator':
        let c_username = await inquirer.enterUsername()
        let c_email = await inquirer.enterEmail()
        let c_password = await inquirer.enterPass()
        let c_chooseOnboarded = await inquirer.chooseOnboarded()
        if (c_chooseOnboarded.onboarded === 'Obviously') {
          await devUtils.giveCreator(
            c_email.email, c_username.username, c_password.pass, true
          )
        }
        else {
          await devUtils.giveCreator(
            c_email.email, c_username.username, c_password.pass, false
          )
        }
        return
      case 'Supporter':
        let s_username = await inquirer.enterUsername()
        let s_email = await inquirer.enterEmail()
        let s_password = await inquirer.enterPass()
          await devUtils.giveSupporter(
            s_email.email, s_username.username, s_password.pass
          )
        return
      case 'Get Alpha Partner invitation code':
        let inv = await devUtils.giveInvitation()
        console.log(`\n Invitation code: \n \n ${inv}\n `)
        return
      case 'Staff':
        console.log('\n This no work yet :(')
        return
      case 'Discord bot':
        await devUtils.registerBotUser()
        return
    }
  }
}
