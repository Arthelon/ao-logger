const MightLogger = require('../../might-logger')
const MemoryStorage = require('../../storage/memory-storage')
const Logger = require('../../utils/logger')
const ParserError = require('../parser-error')

const name = 'Might'

function handle(event) {
  const { type, playerNames, mightAmounts } = parse(event)
  Logger.debug('MightEvt: ', type)
  for (let idx = 0; idx < playerNames.length; idx++) {
    MemoryStorage.might.set(
      type,
      playerNames[idx],
      Math.round(mightAmounts[idx] / 1000)
    )
  }
  MightLogger.write(MemoryStorage.might.serialize())
}

function parse(event) {
  const type = event.parameters[1]
  const playerNames = event.parameters[6]
  const mightAmounts = event.parameters[7]

  return { type, playerNames, mightAmounts }
}

module.exports = { name, handle, parse }
