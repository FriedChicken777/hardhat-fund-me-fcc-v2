const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull deploy and log functions from deployments
    const { deployer } = await getNamedAccounts() //getting deployer account from getNamedAccounts Function from hardhatconfig "namedAccounts:"
    //const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log(`${network.name} network detected. deploying mocks`)

        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })

        log("Mocks deployed")
        log(
            "--------------------------------------------------------------------"
        )
    }
}

module.exports.tags = ["all", "mocks"]
