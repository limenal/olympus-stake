import { Address, BigInt } from '@graphprotocol/graph-ts'
import {  DepositCall, RedeemCall, BondCreated, BondRedeemed, BondPriceChanged} from '../generated/OHMFRAXBondV1/OHMFRAXBondV1'
import { Deposit, Redemption, PriceChange, VariableAdjustment } from '../generated/schema'
import { OlympusERC20 } from '../generated/sOlympusERC20V1/OlympusERC20'
import { loadOrCreateTransaction } from "./utils/Transactions"
// import { loadOrCreateOHMie, updateOhmieBalance } from "./utils/OHMie"
import { toDecimal } from "./utils/Decimals"
import { loadOrCreateToken } from './utils/Tokens'

import { createDailyBondRecord } from './utils/DailyBond'
import { OHMFRAXLPBOND_TOKEN, OHM_ERC20_CONTRACT, OHMFRAXLPBOND_CONTRACT1 } from './utils/Constants'

import { getPairUSD } from './utils/Price'
import {DepositAddOHMFRAX} from "./utils/YearsDeposit"

/**
    @dev : Handle OHM-FRAX Bond create
*/

export function handleBondCreate(event: BondCreated) : void{
  let transaction = loadOrCreateTransaction(event.transaction, event.block)
  let token = loadOrCreateToken(OHMFRAXLPBOND_TOKEN)
  let amount = toDecimal(event.params.payout, 9)
  let redeem = new Redemption(transaction.id)

  DepositAddOHMFRAX('redeem', token.id, amount, transaction.timestamp)
  redeem.save()
}

export function handleBondRedeem(event: BondRedeemed) : void{
  
  let transaction = loadOrCreateTransaction(event.transaction, event.block)
  let token = loadOrCreateToken(OHMFRAXLPBOND_TOKEN)
  let amount = toDecimal(event.params.payout, 9)
  let remaining = event.params.remaining;
  let redeem = new Redemption(transaction.id)
  let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

  let counter = Redemption.load('1')
  if(counter == null)
  {
      counter = new Redemption('1')
  }
  counter.totalRedeemd = counter.totalRedeemd.plus(amount)
  counter.save()
  
  
  redeem.ohmReserve = toDecimal(ohm_contract.balanceOf(Address.fromString(OHMFRAXLPBOND_CONTRACT1)), 9)
  redeem.token = token.id
  redeem.timestamp = transaction.timestamp
  redeem.payout = amount
  redeem.totalRedeemd = counter.totalRedeemd
  redeem.transaction = transaction.id

  redeem.save()
}

export function handleBondPriceChange(event: BondPriceChanged) : void{
  let transaction = loadOrCreateTransaction(event.transaction, event.block)
  let token = loadOrCreateToken(OHMFRAXLPBOND_TOKEN)

  let price = new PriceChange(transaction.id)

  price.transaction = transaction.id
  
  price.priceInUSD = toDecimal(event.params.priceInUSD, 9)
  price.internalPrice = toDecimal(event.params.internalPrice, 2)
  price.ratio = toDecimal(event.params.debtRatio, 9)
  price.token = token.id
  price.timestamp = transaction.timestamp
  
  price.save()
}