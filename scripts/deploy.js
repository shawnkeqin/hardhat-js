// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// // will compile your contracts, add the Hardhat Runtime Environment's members to the
// // global scope, and execute the script.
// const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = hre.ethers.utils.parseEther("1");

//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });



//imports 

const { ethers, run, network } = require("hardhat")


//async main 

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed(); 
  console.log('deployed contract to')
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY ){
      await SimpleStorageFactory.deployTransaction.wait(6); 
      await verify(SimpleStorageFactory.address, [])
  }

  const currentValue = await simpleStorage.retrieve()
  console.log(`current value is: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7); 
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(updatedValue);

}


async function verify(contractAddress, args) {
  console.log('Verifying contract...')
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args, 
    })
  } catch(e){
    if (e.message.toLowerCase().includes("already verified")){
      console.log('already verified!')
    } else {
      console.log(e)
    }
  }
}


//main 

main().then(() => process.exit(0)).catch((error) => {
  console.error(error)
  process.exit(1);
})




