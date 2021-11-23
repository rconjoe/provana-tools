const functions = require('./functions')
const admin = require('./admin')

module.exports = {
  giveSupporter: async (email, username, password) => {
    const registerSupporter = functions
      .functions.httpsCallable('registerSupporter')
    await registerSupporter({
      email: email,
      password: password,
      username: username,
    })
    .catch(err => console.error(err))
    const dbsupporter = await admin.auth.getUserByEmail(email)
      await admin.fs.collection('supporters')
        .doc(dbsupporter.uid)
        .update({
          avatar: 'http://placekitten.com/400/400',
          banner: 'http://placekitten.com/1900/900',
          timezone: 'America/Los_Angeles',
        })
    console.log(`\n Successful supporter creation. Login with: \n \n Email: ${email} \n Password: ${password} \n `)
  },

  giveCreator: async (email, username, password, onboarded) => {
    let inv = await module.exports.giveInvitation()
    const registerCreator = functions
      .functions.httpsCallable('registerCreator')
    await registerCreator({
      email: email,
      password: password,
      code: inv,
      username: username,
    })
    .catch(err => console.error(err))
    let dbcreator = await admin.auth.getUserByEmail(email)
    if (onboarded === true) {
      await admin.fs.collection('creators')
        .doc(dbcreator.uid)
        .update({
          onboarded: true,
          avatar: 'http://placekitten.com/400/400',
          banner: 'http://placekitten.com/1900/900',
          facebook: 'zucc',
          timezone: 'America/Los_Angeles',
          twitch: 'sometwitchprofile',
          twitter: 'twitterprofile',
          youtube: 'youtubeprofile'
        })
      .catch(err => console.error(err))
    }
    console.log(`\n Successful creator creation. Login with: \n \n Email: ${email} \n Password: ${password} \n `)
  },

  mockDiscordId: () => {
    const code = []
    const characters = '0123456789'
    for (let i=0; i<9; i++) {
      code.push(characters.charAt(Math.floor(Math.random() * characters.length)))
    }
    return code.join('')
  },

  giveInvitation: async () => {
    let getOrCreateInvitation = functions
      .functions.httpsCallable('getOrCreateInvitation')
    let inv = await getOrCreateInvitation({ discordUserID: module.exports.mockDiscordId() })
    return inv.data
  },

  registerBotUser: async () => {
    await admin.auth.createUser({
      email: 'noreply@provana.gg',
      password: '99PZCsQeJnUdQ8u4VGUPCYPk',
      displayName: 'pvadminbot'
    })
    .catch(err => console.error(err))
    console.log(`\n BOT BOI CREATED`)
  },
}
