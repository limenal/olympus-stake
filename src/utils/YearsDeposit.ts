import {toDecimal}from "./Decimals"
import {DEPOSIT_SUFFIX} from "./Suffix"
import {getNumberDayFromDate} from './DatesSecond'
import { BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {Deposit,DepositMinuteEntity,DepositHourEntity,DepositDayEntity , 
    DepositYearDaiEntity,
    DepositYearETHEntity, 
    DepositYearFraxEntity, 
    DepositYearLusdEntity,
    DepositYearOHMDAIEntity, DepositYearOHMFRAXEntity, Token, Transaction} from "../../generated/schema"

/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddDAI(type:string, token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearDaiEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    if(year==null){
        year= new DepositYearDaiEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount=amount;
            year.depositCount = BigInt.fromString('1')
        }
        else
        {
            year.payout = amount
            year.redeemCount = BigInt.fromString('1')
        }
        year.token=token;
        
        year.save();
        
    }else {
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount= year.amount.plus(amount);
            year.depositCount = year.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            year.payout = year.payout.plus(amount)
            year.redeemCount = year.redeemCount.plus(BigInt.fromString('1'))
        }
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount=amount;
            day.depositCount = BigInt.fromString('1')
        }
        else
        {
            day.payout = amount
            day.redeemCount = BigInt.fromString('1')
        }        
        day.token=token;

        day.save();
        days.push(day.id)
        year.dayDeposit = days

        year.save()
    }else {
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount= day.amount.plus(amount);
            day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            day.payout = day.payout.plus(amount)
            day.redeemCount = day.redeemCount.plus(BigInt.fromString('1'))
        }
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        if(type === "deposit")
        {
            hour.amount=amount;
            hour.depositCount = BigInt.fromString('1')

        }
        else
        {
            hour.payout = amount
            hour.redeemCount = BigInt.fromString('1')
        }
        hour.token=token;        

        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;

        day.save();
    }else {

        hour.timestamp = timeStamp;
        if(type === "deposit")
        {
            hour.amount= hour.amount.plus(amount);
            hour.depositCount = hour.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            hour.payout = hour.payout.plus(amount)
            hour.redeemCount = hour.redeemCount.plus(BigInt.fromString('1'))
        }
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        if(type === "deposit")
        {
            minute.amount=amount;
            minute.depositCount = BigInt.fromString('1')
        }
        else
        {
            minute.payout = amount
            minute.redeemCount = BigInt.fromString('1')

        }
        minute.token=token;      
        minute.save();

        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))
        minute.timestamp=timeStamp;
        if(type === "deposit")
        {
            minute.amount= minute.amount.plus(amount);
            minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            minute.payout = minute.payout.plus(amount)
            minute.redeemCount = minute.redeemCount.plus(BigInt.fromString('1'))

        }
        minute.token=token;        
        minute.save();

    }
}

