process.on('uncaughtException', async (error) => {
  console.error(error)

  await new Promise((resolve) => setTimeout(resolve, 25000))
})

process.on('unhandledRejection', async (reason) => {
  console.error(reason)

  await new Promise((resolve) => setTimeout(resolve, 25000))
})

const LootLogger = require('./loot-logger')
const GuildPlayersLogger = require('./guild-players-logger')
const MightLogger = require('./might-logger')

const path = require('path')

const { green, red, cyan, yellow } = require('./utils/colors')
const AlbionNetwork = require('./network/albion-network')
const checkNewVersion = require('./check-new-version')
const DataHandler = require('./data-handler/data-handler')
const Items = require('./items')
const KeyboardInput = require('./keyboard-input')

const Config = require('./config')

main()

async function main() {
  setWindowTitle(Config.TITLE)

  console.info(`${Config.TITLE}\n`)

  await Promise.all([checkNewVersion(), Items.init()])

  try {
    await Config.init()
  } catch (error) {
    console.info(
      yellow(
        `    Problem fetching configurations. Try again or download the latest version.`
      )
    )

    await new Promise((resolve) => setTimeout(resolve, 20000))

    return process.exit(1)
  }

  AlbionNetwork.on('add-listener', (device) => {
    console.info(`Listening to ${device.name}`)
  })

  AlbionNetwork.on('event-data', DataHandler.handleEventData)
  AlbionNetwork.on('request-data', DataHandler.handleRequestData)
  AlbionNetwork.on('response-data', DataHandler.handleResponseData)

  AlbionNetwork.on('online', () => {
    console.info(
      `\n\t${green('ALBION DETECTED')}. Loot events should be logged.\n`
    )
    setWindowTitle(`[ON] ${Config.TITLE}`)
  })

  AlbionNetwork.on('offline', () => {
    console.info(
      `\n\t${red('ALBION NOT DETECTED')}.\n\n\tIf Albion is running, press "${
        Config.RESTART_NETWORK_FILE_KEY
      }" to restart the network listeners or restart AO Loot Logger.\n`
    )

    setWindowTitle(`[OFF] ${Config.TITLE}`)
  })

  AlbionNetwork.init()

  KeyboardInput.on('key-pressed', (key) => {
    const CTRL_C = '\u0003'

    switch (key) {
      case CTRL_C:
        return exit()

      case Config.RESTART_NETWORK_FILE_KEY.toLocaleLowerCase():
      case Config.RESTART_NETWORK_FILE_KEY.toUpperCase():
        return restartNetwork()

      case Config.ROTATE_LOGGER_FILE_KEY.toLocaleLowerCase():
      case Config.ROTATE_LOGGER_FILE_KEY.toUpperCase():
        return rotateLogFile()
    }
  })

  KeyboardInput.init()

  console.info(
    [
      '',
      `Loot Logs will be written to ${path.join(
        process.cwd(),
        LootLogger.logFileName
      )}`,
      `Guild Player Logs will be written to ${path.join(
        process.cwd(),
        GuildPlayersLogger.logFileName
      )}`,
      `Might amounts will be written to ${path.join(
        process.cwd(),
        MightLogger.logFileName
      )}`,
      '',
      `You can always press "${Config.ROTATE_LOGGER_FILE_KEY}" to start a new log file.`,
      '',
      `Join the Discord server: ${cyan(
        'https://discord.gg/fvNMF2abXr'
      )} (Ctrl + click to open).`
    ].join('\n')
  )
}

function restartNetwork() {
  console.info(`\n\tRestarting network listeners...\n`)

  AlbionNetwork.close()
  AlbionNetwork.init()

  setWindowTitle(Config.TITLE)
}

function setWindowTitle(title) {
  process.stdout.write(
    String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7)
  )
}

function exit() {
  console.info('Exiting...')

  process.exit(0)
}

function rotateLogFile() {
  LootLogger.close()
  LootLogger.createNewLogFileName()

  console.info(
    `From now on, logs will be written to ${path.join(
      process.cwd(),
      LootLogger.logFileName
    )}. The file is only created when the first loot event is detected.\n`
  )
}
