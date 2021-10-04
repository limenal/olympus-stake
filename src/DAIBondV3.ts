import { Address } from '@graphprotocol/graph-ts'

import {  DepositCall, RedeemCall, BondCreated, BondRedeemed, BondPriceChanged, ControlVariableAdjustment} from '../generated/DAIBondV3/DAIBondV3'
import { Deposit, Redemption, PriceChange, VariableAdjustment } from '../generated/schema'
import { OlympusERC20 } from '../generated/sOlympusERC20V1/OlympusERC20'

import { loadOrCreateTransaction } from "./utils/Transactions"
// import { loadOrCreateOHMie, updateOhmieBalance } from "./utils/OHMie"
import { toDecimal } from "./utils/Decimals"
import { DAIBOND_TOKEN, OHM_ERC20_CONTRACT, DAIBOND_CONTRACTS3} from './utils/Constants'
import { loadOrCreateToken } from './utils/Tokens'
import { loadOrCreateRedemption } from './utils/Redemption'
import { createDailyBondRecord } from './utils/DailyBond'


export function handleBondCreate(event: BondCreated) : void{
    let transaction = loadOrCreateTransaction(event.transaction, event.block)
    let token = loadOrCreateToken(DAIBOND_TOKEN)
    let amount = toDecimal(event.params.deposit, 18)
    let payout = toDecimal(event.params.payout, 9)
    let price = event.params.priceInUSD
    let deposit = new Deposit(transaction.id)
    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

    let counter = Deposit.load('1')
    if(counter == null)
    {
        counter = new Deposit('1')
    }
    counter.totalDeposited = counter.totalDeposited.plus(amount)
    counter.save()

    deposit.ohmReserve = toDecimal(ohm_contract.balanceOf(Address.fromString(DAIBOND_CONTRACTS3)), 9)
    deposit.amount = amount
    deposit.payout = payout
    deposit.expires = event.params.expires
    deposit.priceInUSD = toDecimal(price, 18)
    deposit.token = token.id
    deposit.timestamp = transaction.timestamp
    deposit.transaction = transaction.id
    deposit.totalDeposited = counter.totalDeposited
    deposit.token = token.id

    deposit.save()

}

export function handleBondRedeem(event: BondRedeemed) : void{
    let transaction = loadOrCreateTransaction(event.transaction, event.block)
    let token = loadOrCreateToken(DAIBOND_TOKEN)
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
    
    
    redeem.ohmReserve = toDecimal(ohm_contract.balanceOf(Address.fromString(DAIBOND_CONTRACTS3)), 9)
    redeem.token = token.id
    redeem.timestamp = transaction.timestamp
    redeem.payout = amount
    redeem.totalRedeemd = counter.totalRedeemd
    redeem.transaction = transaction.id

    redeem.save()
}

export function handleBondPriceChange(event: BondPriceChanged) : void{
    let transaction = loadOrCreateTransaction(event.transaction, event.block)
    let token = loadOrCreateToken(DAIBOND_TOKEN)

    let price = new PriceChange(transaction.id)

    price.transaction = transaction.id
    
    price.priceInUSD = toDecimal(event.params.priceInUSD, 9)
    price.internalPrice = toDecimal(event.params.internalPrice, 9)
    price.ratio = toDecimal(event.params.debtRatio, 9)
    price.token = token.id
    price.timestamp = transaction.timestamp
    
    price.save()
}

export function handleControlVariableAdjustment(event: ControlVariableAdjustment) : void{
    let transaction = loadOrCreateTransaction(event.transaction, event.block)
    let token = loadOrCreateToken(DAIBOND_TOKEN)

    let variable = new VariableAdjustment(transaction.id)

    variable.token = token.id

    variable.initialBCV = toDecimal(event.params.initialBCV, 9)
    variable.newBCV = toDecimal(event.params.newBCV, 9)
    variable.adjustment = toDecimal(event.params.adjustment, 9)
    variable.addition = event.params.addition

    variable.save()
}

// export function handleDeposit(call: DepositCall): void {
// //   let ohmie = loadOrCreateOHMie(call.transaction.from)
//     let transaction = loadOrCreateTransaction(call.transaction, call.block)
//     let token = loadOrCreateToken(DAIBOND_TOKEN)

//     let amount = toDecimal(call.inputs._amount, 18)
//     let deposit = new Deposit(transaction.id)
//     deposit.transaction = transaction.id
// //   deposit.ohmie = ohmie.id
//     deposit.amount = amount
//     deposit.value = amount
//     deposit.maxPremium = toDecimal(call.inputs._maxPrice)
//     deposit.token = token.id;
//     deposit.timestamp = transaction.timestamp;
//     deposit.save()

//   createDailyBondRecord(deposit.timestamp, token, deposit.amount, deposit.value)
// //   updateOhmieBalance(ohmie, transaction)
// }

// export function handleRedeem(call: RedeemCall): void {
// //   let ohmie = loadOrCreateOHMie(call.transaction.from)
//     let transaction = loadOrCreateTransaction(call.transaction, call.block)
  
// //   let redemption = loadOrCreateRedemption(call.transaction.hash as Address)
//     let redemption = new Redemption(transaction.id)

//     redemption.transaction = transaction.id
// //   redemption.ohmie = ohmie.id
//     redemption.token = loadOrCreateToken(DAIBOND_TOKEN).id;
//     redemption.timestamp = transaction.timestamp;
//     redemption.save()
// //   updateOhmieBalance(ohmie, transaction)
// }
