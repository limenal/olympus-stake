import { Address, BigInt } from '@graphprotocol/graph-ts'
import {  DepositCall, RedeemCall, BondCreated, BondRedeemed, BondPriceChanged, ControlVariableAdjustment} from '../generated/OHMDAIBondV4/OHMDAIBondV4'
import { Deposit, Redemption, PriceChange, VariableAdjustment } from '../generated/schema'
import { OlympusERC20 } from '../generated/sOlympusERC20V1/OlympusERC20'
import { loadOrCreateTransaction } from "./utils/Transactions"
import { toDecimal } from "./utils/Decimals"
import { loadOrCreateToken } from './utils/Tokens'

import { OHMDAILPBOND_TOKEN, OHM_ERC20_CONTRACT, OHMDAISLPBOND_CONTRACT4 } from './utils/Constants'
import {DepositAddOHMDAI} from "./utils/YearsDeposit"

/**
    @dev : Handle OHM-DAI Bond create
*/
export function handleBondCreate(event: BondCreated) : void{
  let transaction = loadOrCreateTransaction(event.transaction, event.block)
  let token = loadOrCreateToken(OHMDAILPBOND_TOKEN)
  let amount = toDecimal(event.params.deposit, 18)
  let deposit = new Deposit(transaction.id)

  DepositAddOHMDAI( 'deposit', token.id, amount, transaction.timestamp)

  deposit.save()

}

export function handleBondRedeem(event: BondRedeemed) : void{
  let transaction = loadOrCreateTransaction(event.transaction, event.block)
  let token = loadOrCreateToken(OHMDAILPBOND_TOKEN)
  let amount = toDecimal(event.params.payout, 9)
  let redeem = new Redemption(transaction.id)

  DepositAddOHMDAI('redeem', token.id, amount, transaction.timestamp)
  redeem.save()
}

export function handleBondPriceChange(event: BondPriceChanged) : void{
  let transaction = loadOrCreateTransaction(event.transaction, event.block)
  let token = loadOrCreateToken(OHMDAILPBOND_TOKEN)

  let price = new PriceChange(transaction.id)

  price.transaction = transaction.id
  
  price.priceInUSD = toDecimal(event.params.priceInUSD, 9)
  price.internalPrice = toDecimal(event.params.internalPrice, 2)
  price.ratio = toDecimal(event.params.debtRatio, 9)
  price.token = token.id
  price.timestamp = transaction.timestamp
  
  price.save()
}

export function handleControlVariableAdjustment(event: ControlVariableAdjustment) : void{
  let transaction = loadOrCreateTransaction(event.transaction, event.block)
  let token = loadOrCreateToken(OHMDAILPBOND_TOKEN)

  let variable = new VariableAdjustment(transaction.id)

  variable.token = token.id

  variable.initialBCV = toDecimal(event.params.initialBCV, 9)
  variable.newBCV = toDecimal(event.params.newBCV, 9)
  variable.adjustment = toDecimal(event.params.adjustment, 9)
  variable.addition = event.params.addition

  variable.save()
}