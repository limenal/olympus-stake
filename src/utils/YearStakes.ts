import {toDecimal}from "./Decimals"
import {STAKE_SUFFIX} from "./Suffix"
import {getNumberDayFromDate} from './DatesSecond'
import { BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {Stake, StakeMinute, StakeHour, StakeDay, StakeYear, Token, Transaction} from "../../generated/schema"
import { OHM_ERC20_CONTRACT, STAKING_CONTRACT_V2 } from './Constants'

export function StakeAdd(type:string, transaction: Transaction, token:string, amount:BigDecimal, timeStamp:BigInt, ohm_balance: BigDecimal):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = StakeYear.load(token+date.getUTCFullYear().toString()+STAKE_SUFFIX);
    let lastYear =  StakeYear.load(token+(date.getUTCFullYear()-1).toString()+STAKE_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new StakeYear(token+date.getUTCFullYear().toString()+STAKE_SUFFIX);
            year.timestamp=timeStamp;
            let counter = Stake.load('1')
            if(counter == null)
            {
                counter = new Stake('1')
            }
            if(type == 'stake')
            {
                year.amountStaked=amount;
                year.stakeCount = BigInt.fromString('1')
                
            }
            else
            {
                year.amountUnstaked=amount;
                year.unstakeCount = BigInt.fromString('1')
            }
            counter.save()
            year.currentStaked = ohm_balance
            // year.totalDeposit = counter.id
            year.token=token;
            // year.sender.push(sender);
            year.save();
        }else{
            year= new StakeYear(token+date.getUTCFullYear().toString()+STAKE_SUFFIX);
            year.timestamp=timeStamp;
            let counter = Stake.load('1')
            if(counter == null)
            {
                counter = new Stake('1')
            }
            if(type == 'stake')
            {

                year.amountStaked=amount;
                year.stakeCount = BigInt.fromString('1')

            }
            else
            {
                year.amountUnstaked=amount;
                year.unstakeCount = BigInt.fromString('1')
            }
            counter.save()
            year.currentStaked = ohm_balance

            // year.totalDeposit = counter.id
            year.token=token;
            // year.sender.push(sender);
            year.save();
        }
    }else {
        year.timestamp=timeStamp;
        
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        if(type == 'stake')
        {
            
            year.amountStaked=year.amountStaked.plus(amount);
            year.stakeCount = year.stakeCount.plus(BigInt.fromString('1'))

        }
        else
        {
            year.amountUnstaked=year.amountUnstaked.plus(amount);
            year.unstakeCount = year.unstakeCount.plus(BigInt.fromString('1'))
        }
        counter.save()
        year.currentStaked = ohm_balance

        // year.totalDeposit = counter.id
        year.token=token;        // year.sender.push(sender);
        year.save();
    }
    
    
    let days = year.dayStake;
    
    let day=StakeDay.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+STAKE_SUFFIX);
    
    if(day==null){
        day = new StakeDay(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+STAKE_SUFFIX);
        day.timestamp=timeStamp;
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // day.stakeCount = counter.stakeCount
        // day.unstakeCount = counter.unstakeCount
        day.totalStaked = counter.totalStaked
        day.totalUnstaked = counter.totalUnstaked

        if(type == "stake")
        {
            day.amountStaked=amount;
            day.stakeCount = BigInt.fromString('1')
            
        }
        else{
            day.amountUnstaked=amount;
            day.stakeCount = BigInt.fromString('1')
        }
        day.currentStaked = ohm_balance

        // day.totalDeposit = counter.id
        day.token=token;        // year.sender.push(sender);
        day.save();
        days.push(day.id)
        year.dayStake = days
        year.save()
    }else {
        day.timestamp=timeStamp;
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // day.stakeCount = counter.stakeCount
        // day.unstakeCount = counter.unstakeCount
        day.totalStaked = counter.totalStaked
        day.totalUnstaked = counter.totalUnstaked
        
        day.stakeCount = counter.stakeCount
        day.totalStaked = counter.totalStaked

        if(type == "stake")
        {
            day.amountStaked=day.amountStaked.plus(amount);
            day.stakeCount = day.stakeCount.plus(BigInt.fromString('1'))

        }
        else{
            day.amountUnstaked=day.amountUnstaked.plus(amount);
            day.unstakeCount = day.unstakeCount.plus(BigInt.fromString('1'))

        }
        day.currentStaked = ohm_balance

        // day.totalDeposit = counter.id
        day.token=token;        
        // year.sender.push(sender);
        day.save();
    }
    
    let hours = day.hourStake;
    let hour = StakeHour.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+STAKE_SUFFIX);
    if(hour==null) {
        hour = new StakeHour(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+STAKE_SUFFIX);
        hour.timestamp=timeStamp;
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // hour.stakeCount = counter.stakeCount
        // hour.unstakeCount = counter.unstakeCount
        hour.totalStaked = counter.totalStaked
        hour.totalUnstaked = counter.totalUnstaked
        if(type == "stake")
        {
            hour.amountStaked=amount;
            hour.stakeCount = BigInt.fromString('1')

        }
        else{
            hour.amountUnstaked=amount;
            hour.unstakeCount = BigInt.fromString('1')

        }
        hour.currentStaked = ohm_balance

        // hour.totalDeposit = counter.id
        hour.token=token;        
        // year.sender.push(sender);
        hour.save();
        hours.push(hour.id);
        day.hourStake=hours;
        day.save();
    }else {
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // hour.stakeCount = counter.stakeCount
        // hour.unstakeCount = counter.unstakeCount
        hour.totalStaked = counter.totalStaked
        hour.totalUnstaked = counter.totalUnstaked
        if(type == "stake")
        {
            hour.amountStaked=hour.amountStaked.plus(amount);
            hour.stakeCount = hour.stakeCount.plus(BigInt.fromString('1'))

        }
        else{
            hour.amountUnstaked=hour.amountUnstaked.plus(amount);
            hour.unstakeCount = hour.unstakeCount.plus(BigInt.fromString('1'))

        }
        hour.currentStaked = ohm_balance

        hour.timestamp=timeStamp;
        // hour.totalDeposit = counter.id
        hour.token=token;        
        // year.sender.push(sender);
        hour.save();
    }
    
    let minutes= hour.minuteStake;
    let minute =StakeMinute.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+STAKE_SUFFIX);
    if(minute==null) {
        minute = new StakeMinute(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+STAKE_SUFFIX);
        minute.timestamp=timeStamp;
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // minute.stakeCount = counter.stakeCount
        // minute.unstakeCount = counter.unstakeCount
        minute.totalStaked = counter.totalStaked
        minute.totalUnstaked = counter.totalUnstaked

        if(type == "stake")
        {
            minute.amountStaked=amount;
            minute.stakeCount = BigInt.fromString('1')

        }
        else{
            minute.amountUnstaked=amount;
            minute.unstakeCount = BigInt.fromString('1')
        }
        minute.currentStaked = ohm_balance

        // minute.totalDeposit = counter.id
        minute.token=token;        
        minute.save();
        minutes.push(minute.id);
        hour.minuteStake=minutes;
        hour.save();
    }else {
        
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // minute.stakeCount = counter.stakeCount
        // minute.unstakeCount = counter.unstakeCount
        minute.totalStaked = counter.totalStaked
        minute.totalUnstaked = counter.totalUnstaked

        if(type == "stake")
        {
            minute.amountStaked=minute.amountStaked.plus(amount);
            minute.stakeCount = minute.stakeCount.plus(BigInt.fromString('1'))

        }
        else{
            minute.amountUnstaked=minute.amountUnstaked.plus(amount);
            minute.unstakeCount = minute.unstakeCount.plus(BigInt.fromString('1'))

        }
        minute.currentStaked = ohm_balance

        // minute.profit=minute!=null?minute.profit!=null?profit.plus(minute.profit):toDecimal(BigInt.zero(),0):toDecimal(BigInt.zero(),0);
        minute.timestamp=timeStamp;
        // minute.totalDeposit = counter.id
        minute.token=token;        
        minute.save();

    }

    let seconds = minute.secondStake;
    let second =Stake.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+STAKE_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new Stake(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+STAKE_SUFFIX);
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // second.stakeCount = counter.stakeCount
        // second.unstakeCount = counter.unstakeCount
        second.totalStaked = counter.totalStaked
        second.totalUnstaked = counter.totalUnstaked

        if(type == "stake")
        {
            second.amountStaked=amount;
            second.stakeCount = BigInt.fromString('1')
        }
        else{
            second.amountUnstaked=amount;
            second.unstakeCount = BigInt.fromString('1')
        }        
        second.currentStaked = ohm_balance

        second.timestamp=timeStamp;
        second.token=token;
        // second.totalDeposit = counter.id
        second.save();
        seconds.push(second.id);
        minute.secondStake=seconds;
        minute.save();
    }
    else
    {
        let counter = Stake.load('1')
        if(counter == null)
        {
            counter = new Stake('1')
        }
        counter.totalStaked = counter.totalStaked
        counter.stakeCount = counter.stakeCount
        counter.save()
        
        // second.stakeCount = counter.stakeCount
        // second.unstakeCount = counter.unstakeCount
        second.totalStaked = counter.totalStaked
        second.totalUnstaked = counter.totalUnstaked

        if(type == "stake")
        {
            second.amountStaked=second.amountStaked.plus(amount);
            second.stakeCount = second.stakeCount.plus(BigInt.fromString('1'))
        }
        else{
            second.amountUnstaked=second.amountUnstaked.plus(amount);
            second.unstakeCount = second.unstakeCount.plus(BigInt.fromString('1'))
        }
        second.currentStaked = ohm_balance
        second.timestamp=timeStamp;
        second.token=token;
        // second.totalDeposit = counter.id
        second.save();
    }
    
}
