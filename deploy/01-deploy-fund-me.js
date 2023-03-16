//previously with out hardhat-deploy
//import
//main function
//calling of main function

// function deployFunc(hre) {
//     console.log("Hi")
//      hre.getNamedAccounts()
// }

// module.exports.default = deployFunc

//similar above but using nameless function
//hre == hardhat runtime environment
// module.exports = async (hre) => {
//     const {getNamedAccounts, deployment} = hre //pull getNamedAccounts and deployments from. similar like hre.getNamedAccounts, hre.deployments
// }

// module.exports = async (hre) => {
//     const {getNamedAccounts, deployment} = hre //pull getNamedAccounts and deployments from. similar like hre.getNamedAccounts, hre.deployments
// }
//similar to above

//const helperConfig = require("../helper-hardhat-config")
//const networkConfig = helperConfig.networkConfig
//same as above 2 lines

const { networkConfig, developmentChains } = require("../helper-hardhat-config") //import network config from helper-hardhat-config file
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull deploy and log functions from deployments
    const { deployer } = await getNamedAccounts() //getting deployer account from getNamedAccounts Function from hardhatconfig "namedAccounts:"
    const chainId = network.config.chainId

    let ehtUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        log("In fundme.js development chain if statement")

        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        log(`MockV3Aggregator address is : ${ethUsdAggregator.address}`)
        ehtUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ehtUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    //const ehtUsdPriceFeedAddress = networkConfig[chainID]["ethUsdPriceFeed"]

    //if contract don't rexist, we deploy a minial version for local testing

    //when going for localhost or harhat network we want to use a mock

    const args = [ehtUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        //args: [ehtUsdPriceFeedAddress], //put price feed address
        args: args, //same as above
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1, //get blockconfirmation from hardhat.config
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log(
        "------------------------------------------------------------------------"
    )
}

module.exports.tags = ["all", "fundme"]
