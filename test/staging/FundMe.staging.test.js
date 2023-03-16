const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip //if in development chain skip
    : describe("FundMe", function () {
          //continue if we are not in development chain
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              console.log(`Deployer address: ${deployer}`)
              fundMe = await ethers.getContract("FundMe", deployer)
              console.log(`Fund me Address: ${fundMe.address}`)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              console.log(`VAlue:  ${sendValue}`)
              await fundMe.withdraw()
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(`Balance:  ${endingBalance.toStrong()}`)
              assert.equal(endingBalance.toString(), "0")
          })
      })
