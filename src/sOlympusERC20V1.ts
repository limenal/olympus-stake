import { RebaseCall } from '../generated/sOlympusERC20V1/sOlympusERC20'
import { OlympusERC20 } from '../generated/sOlympusERC20V1/OlympusERC20'
import { createDailyStakingReward } from './utils/DailyStakingReward'
import { loadOrCreateTransaction } from "./utils/Transactions"
import { Rebase } from '../generated/schema'
import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { OHM_ERC20_CONTRACT, STAKING_CONTRACT_V1 } from './utils/Constants'
import { toDecimal } from './utils/Decimals'
import { getOHMUSDRate } from './utils/Price';
import { RebaseAdd } from './utils/YearRebase'

export function rebaseFunction(call: RebaseCall): void {
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    log.debug("Rebase_V1 event on TX {} with amount {}", [transaction.id, toDecimal(call.inputs.olyProfit, 9).toString()])
    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))

    let amount = toDecimal(call.inputs.olyProfit, 9)
    let stakedOhms = toDecimal(ohm_contract.balanceOf(Address.fromString(STAKING_CONTRACT_V1)), 9)
    let timestamp = transaction.timestamp
    let amountUSD = amount.times(getOHMUSDRate())
    let rebase = new Rebase(transaction.id)

    RebaseAdd(timestamp, stakedOhms, amount, amountUSD)
    rebase.amount = amount
    rebase.amountUSD = amountUSD
    rebase.save()

}