import { Address } from '@graphprotocol/graph-ts'
import { Stake, Unstake } from '../generated/schema'
import { OlympusERC20 } from '../generated/sOlympusERC20V1/OlympusERC20'
import { OHM_ERC20_CONTRACT, STAKING_CONTRACT_V2 } from './utils/Constants'

import {  StakeCall  } from '../generated/OlympusStakingV2Helper/OlympusStakingV2Helper'
import { toDecimal } from "./utils/Decimals"
// import { loadOrCreateOHMie, updateOhmieBalance } from "./utils/OHMie"
import { loadOrCreateTransaction } from "./utils/Transactions"

export function handleStake(call: StakeCall): void {
    // let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let value = toDecimal(call.inputs._amount, 9)
    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

    let counter = Stake.load('1')
    if(counter == null)
    {
        counter = new Stake('1')
    }
    counter.totalStaked = counter.totalStaked
    counter.save()

    let stake = new Stake(transaction.id)
    stake.transaction = transaction.id
    stake.amount = value
    stake.timestamp = transaction.timestamp;
    stake.currentStaked = toDecimal(ohm_contract.balanceOf(Address.fromString(STAKING_CONTRACT_V2)), 9)
    stake.totalStaked = counter.totalStaked

    stake.save()

    // updateOhmieBalance(ohmie, transaction)
}