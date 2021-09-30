import { Address } from '@graphprotocol/graph-ts'
import { Stake, Unstake } from '../generated/schema'
import { OlympusERC20 } from '../generated/sOlympusERC20V1/OlympusERC20'
import { OHM_ERC20_CONTRACT, STAKING_CONTRACT_V1 } from './utils/Constants'

import {  StakeOHMCall, UnstakeOHMCall  } from '../generated/OlympusStakingV1/OlympusStakingV1'
import { toDecimal } from "./utils/Decimals"
// import { loadOrCreateOHMie, updateOhmieBalance } from "./utils/OHMie"
import { loadOrCreateTransaction } from "./utils/Transactions"
import { loadOrCreateProtocolMetric, updateProtocolMetrics } from './utils/ProtocolMetrics'

export function handleStake(call: StakeOHMCall): void {
    // let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    // let protocolMetric = loadOrCreateProtocolMetric(transaction.timestamp)
    let value = toDecimal(call.inputs.amountToStake_, 9)
    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

    let stake = new Stake(transaction.id)

    // stake.protocolMetric = protocolMetric.id;
    stake.transaction = transaction.id
    // stake.ohmie = ohmie.id
    stake.amount = value
    stake.timestamp = transaction.timestamp;
    stake.totalStaked = toDecimal(ohm_contract.balanceOf(Address.fromString(STAKING_CONTRACT_V1)), 9)

    let pm = updateProtocolMetrics(transaction)
    stake.protocolMetric = pm.id

    stake.save()
    updateProtocolMetrics(transaction)
    // updateOhmieBalance(ohmie, transaction)
}

export function handleUnstake(call: UnstakeOHMCall): void {
    // let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    // let protocolMetric = loadOrCreateProtocolMetric(transaction.timestamp)
    let value = toDecimal(call.inputs.amountToWithdraw_, 9)
    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

    let unstake = new Unstake(transaction.id)
    unstake.transaction = transaction.id
    // unstake.protocolMetric = protocolMetric.id;

    // unstake.ohmie = ohmie.id
    unstake.amount = value
    unstake.timestamp = transaction.timestamp;
    unstake.totalStaked = toDecimal(ohm_contract.balanceOf(Address.fromString(STAKING_CONTRACT_V1)), 9)
    let pm = updateProtocolMetrics(transaction)
    unstake.protocolMetric = pm.id

    unstake.save()

    // updateOhmieBalance(ohmie, transaction)
    updateProtocolMetrics(transaction)
}