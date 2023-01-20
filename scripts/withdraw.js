const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Withdrawing...")
    const txResponse = await fundMe.withdraw()
    await txResponse.wait(1)
    console.log(
        `Withdrew funds! Current balance is ${await fundMe.provider.getBalance(
            fundMe.address
        )}`
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
