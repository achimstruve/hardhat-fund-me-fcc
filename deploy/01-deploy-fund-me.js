//function deployFunc(hre) {
//    console.log("hi!")
//}

//module.exports.default = deployFunc

// hre is the hardhat runtime environment
//module.exports = async (hre) => {
//    const {getNamedAccounts, deployments} = hre
//}

//const helperConfig = require("../helper-hardhat-config")
//const networkConfig = helperConfig.networkConfig
const { networkConfig, developmentChains } = require("../helper-hardhat-config") // this is the same as the two lines above
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

// shorter version
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the contract doesn't exist, we deploy a minimal version for our local testing

    // when going for localhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // put priceFeed address here
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // verify
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }

    log("-------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
