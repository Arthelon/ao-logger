const ContainersStorage = require('./containers-storage')
const LootsStorage = require('./loots-storage')
const PlayersStorage = require('./players-storage')
const GuildiesOnlineStorage = require('./guildies-online-storage')

class MemoryStorage {
  constructor() {
    this.containers = new ContainersStorage()
    this.loots = new LootsStorage()
    this.players = new PlayersStorage()
    this.guildiesOnline = new GuildiesOnlineStorage()
  }
}

module.exports = new MemoryStorage()
