const inquirer = require('inquirer')

module.exports = {
  chooseCategory: () => {
    const categoryPrompt = [{
      name: 'category',
      message: '\n ᕕ(⌐■_■)ᕗ ♪♬ \n What can I help you with?',
      type: 'list',
      choices: [
        'Simulate User Input (Client SDK)',
        'Functions Testing (Admin SDK)',
        'Generate Test Users',
        'Generate Test Data',
        'Flush Emulators',
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
        'Published -> Cancelled (empty)',
        'Published -> Cancelled (1 booked)',
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

  chooseUserType: () => {
    const userPrompt = [{
      name: 'usertype',
      message: 'What user type would you like to mock?',
      type: 'list',
      choices: [
        'Creator',
        'Supporter',
        'Get Alpha Partner invitation code',
        'Staff',
        'Discord bot',
      ]
    }]
    return inquirer.prompt(userPrompt)
  },

  enterEmail: () => {
    const emailPrompt = [{
      name: 'email',
      message: 'Enter an email for the test account.',
      type: 'input'
    }]
    return inquirer.prompt(emailPrompt)
  },

  enterSessionEmail: () => {
    const sessionEmailPrompt = [{
      name: 'email',
      message: 'Enter the email of a registered creator.',
      type: 'input'
    }]
    return inquirer.prompt(sessionEmailPrompt)
  },

  enterSessionSlots: () => {
    const sessionSlotsPrompt = [{
      name: 'slots',
      message: 'Enter how many slots for this session.',
      type: 'input'
    }]
    return inquirer.prompt(sessionSlotsPrompt)
  },

  enterUsername: () => {
    const usernamePrompt = [{
      name: 'username',
      message: 'Enter a username for the test account.',
      type: 'input'
    }]
    return inquirer.prompt(usernamePrompt)
  },

  enterPass: () => {
    const passPrompt = [{
      name: 'pass',
      message: 'Enter a password for the test account.',
      type: 'input'
    }]
    return inquirer.prompt(passPrompt)
  },

  chooseOnboarded: () => {
    const onboardedPrompt = [{
      name: 'onboarded',
      message: 'Do you want this creator to already be Stripe-onboarded?',
      type: 'list',
      choices: [
        'Obviously',
        "No, I'm testing that"
      ]
    }]
    return inquirer.prompt(onboardedPrompt)
  },

  yousure: () => {
    const confirmPrompt = [{
      name: 'yep',
      message: 'Are you sure? You will lose all of your data on export if you do this.',
      type: 'confirm'
    }]
    return inquirer.prompt(confirmPrompt)
  },

  chooseDataType: () => {
    const dataPrompt = [{
      name: 'dataType',
      message: '\n What kind of data to mock?',
      type: 'list',
      choices: [
        'Create Session/Slots',
        'Book Existing Slot',
      ]
    }]
    return inquirer.prompt(dataPrompt)
  },

  chooseSlotToBook: (slots) => {
    const slotToBookPrompt = [{
      name: 'slot',
      message: '\n Which slot? Check IDs in the emulator if you need to (sorry...)',
      type: 'list',
      choices: slots
    }]
    return inquirer.prompt(slotToBookPrompt)
  },

  chooseEmulators: () => {
    const emulatorsPrompt = [{
      name: 'emulators',
      message: 'Should this point at emulators? If not, it will use resources from project pv-dev.',
      type: 'confirm'
    }]
    return inquirer.prompt(emulatorsPrompt)
  },

}
