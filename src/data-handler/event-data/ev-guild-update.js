const MemoryStorage = require('../../storage/memory-storage')
const Logger = require('../../utils/logger')
const ParserError = require('../parser-error')
const util = require('util')

const name = 'EvGuildUpdate'

function handle(event) {
  const { playerNames, playersOnline } = parse(event)
  const onlinePlayerList = playerNames.filter((_, idx) => playersOnline[idx])
  console.info(
    `Player online list: ${util.inspect(onlinePlayerList, false, null, false)}`
  )
  Logger.info(util.inspect(onlinePlayerList, false, null, false))

  // Storage
  const onlinePlayerMapping = {}
  for (let i = 0; i < playerNames.length; i++) {
    onlinePlayerMapping[playerNames[i]] = playersOnline[i]
  }
  MemoryStorage.guildiesOnline.init(onlinePlayerMapping)
  console.log(MemoryStorage.guildiesOnline.getAll())
}

function parse(event) {
  const playerNames = event.parameters[2]
  const playersOnline = event.parameters[3]

  if (!Array.isArray(playerNames) || !Array.isArray(playersOnline)) {
    throw new ParserError('EvGuildUpdate has invalid player name parameters')
  }

  if (playerNames.length !== playersOnline.length) {
    throw new ParserError(
      'EvGuildUpdate - players list doesnt match online list'
    )
  }
  return { playerNames, playersOnline }
}

module.exports = { name, handle, parse }
