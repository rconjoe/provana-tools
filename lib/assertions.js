let admin = require('./admin')
const db = require('./db')
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
    else if (task.data().task === undefined) throw new Error('\n Fail! Error in task document data.')
    else console.log('\n Success! Holding task scheduled.')
  },

  onSlotBooked: async (slot) => {
    let parentRef = admin.fs
      .collection('sessions')
      .doc(slot.parentSession)
    let parent = await parentRef.get()
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

  bookedToCancelled: async (slot) => {
    let cancellation = await admin
      .fs
      .collection('cancellations')
      .get()
    if (cancellation.empty) throw new Error('\n Fail! \n Cancellation not found.')
    if (cancellation.docs[0].data().cancelledBy !== slot.buyerUid) throw new Error (`\n Fail! \n Error in cancellation data (cancelledBy: ${cancellation.docs[0].data().cancelledBy })`)
    let parent = await admin
      .fs
      .collection('sessions')
      .doc(slot.parentSession)
      .get()
    if (parent.data().booked !== 0) throw new Error('\n Fail! Session did not decrement')
    let chatroom = await admin
      .fs
      .collection('chats')
      .doc(slot.parentSession)
      .get()
    if (!chatroom.exists) throw new Error('\n Fail! \n Chatroom not found.')
    if (chatroom.data().users[0] === slot.buyerUid ||
        chatroom.data().users[1] === slot.buyerUid)
    throw new Error('\n Fail! \n Buyer still found in chatroom users array.')
    let task = await admin.fs
      .collection('tasks')
      .doc(slot.id)
      .get()
    if (task.exists) throw new Error(`\n Fail! \n Task should not be here anymore for slot ${slot.id}`)
    let notif = await admin.fs
      .collection('notifications')
      .doc(slot.sellerUid)
      .collection('notif')
      .get()
    if (notif.docs[0].data().category !== 'Cancellation') throw new Error(`\n Fail! \n Error in notifiation data: ${notif.docs[0].data()}`)
    let updatedSlot = await admin
      .fs
      .collection('sessions')
      .doc(slot.parentSession)
      .collection('slots')
      .doc(slot.id)
      .get()
    if (!updatedSlot.exists) throw new Error('\n Fail! \n Slot not found.')
    if (updatedSlot.data().status !== 'published') throw new Error(`\n Fail! \n Republish Error (status was ${updatedSlot.data().status})`)
    if (updatedSlot.data().paymentIntent !== '') throw new Error(`\n Fail! \n Republish Error (pi was ${updatedSlot.data().paymentIntent})`)
    if (updatedSlot.data().buyerUid !== '') throw new Error(`\n Fail! \n Republish Error (buyerUid was ${updatedSlot.data().buyerUid})`)
    if (updatedSlot.data().buyerUsername !== '') throw new Error(`\n Fail! \n Republish Error (buyerUsername was ${updatedSlot.data().buyerUsername})`)
    else console.log('\n Pass! All checks passed for simple buyer cancel.')
  },

  bookedToCancelled_full: async (slot) => {
    let cancellation = await admin
      .fs
      .collection('cancellations')
      .get()
    if (cancellation.empty) throw new Error('\n Fail! \n Cancellation not found.')
    if (cancellation.docs[0].data().cancelledBy !== slot.buyerUid) throw new Error (`\n Fail! \n Error in cancellation data (cancelledBy: ${cancellation.docs[0].data().cancelledBy })`)
    let parent = await admin
      .fs
      .collection('sessions')
      .doc(slot.parentSession)
      .get()
    if (parent.data().booked !== 2) throw new Error('\n Fail! Session did not decrement')
    if (parent.data().status !== 'published') throw new Error(`\n Fail! Session status didn't change: ${parent.data()}`)
    let chatroom = await admin
      .fs
      .collection('chats')
      .doc(slot.parentSession)
      .get()
    if (!chatroom.exists) throw new Error('\n Fail! \n Chatroom not found.')
    if (chatroom.data().users[0] === slot.buyerUid ||
        chatroom.data().users[1] === slot.buyerUid)
    throw new Error('\n Fail! \n Buyer still found in chatroom users array.')
    let task = await admin.fs
      .collection('tasks')
      .doc(slot.id)
      .get()
    if (task.exists) throw new Error(`\n Fail! \n Task should not be here anymore for slot ${slot.id}`)
    let notifq = await admin.fs
      .collection('notifications')
      .doc(slot.sellerUid)
      .collection('notif')
      .where('category', '==', 'Cancellation')
      .get()
    if (notifq.empty) throw new Error(`\n Fail! \n Missing notification.`)
    let updatedSlot = await admin
      .fs
      .collection('sessions')
      .doc(slot.parentSession)
      .collection('slots')
      .doc(slot.id)
      .get()
    if (!updatedSlot.exists) throw new Error('\n Fail! \n Slot not found.')
    if (updatedSlot.data().status !== 'published') throw new Error(`\n Fail! \n Republish Error (status was ${updatedSlot.data().status})`)
    if (updatedSlot.data().paymentIntent !== '') throw new Error(`\n Fail! \n Republish Error (pi was ${updatedSlot.data().paymentIntent})`)
    if (updatedSlot.data().buyerUid !== '') throw new Error(`\n Fail! \n Republish Error (buyerUid was ${updatedSlot.data().buyerUid})`)
    if (updatedSlot.data().buyerUsername !== '') throw new Error(`\n Fail! \n Republish Error (buyerUsername was ${updatedSlot.data().buyerUsername})`)
    else console.log('\n Pass! All checks passed for buyer cancelling 1 slot on full session.')
  },

  registerSupporter: async (supporter) => {
    const supporterList = await admin.fs.collection('supporters').doc(supporter.uid).get();
    const dbSupporter = supporterList.data();
    if(dbSupporter.uid == '' ) throw new Error('\n Fail! \n No Supporter not found.');
    if(supporter.email !== dbSupporter.email) throw new Error(`\n Fail! \n Generated user email was ${supporter.email}  \n rather than supporter1@emulator.com`)
    if(supporter.username !== dbSupporter.username) throw new Error(`\n Fail! \n Generated username was ${supporter.username}  \n rather than emulatedSupporter1`)
    if(supporter.timezone !== dbSupporter.timezone) throw new Error(`\n Fail! \n Generated timezone was ${supporter.timezone}  \n rather than America/New_York`)
    if(supporter.customer !== dbSupporter.customer) throw new Error(`\n Fail! \n Generated stripe customer id was ${supporter.customer}  \n rather than cus_123`)
    if(supporter.avatar !== dbSupporter.avatar) throw new Error(`\n Fail! \n Generated avatar url was ${supporter.avatar}  \n rather than http://placekitten.com/400/400`)
    if(supporter.banner !== dbSupporter.banner) throw new Error(`\n Fail! \n Generated banner url was ${supporter.banner}  \n rather than http://placekitten.com/400/400`)
    if(supporter.online !== dbSupporter.online) throw new Error(`\n Fail! \n Generated online status was ${supporter.online}  \n rather than false`)
    else return console.log('\n Pass! All data matched the data in firestore!')
  },

}
