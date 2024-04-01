const RequestData = require('./request-data')
const ResponseData = require('./response-data')
const EventData = require('./event-data')
const Logger = require('../utils/logger')
const ParserError = require('./parser-error')
const Config = require('../config')
const fs = require('fs')

class DataHandler {
  static handleEventData(event) {
    try {
      if (!event || event.eventCode !== 1) {
        return
      }

      const eventId = event?.parameters?.[252]

      switch (eventId) {
        case 100: // EvGuildPlayerUpdate
          return EventData.EvGuildPlayerUpdate.handle(event)
        case 99: // EvGuildUpdate
          return EventData.EvGuildUpdate.handle(event)

        default:
          if (process.env.LOG_UNPROCESSED)
            Logger.silly('handleEventData', event.parameters)
      }
    } catch (error) {
      if (error instanceof ParserError) {
        Logger.warn(error, event)
      } else {
        Logger.error(error, event)
      }
    }
  }

  static handleRequestData(event) {
    const eventId = event?.parameters?.[253]

    try {
      switch (eventId) {
        case Config.events.OpInventoryMoveItem:
          return RequestData.OpInventoryMoveItem.handle(event)

        default:
          if (process.env.LOG_UNPROCESSED)
            Logger.silly('handleRequestData', event.parameters)
      }
    } catch (error) {
      if (error instanceof ParserError) {
        Logger.warn(error, event)
      } else {
        Logger.error(error, event)
      }
    }
  }

  static handleResponseData(event) {
    const eventId = event?.parameters?.[253]
    const might = {}

    try {
      switch (eventId) {
        case 441: // Might ranking
          return ResponseData.Might.handle(event)
        case Config.events.OpJoin:
          return ResponseData.OpJoin.handle(event)

        default:
          if (process.env.LOG_UNPROCESSED)
            Logger.silly('handleResponseData', event.parameters)
      }
    } catch (error) {
      if (error instanceof ParserError) {
        Logger.warn(error, event)
      } else {
        Logger.error(error, event)
      }
    }
  }
}

module.exports = DataHandler
