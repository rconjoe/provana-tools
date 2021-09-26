const firebase = require('firebase')
require('firebase/firestore')
require('firebase/auth')
const cli = require('clui')

console.log('\nInitializing, please wait...\n')
const app = firebase.default.initializeApp({
  apiKey: "AIzaSyBBBrVHVYBo4Hrc3rtsdOaCjN33R-9ypjY",
  authDomain: "db-abstract.firebaseapp.com",
  projectId: "db-abstract",
  storageBucket: "db-abstract.appspot.com",
  messagingSenderId: "902848736944",
  appId: "1:902848736944:web:dcb4e3c650144a4001d575",
  measurementId: "G-T5C09WQSSN"
})

console.log('\nStarting Firestore...\n')
const db = app.firestore()

console.log('\nStarting Auth...\n')
app.auth().useEmulator('http://localhost:9099')
db.useEmulator('localhost', 8080)

console.log('\nSigning in creator@emulator.com...\n')
app.auth().signInWithEmailAndPassword('creator@emulator.com', 'creator')
  .then((user) => {
    console.log(`\n Logged in as ${user.user.email}, please wait...\n \n... \n`)
  })
  .catch(err => console.error(err))


module.exports = {
  publishSession: async () => {
    console.log('Simulating session publish...')
    return await db
    .collection('sessions')
    .doc('lBN1ujhFVC73C2PHmb1p')
    .update({
      status: 'published',
      color: 'blue'
    })
      .then(() => {
        console.log('\n Done. Happy debugging :) \n')
      })
    .catch(err => console.error(err))
  },
  checkoutSlot: async () => {
    console.log('Simulating slot checkout...')
    return await db
      .collection('sessions')
      .doc('lBN1ujhFVC73C2PHmb1p')
      .collection('slots')
      .doc('KwJ3akxqjM2Ibf1eWn86')
      .update({
        buyerUid: '123abc',
        buyerUsername: 'test',
        paymentIntent: 'pi_123',
        status: 'holding'
      })
  }
}
