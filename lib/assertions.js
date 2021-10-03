let admin = require('./admin')
module.exports = {
  potentialToPublished: async () => {
    let qsession = await admin
      .fs
      .collection('sessions')
      .get()
    console.log('\n Checking slots...')
    let qslots = await qsession
      .docs[0]
      .ref
      .collection('slots')
      .get()
    if (qslots.size !== 3) throw new Error(`\n Fail! \n Expected 3 slots, but found ${qslots.size}`)
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
      ) throw new Error('\n Fail! \n Error in slot data: \n' + data)
    })
    console.log('\n Slots passed!! Checking chat room...')
    let chatq = await admin
      .fs
      .collection('chats')
      .get()
    if (chatq.size !== 1) throw new Error(`\n Fail! \nChat room query returned ${chatq.size}`)
    let chatroom = chatq.docs[0].data()
    if (
      chatroom.creator === "" ||
      chatroom.users.length !== 1 ||
      chatroom.title !== 'emulatedService'
    ) throw new Error(`\n Fail! \n Error in chat room data: \n`, chatroom)
    console.log('\n Success! All tests passed!')
  },

  onSessionFull: async (session) => {
    console.log('\n Session full, checking tasks...')
    let _task = await admin
      .fs
      .collection('tasks')
      .doc(session.id)
      .get()
    if (!_task.exists) {
      console.log(`\n Tasks OK. Checking notification...`)
    }
    else throw new Error('\n Fail! \n There should not be a task scheduling here, since this session is non-MF.')
    let notif = await admin
      .fs
      .collection('notifications')
      .doc(session.sellerUid)
      .collection('notif')
      .get()
    if (notif.size !== 1) throw new Error('\n Fail! Notification missing.')
    else {
      if (notif.docs[0].data().unread !== true) throw new Error('\n Fail! Error in notification data.')
      else console.log('\n Pass! Notification fired.')
    }
  },

  onSessionActive: async (id) => {
    console.log('\n Session active, checking notifications...')
    let notif = await admin
      .fs
      .collection('notifications')
      .doc(id)
      .collection('notif')
      .get()
    if (notif.size !== 1) throw new Error('\n Fail! \n Expected to find a notification.')
    else {
      let data = notif.docs[0].data()
      if (data.unread !== true) throw new Error('\n Fail! \n Expected notification to be unread.')
      if (data.uid !== id) throw new Error('\n Fail! \n id field should equal sellerUid.')
      else console.log('\n Pass! Notification fired.')
    }
  },

  onSessionIncrement: async (id) => {
    console.log('\n Session incremented, booked === slots. Checking status...')
    let ses = await admin
      .fs
      .collection('sessions')
      .doc(id)
      .get()
    if (ses.data().status !== 'full') throw new Error(`\n Fail! \n Expected Session status to be full, but it was ${ses.data().status}`)
    console.log('\n Pass! Status updated to full.')
  },

  onSlotCheckout: async (slot) => {
    let task = await admin.fs
      .collection('tasks')
      .doc(slot.id)
      .get()
    if (!task.exists) throw new Error('\n Fail! Task not found.')
    else if (task.data().path === undefined) throw new Error('\n Fail! Error in task document data.')
    else console.log('\n Success! Holding task scheduled.')
  },

  onSlotBooked: async (slot) => {
    let _parent = admin.fs
      .collection('sessions')
      .doc(slot.parentSession)
    let parent = await _parent.get()
    if (parent.data().booked !== 1) throw new Error(`\n Fail! \n Expected booked to be 1, but it was ${parent.data().booked}`)
  else console.log('\n Booked value on parent incremented. Checking chatroom...')
    let room = await admin.fs
      .collection('chats')
      .doc(slot.parentSession)
      .get()
    if (!room.exists) throw new Error('\n Fail! \n Chatroom not found.')
    else console.log('\n Pass! \n Booked value incremented and chat room created.')
  },

  onSlotActive: async (buyerUid) => {
    let notif = await admin.fs
      .collection('notifications')
      .doc(buyerUid)
      .collection('notif')
      .get()
    if (notif.empty) throw new Error('\n Fail! Notification not found.')
    if (notif.docs[0].data().unread !== true) throw new Error('\n Fail! Notification data error (unread)' + {...notif.data()})
    if (notif.docs[0].data().category !== 'Starting') throw new Error('\n Fail! Notification data error (category)' + notif.data().category)
    else console.log('\n Pass! Notification fired to buyer on slot status active.')
  },

  publishedToActive: async (sellerUid) => {
    let notif = await admin.fs
      .collection('notifications')
      .doc(sellerUid)
      .collection('notif')
      .get()
    if (notif.empty) throw new Error('\n Fail! Notification not found.')
    if (notif.docs[0].data().unread !== true) throw new Error('\n Fail! Notification data error (unread)' + {...notif.data()})
    if (notif.docs[0].data().category !== 'Starting') throw new Error('\n Fail! Notification data error (category)' + notif.data().category)
    else console.log('\n Pass! Notification fired to seller on session status active.')
  },

  fullToActive: async (sellerUid) => {
    let notif = await admin.fs
      .collection('notifications')
      .doc(sellerUid)
      .collection('notif')
      .get()
    if (notif.empty) throw new Error('\n Fail! Notification not found.')
    if (notif.docs[0].data().unread !== true) throw new Error('\n Fail! Notification data error (unread)' + {...notif.data()})
    if (notif.docs[0].data().category !== 'Starting') throw new Error('\n Fail! Notification data error (category)' + notif.data().category)
    else console.log('\n Pass! Notification fired to seller on session status active.')
  },
}
