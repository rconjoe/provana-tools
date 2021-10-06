const { CloudTasksClient } = require('@google-cloud/tasks')
const { credentials } = require('@grpc/grpc-js')
const client = new CloudTasksClient({
  port: 8001,
  servicePath: 'localhost',
  sslCreds: credentials.createInsecure()
})

module.exports = {
  scheduleTask: async (queue, payload) => {
    let p = {
      project: 'db-abstract',
      queue: queue,
      location: 'us-central1',
      payload: payload,
      url: 'https://us-central1-db-abstract.cloudfunctions.net/startSlot',
    }
    p = client.queuePath(p.project, p.location, p.queue)
    let t = {
      httpRequest: {
        httpMethod: 'POST',
        url: p.url,
        body: Buffer.from(payload).toString('base64'),
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      },
      scheduleTime: { seconds: 60 + Date.now() / 1000 }
    }
    let req = {parent: p, task: t}
    let [response] = await client.createTask(req)
      .catch(err => {
        console.error(err)
      })
      .catch(err => {
        console.error(err)
      })
    return response.name
  }
}

