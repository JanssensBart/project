const crypto = require("crypto")
const uuid = crypto.randomUUID({ disableEntropyCache: true })

module.exports = uuid