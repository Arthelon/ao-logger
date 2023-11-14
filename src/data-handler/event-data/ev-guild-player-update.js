const MemoryStorage = require('../../storage/memory-storage')
const Logger = require('../../utils/logger')
const ParserError = require('../parser-error')
const GuildPlayersLogger = require('../../guild-players-logger')

const name = 'EvGuildPlayerUpdate'

function handle(event) {
  const { playerName, onlineStatus } = parse(event)
  if (onlineStatus === false) {
    Logger.info(`${playerName} has gone offline`)
    console.info(`${playerName} has gone offline`)
  }
  MemoryStorage.guildiesOnline.set(playerName, onlineStatus)
  Logger.debug(
    `EvGuildPlayerUpdate - ${playerName} online status: ${onlineStatus}`
  )
  GuildPlayersLogger.write(MemoryStorage.guildiesOnline.getOnlineSerialized())
}

function parse(event) {
  const playerName = event.parameters[1]
  const onlineStatus = !!event.parameters[2]

  if (typeof playerName !== 'string') {
    throw new ParserError(
      'EvGuildPlayerUpdate has invalid player name parameters'
    )
  }

  return { playerName, onlineStatus }
}

module.exports = { name, handle, parse }
