const inquirer = require('inquirer')


const ListOfEndpoints = [
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

  chooseFunction: () => {
    const functionPrompt = [{
      name: 'functions',
      message: 'Choose a Cloud Function to test. Provana-tools will scaffold all your mocks and run the function. You can write your own expectations, or breakpoint debug.',
      type: 'list',
      choices: ListOfEndpoints
    }]
    return inquirer.prompt(functionPrompt)
  }

}
