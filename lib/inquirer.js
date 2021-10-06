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
        'Cancelled -> Published',
        'Active -> Disputed',
        'Disputed -> Resolved+',
        'Disputed -> Resolved-',
      ]
    }]
    return inquirer.prompt(slotStatusPrompt)
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
