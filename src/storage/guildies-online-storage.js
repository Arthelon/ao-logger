class GuildiesOnlineStorage {
  constructor() {
    this.guildMembers = null

    this.self = null
  }

  init(onlineMapping) {
    if (this.guildMembers != null) {
      throw new Error('Trying to init non-empty GuildiesOnlineStorage')
    }
    this.guildMembers = onlineMapping
  }

  set(playerName, value) {
    if (this.guildMembers == null) {
      throw new Error('Trying to set value of empty GuildiesOnlineStorage')
    }
    this.guildMembers[playerName] = value
  }

  getAll() {
    return this.guildMembers
  }
}

module.exports = GuildiesOnlineStorage
