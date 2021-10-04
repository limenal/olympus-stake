import { Address } from '@graphprotocol/graph-ts'
import { Stake, Unstake } from '../generated/schema'
import { OlympusERC20 } from '../generated/sOlympusERC20V1/OlympusERC20'
import { OHM_ERC20_CONTRACT, STAKING_CONTRACT_V2 } from './utils/Constants'

import {  StakeCall, UnstakeCall  } from '../generated/OlympusStakingV2/OlympusStakingV2'
import { toDecimal } from "./utils/Decimals"
// import { loadOrCreateOHMie, updateOhmieBalance } from "./utils/OHMie"
import { loadOrCreateTransaction } from "./utils/Transactions"
import { loadOrCreateProtocolMetric, updateProtocolMetrics } from './utils/ProtocolMetrics'

export function handleStake(call: StakeCall): void {
    // let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let protocolMetric = loadOrCreateProtocolMetric(transaction.timestamp)
    let value = toDecimal(call.inputs._amount, 9)
    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

    let counter = Stake.load('1')
    if(counter == null)
    {
        counter = new Stake('1')
    }
    counter.totalStaked = counter.totalStaked.plus(value)
    counter.save()

    let stake = new Stake(transaction.id)
    stake.transaction = transaction.id
    // stake.ohmie = ohmie.id
    // stake.protocolMetric = protocolMetric.id;
    stake.amount = value
    stake.timestamp = transaction.timestamp;
    stake.currentStaked = toDecimal(ohm_contract.balanceOf(Address.fromString(STAKING_CONTRACT_V2)), 9)
    stake.totalStaked = counter.totalStaked
    let pm = updateProtocolMetrics(transaction)
    stake.protocolMetric = pm.id

    stake.save()

    // updateOhmieBalance(ohmie, transaction)
    updateProtocolMetrics(transaction)
}

export function handleUnstake(call: UnstakeCall): void {
    // let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let protocolMetric = loadOrCreateProtocolMetric(transaction.timestamp)
    let value = toDecimal(call.inputs._amount, 9)
    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

    let counter = Unstake.load('1')
    if(counter == null)
    {
        counter = new Unstake('1')
    }
    counter.totalUnstaked = counter.totalUnstaked.plus(value)
    counter.save()

    let unstake = new Unstake(transaction.id)
    unstake.transaction = transaction.id
    // unstake.ohmie = ohmie.id
    unstake.amount = value
    unstake.protocolMetric = protocolMetric.id;
    unstake.timestamp = transaction.timestamp;
    unstake.currentStaked = toDecimal(ohm_contract.balanceOf(Address.fromString(STAKING_CONTRACT_V2)), 9)
    unstake.totalUnstaked = counter.totalUnstaked
    let pm = updateProtocolMetrics(transaction)
    unstake.protocolMetric = pm.id

    unstake.save()

    // updateOhmieBalance(ohmie, transaction)
    updateProtocolMetrics(transaction)
}