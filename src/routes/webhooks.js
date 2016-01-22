import { subscribed } from '../channels'

module.exports = {
  method: 'POST',
  path: '/webhooks',
  handler: function (request, reply) {
    
    request.payload.events.forEach(event => {
      if (event.name === 'channel_occupied') {
        subscribed[event.channel] = true
      } else if (event.name === 'channel_vacated') {
        subscribed[event.channel] = false
      }
      
    })
    
    reply()
    
  },
  config: {
    description: 'Recieves Pusher.com webhooks, and updates channel status'
  }
}