/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddETH(type:string, token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearETHEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    if(year==null){
        year= new DepositYearETHEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount=amount;
            year.depositCount = BigInt.fromString('1')
        }
        else
        {
            year.payout = amount
            year.redeemCount = BigInt.fromString('1')
        }
        year.token=token;
        
        year.save();
        
    }else {
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount= year.amount.plus(amount);
            year.depositCount = year.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            year.payout = year.payout.plus(amount)
            year.redeemCount = year.redeemCount.plus(BigInt.fromString('1'))
        }
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount=amount;
            day.depositCount = BigInt.fromString('1')
        }
        else
        {
            day.payout = amount
            day.redeemCount = BigInt.fromString('1')
        }        
        day.token=token;

        day.save();
        days.push(day.id)
        year.dayDeposit = days

        year.save()
    }else {
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount= day.amount.plus(amount);
            day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            day.payout = day.payout.plus(amount)
            day.redeemCount = day.redeemCount.plus(BigInt.fromString('1'))
        }
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        if(type === "deposit")
        {
            hour.amount=amount;
            hour.depositCount = BigInt.fromString('1')

        }
        else
        {
            hour.payout = amount
            hour.redeemCount = BigInt.fromString('1')
        }
        hour.token=token;        

        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;

        day.save();
    }else {

        hour.timestamp = timeStamp;
        if(type === "deposit")
        {
            hour.amount= hour.amount.plus(amount);
            hour.depositCount = hour.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            hour.payout = hour.payout.plus(amount)
            hour.redeemCount = hour.redeemCount.plus(BigInt.fromString('1'))
        }
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        if(type === "deposit")
        {
            minute.amount=amount;
            minute.depositCount = BigInt.fromString('1')
        }
        else
        {
            minute.payout = amount
            minute.redeemCount = BigInt.fromString('1')

        }
        minute.token=token;      
        minute.save();

        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))
        minute.timestamp=timeStamp;
        if(type === "deposit")
        {
            minute.amount= minute.amount.plus(amount);
            minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            minute.payout = minute.payout.plus(amount)
            minute.redeemCount = minute.redeemCount.plus(BigInt.fromString('1'))

        }
        minute.token=token;        
        minute.save();

    }
}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddFrax(type:string, token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearFraxEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    if(year==null){
        year= new DepositYearFraxEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount=amount;
            year.depositCount = BigInt.fromString('1')
        }
        else
        {
            year.payout = amount
            year.redeemCount = BigInt.fromString('1')
        }
        year.token=token;
        
        year.save();
        
    }else {
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount= year.amount.plus(amount);
            year.depositCount = year.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            year.payout = year.payout.plus(amount)
            year.redeemCount = year.redeemCount.plus(BigInt.fromString('1'))
        }
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount=amount;
            day.depositCount = BigInt.fromString('1')
        }
        else
        {
            day.payout = amount
            day.redeemCount = BigInt.fromString('1')
        }        
        day.token=token;

        day.save();
        days.push(day.id)
        year.dayDeposit = days

        year.save()
    }else {
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount= day.amount.plus(amount);
            day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            day.payout = day.payout.plus(amount)
            day.redeemCount = day.redeemCount.plus(BigInt.fromString('1'))
        }
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        if(type === "deposit")
        {
            hour.amount=amount;
            hour.depositCount = BigInt.fromString('1')

        }
        else
        {
            hour.payout = amount
            hour.redeemCount = BigInt.fromString('1')
        }
        hour.token=token;        

        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;

        day.save();
    }else {

        hour.timestamp = timeStamp;
        if(type === "deposit")
        {
            hour.amount= hour.amount.plus(amount);
            hour.depositCount = hour.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            hour.payout = hour.payout.plus(amount)
            hour.redeemCount = hour.redeemCount.plus(BigInt.fromString('1'))
        }
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        if(type === "deposit")
        {
            minute.amount=amount;
            minute.depositCount = BigInt.fromString('1')
        }
        else
        {
            minute.payout = amount
            minute.redeemCount = BigInt.fromString('1')

        }
        minute.token=token;      
        minute.save();

        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))
        minute.timestamp=timeStamp;
        if(type === "deposit")
        {
            minute.amount= minute.amount.plus(amount);
            minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            minute.payout = minute.payout.plus(amount)
            minute.redeemCount = minute.redeemCount.plus(BigInt.fromString('1'))

        }
        minute.token=token;        
        minute.save();

    }

}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddLusd(type:string, token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearLusdEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearLusdEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        year= new DepositYearLusdEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount=amount;
            year.depositCount = BigInt.fromString('1')
        }
        else
        {
            year.payout = amount
            year.redeemCount = BigInt.fromString('1')
        }
        year.token=token;
        
        year.save();
        
    }else {
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount= year.amount.plus(amount);
            year.depositCount = year.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            year.payout = year.payout.plus(amount)
            year.redeemCount = year.redeemCount.plus(BigInt.fromString('1'))
        }
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount=amount;
            day.depositCount = BigInt.fromString('1')
        }
        else
        {
            day.payout = amount
            day.redeemCount = BigInt.fromString('1')
        }        
        day.token=token;

        day.save();
        days.push(day.id)
        year.dayDeposit = days

        year.save()
    }else {
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount= day.amount.plus(amount);
            day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            day.payout = day.payout.plus(amount)
            day.redeemCount = day.redeemCount.plus(BigInt.fromString('1'))
        }
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        if(type === "deposit")
        {
            hour.amount=amount;
            hour.depositCount = BigInt.fromString('1')

        }
        else
        {
            hour.payout = amount
            hour.redeemCount = BigInt.fromString('1')
        }
        hour.token=token;        

        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;

        day.save();
    }else {

        hour.timestamp = timeStamp;
        if(type === "deposit")
        {
            hour.amount= hour.amount.plus(amount);
            hour.depositCount = hour.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            hour.payout = hour.payout.plus(amount)
            hour.redeemCount = hour.redeemCount.plus(BigInt.fromString('1'))
        }
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        if(type === "deposit")
        {
            minute.amount=amount;
            minute.depositCount = BigInt.fromString('1')
        }
        else
        {
            minute.payout = amount
            minute.redeemCount = BigInt.fromString('1')

        }
        minute.token=token;      
        minute.save();

        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))
        minute.timestamp=timeStamp;
        if(type === "deposit")
        {
            minute.amount= minute.amount.plus(amount);
            minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            minute.payout = minute.payout.plus(amount)
            minute.redeemCount = minute.redeemCount.plus(BigInt.fromString('1'))

        }
        minute.token=token;        
        minute.save();

    }

}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddOHMDAI( type:string, token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearOHMDAIEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    if(year==null){
        year= new DepositYearOHMDAIEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount=amount;
            year.depositCount = BigInt.fromString('1')
        }
        else
        {
            year.payout = amount
            year.redeemCount = BigInt.fromString('1')
        }
        year.token=token;
        
        year.save();
        
    }else {
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount= year.amount.plus(amount);
            year.depositCount = year.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            year.payout = year.payout.plus(amount)
            year.redeemCount = year.redeemCount.plus(BigInt.fromString('1'))
        }
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount=amount;
            day.depositCount = BigInt.fromString('1')
        }
        else
        {
            day.payout = amount
            day.redeemCount = BigInt.fromString('1')
        }        
        day.token=token;

        day.save();
        days.push(day.id)
        year.dayDeposit = days

        year.save()
    }else {
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount= day.amount.plus(amount);
            day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            day.payout = day.payout.plus(amount)
            day.redeemCount = day.redeemCount.plus(BigInt.fromString('1'))
        }
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        if(type === "deposit")
        {
            hour.amount=amount;
            hour.depositCount = BigInt.fromString('1')

        }
        else
        {
            hour.payout = amount
            hour.redeemCount = BigInt.fromString('1')
        }
        hour.token=token;        

        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;

        day.save();
    }else {

        hour.timestamp = timeStamp;
        if(type === "deposit")
        {
            hour.amount= hour.amount.plus(amount);
            hour.depositCount = hour.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            hour.payout = hour.payout.plus(amount)
            hour.redeemCount = hour.redeemCount.plus(BigInt.fromString('1'))
        }
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        if(type === "deposit")
        {
            minute.amount=amount;
            minute.depositCount = BigInt.fromString('1')
        }
        else
        {
            minute.payout = amount
            minute.redeemCount = BigInt.fromString('1')

        }
        minute.token=token;      
        minute.save();

        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))
        minute.timestamp=timeStamp;
        if(type === "deposit")
        {
            minute.amount= minute.amount.plus(amount);
            minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            minute.payout = minute.payout.plus(amount)
            minute.redeemCount = minute.redeemCount.plus(BigInt.fromString('1'))

        }
        minute.token=token;        
        minute.save();

    }
}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddOHMFRAX(type:string, token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearOHMFRAXEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearOHMFRAXEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        year= new DepositYearOHMFRAXEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount=amount;
            year.depositCount = BigInt.fromString('1')
        }
        else
        {
            year.payout = amount
            year.redeemCount = BigInt.fromString('1')
        }
        year.token=token;
        
        year.save();
        
    }else {
        year.timestamp=timeStamp;
        if(type === "deposit")
        {
            year.amount= year.amount.plus(amount);
            year.depositCount = year.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            year.payout = year.payout.plus(amount)
            year.redeemCount = year.redeemCount.plus(BigInt.fromString('1'))
        }
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount=amount;
            day.depositCount = BigInt.fromString('1')
        }
        else
        {
            day.payout = amount
            day.redeemCount = BigInt.fromString('1')
        }        
        day.token=token;

        day.save();
        days.push(day.id)
        year.dayDeposit = days

        year.save()
    }else {
        day.timestamp=timeStamp;
        if(type === "deposit")
        {
            day.amount= day.amount.plus(amount);
            day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            day.payout = day.payout.plus(amount)
            day.redeemCount = day.redeemCount.plus(BigInt.fromString('1'))
        }
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        if(type === "deposit")
        {
            hour.amount=amount;
            hour.depositCount = BigInt.fromString('1')

        }
        else
        {
            hour.payout = amount
            hour.redeemCount = BigInt.fromString('1')
        }
        hour.token=token;        

        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;

        day.save();
    }else {

        hour.timestamp = timeStamp;
        if(type === "deposit")
        {
            hour.amount= hour.amount.plus(amount);
            hour.depositCount = hour.depositCount.plus(BigInt.fromString('1'))
        }
        else
        {
            hour.payout = hour.payout.plus(amount)
            hour.redeemCount = hour.redeemCount.plus(BigInt.fromString('1'))
        }
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        if(type === "deposit")
        {
            minute.amount=amount;
            minute.depositCount = BigInt.fromString('1')
        }
        else
        {
            minute.payout = amount
            minute.redeemCount = BigInt.fromString('1')

        }
        minute.token=token;      
        minute.save();

        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))
        minute.timestamp=timeStamp;
        if(type === "deposit")
        {
            minute.amount= minute.amount.plus(amount);
            minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        }
        else
        {
            minute.payout = minute.payout.plus(amount)
            minute.redeemCount = minute.redeemCount.plus(BigInt.fromString('1'))

        }
        minute.token=token;        
        minute.save();

    }

}