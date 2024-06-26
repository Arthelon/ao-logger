const fs = require('fs')

class GuildPlayersLogger {
  constructor() {
    this.logFileName = null

    this.createNewLogFileName()
  }

  createNewLogFileName() {
    const d = new Date()

    const datetime = [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    ]
      .map((n) => n.toString().padStart(2, '0'))
      .join('-')

    this.logFileName = `guild-players-${datetime}.txt`
  }

  write(output) {
    fs.writeFile(
      this.logFileName,
      output,
      {
        encoding: 'utf8',
        flag: 'w'
      },
      () => {}
    )
  }
}

module.exports = new GuildPlayersLogger()
