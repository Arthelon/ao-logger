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

  getOnlineSerialized() {
    const onlineNames = Object.entries(this.guildMembers)
      .filter((entry) => entry[1])
      .map((entry) => entry[0])
    return onlineNames.join('\n')
  }
}

module.exports = GuildiesOnlineStorage
