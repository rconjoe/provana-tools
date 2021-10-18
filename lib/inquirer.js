const inquirer = require('inquirer')

module.exports = {
  chooseCategory: () => {
    const categoryPrompt = [{
      name: 'category',
      message: '\n ᕕ(⌐■_■)ᕗ ♪♬ \n What can I help you with?',
      type: 'list',
      choices: [
        'Simulate User Input (Client SDK)',
        'Functions Testing (Admin SDK)'
      ]
    }]
    return inquirer.prompt(categoryPrompt)
  },

  chooseAuth: () => {
    const authPrompt = [{
      name: 'auth',
      message: 'Who should I log in as?',
      type: 'list',
      choices: [
        'Creator',
        'Supporter',
        'Anonymous'
      ]
    }]
    return inquirer.prompt(authPrompt)
  },

  chooseCreatorAction: () => {
    const actionPrompt = [{
      name: 'action',
      message: 'Choose an action to simulate. \n ',
      type: 'list',
      choices: [
        'Create potential session',
        'Publish session',
      ]
    }]
    return inquirer.prompt(actionPrompt)
  },

  chooseSupporterAction: () => {
    const actionPrompt = [{
      name: 'action',
      message: 'Choose an action to simulate. \n *** Note: You must have the emulators running with the proper import for whichever option you choose. *** \n (see .exports/ folder in functions repo)',
      type: 'list',
      choices: [
        'Checkout slot'
      ]
    }]
    return inquirer.prompt(actionPrompt)
  },

  chooseAnonAction: () => {
    const actionPrompt = [{
      name: 'action',
      message: 'Choose an action to simulate',
      type: 'list',
      choices: [
        'Register New Supporter'
      ]
    }]
    return inquirer.prompt(actionPrompt);
  },

  chooseFunction: () => {
    const functionPrompt = [{
      name: 'functions',
      message: 'Choose a Cloud Function to test. Provana-tools will scaffold all your mocks and run the function. You can write your own expectations, or breakpoint debug.',
      type: 'list',
      choices: [
        'onSessionUpdate/',
        'onSlotUpdate/',
        'registerSupporter',
        'getOrCreateInvitation',
        'validateInvitation',
        'registerCreator',
        'stripeAccountOnboard',
        'stripeCompleteOnboard',
        'createService',
        'publishPotential',
        'checkout',
        'confirmCheckoutComplete',
        'checkoutComplete',
        'startSlot',
        'capture',
        'writeNewReview',
        'getRecentReviews',
        'getReviewScore'
      ]
    }]
    return inquirer.prompt(functionPrompt)
  },

  chooseMF: () => {
    const mfprompt = [{
      name: 'mf',
      message: 'What type of service?',
      type: 'list',
      choices: [
        'non-Mandatory Fill',
        'Mandatory Fill'
      ]
    }]
    return inquirer.prompt(mfprompt)
  },

  chooseSessionStatusChange: () => {
    const sessionStatusPrompt = [{
      name: 'sessionStatusChange',
      message: 'Choose a status change to trigger:',
      type: 'list',
      choices: [
        'Potential -> Published',
        'Published -> Full',
        'Published -> Active',
        'Published -> Cancelled',
        'Full -> Active',
        'Full -> Cancelled',
        'Active -> Succeeded',
        'Increment booked value to fill session'
      ]
    }]
    return inquirer.prompt(sessionStatusPrompt)
  },

  chooseSlotStatusChange: () => {
    const slotStatusPrompt = [{
      name: 'slotStatusChange',
      message: 'Choose a status change to trigger:',
      type: 'list',
      choices: [
        'Published -> Holding',
        'Holding -> Booked',
        'Booked -> Active',
        'Booked -> Cancelled (not full)',
        'Booked -> Cancelled (full)',
        'Active -> Disputed',
        'Disputed -> Resolved+',
        'Disputed -> Resolved-',
      ]
    }]
    return inquirer.prompt(slotStatusPrompt)
  },

  anonCreateSupporter: async () => {
    let newSupporter = {
      uid: '',
      customer: '',
      email: '',
      temp: '',
      username: '',
      timezone: '',
      avater: '',
      banner: '',
      online: false
    };

    await inquirer.prompt({
      type:'input',
      name:'email',
      message: 'Please enter a email address: '
    })
    .then((answer) => {
      newSupporter.email = answer;
    })

    await inquirer.prompt({
      type:'input',
      name:'pass',
      message: 'please enter a password'
    })
    .then((answer) => {
      newSupporter.temp = answer;
    })

    await inquirer.prompt({
      type:'input',
      name:"username",
      message:'Please enter a username: '
    })
    .then((answer) => {
      newSupporter.username = answer
    })

    await inquirer.prompt({
      type:'list',
      name:"timezone",
      choices: ["America/New_York"],
      message: 'Please select a timezone: ',
    })
    .then((answer) => {
      newSupporter.timezone = answer
    })

    await inquirer.prompt({
      type: 'list',
      name:'avatar',
      choices: ['http://placekitten.com/400/400', 'http://placekitten.com/200/200', 'http://provana.gg/fakeurl'],
      message: 'Please select a avater url: '
    })
    .then((answer) => {
      newSupporter.avater = answer
    })

    await inquirer.prompt({
      type: 'list',
      name:'banner',
      choices: ['http://placekitten.com/400/400', 'http://placekitten.com/200/200', 'http://provana.gg/fakeurl'],
      message: 'Please select a banner url: '
    })
    .then((answer) => {
      newSupporter.banner = answer
    })

    console.log(newSupporter)

    await inquirer.prompt({
      type:'input',
      name: 'confirm',
      message: 'Does this look correct? y/N'
    })
    .then((answer) => {
      if(answer.confirm === 'y' || answer.confirm === 'Y') {
        return newSupporter;
      }
      else {
        return newSupporter = 'start over'
      }
    })

    return newSupporter
  },

  ready: () => {
    const readyPrompt = [{
      name: 'ready',
      message: 'Scaffolding completed. Trigger change?',
      type: 'confirm'
    }]
    return inquirer.prompt(readyPrompt)
  },

  assertions: () => {
    const assertionPrompt = [{
      name: 'assertions',
      message: 'Do you want to run assertions after?',
      type: 'confirm'
    }]
    return inquirer.prompt(assertionPrompt)
  },
}
