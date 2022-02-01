const injectDevServer = require("@cypress/react/plugins/react-scripts")

module.exports = (on, config) => {
    injectDevServer(on, config)

    // modify env value
    config.env = process.env

    return config
}