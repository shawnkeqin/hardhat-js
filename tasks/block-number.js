const { isCommunityResourcable } = require("@ethersproject/providers")
const { task } = require("hardhat/config")


task("block-number", "Prints the current block number").setAction(

        // const blockTask = async function() => {}
        // async function blockTask(){}
    async (taskArgs, hre) => {
       const blockNumber = await hre.ethers.provider.getBlockNumber()
       console.log(blockNumber)


    }
)

module.exports = {} 