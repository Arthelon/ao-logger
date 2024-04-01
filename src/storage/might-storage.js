class MightStorage {
  constructor() {
    this.might = {}
  }

  set(type, name, value) {
    if (this.might[type] == null) {
      this.might[type] = {}
    }
    this.might[type][name] = value
  }

  getByType(type) {
    return this.might[type]
  }

  serialize() {
    const output = Object.entries(this.might)
      .map((entry) => {
        const type = entry[0]
        const mapping = entry[1]
        return Object.entries(mapping).map(
          (playerEntry) => `${type},${playerEntry[0]},${playerEntry[1]}`
        )
      })
      .flat()
      .join('\n')
    return output
  }
}

module.exports = MightStorage
