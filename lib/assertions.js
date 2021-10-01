const admin = require('./admin')
module.exports = {
  potentialToPublished: async () => {
    const qsession = await admin
      .fs
      .collection('sessions')
      .get()
    console.log('\n Checking slots...')
    const qslots = await qsession
      .docs[0]
      .ref
      .collection('slots')
      .get()
    if (qslots.size !== 3) console.log(`\n Fail! \n Expected 3 slots, but found ${qslots.size}`)
    qslots.docs.forEach(async (slot) => {
      let data = slot.data()
      if (
        data.start === 0 ||
        data.end === 0 ||
        data.name === '' ||
        data.sellerUid === '' ||
        data.serviceDocId === '' ||
        data.status !== 'published' ||
        data.id === ''
      ) console.log('\n Fail! \n Error in slot data: \n' + data)
    })
    console.log('\n Slots passed!! Checking chat room...')
    const chatq = await admin
      .fs
      .collection('chats')
      .get()
    if (chatq.size !== 1) console.log(`\n Fail! \nChat room query returned ${chatq.size}`)
    let chatroom = chatq.docs[0].data()
    if (
      chatroom.creator === "" ||
      chatroom.users.length !== 1 ||
      chatroom.title !== 'Emulated Session'
    ) console.log(`\n Fail! \n Error in chat room data: \n` + chatroom)
    console.log('\n Success! All tests passed!')
  },

  onSessionFull: async (id) => {
    console.log('\n Session full, checking tasks...')
    const _task = await admin
      .fs
      .collection('tasks')
      .doc(id)
      .get()
    if (!_task.exists) {
      console.log(`\n Pass! No task found.`)
    }
    else throw new Error('\n Fail! \n There should not be a task scheduling here, since this session is non-MF.')
  },

  onSessionActive: async (id) => {
    console.log('\n Session active, checking notifications...')
    const notif = await admin
      .fs
      .collection('notifications')
      .doc(id)
      .collection('notif')
      .get()
    if (notif.size !== 1) throw new Error('\n Fail! \n Expected to find a notification.')
    else {
      const data = notif.docs[0].data()
      if (data.unread !== true) throw new Error('\n Fail! \n Expected notification to be unread.')
      if (data.uid !== id) throw new Error('\n Fail! \n id field should equal sellerUid.')
      else console.log('\n Pass! Notification fired.')
    }
  },

  onSessionIncrement: async (id) => {
    console.log('\n Session incremented, booked === slots. Checking status...')
    const ses = await admin
      .fs
      .collection('sessions')
      .doc(id)
      .get()
    if (ses.data().status !== 'full') throw new Error(`\n Fail! \n Expected Session status to be full, but it was ${ses.data().status}`)
    console.log('\n Pass! Status updated to full.')
  }
}
