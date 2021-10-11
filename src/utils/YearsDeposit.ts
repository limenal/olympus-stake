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
export function DepositAddDAI(token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearDaiEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearDaiEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new DepositYearDaiEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.token=token;
            year.depositCount = BigInt.fromString('1')

            year.save();
        }else{
            year= new DepositYearDaiEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            year.save();
        }
    }else {
        year.depositCount = year.depositCount.plus(BigInt.fromString('1'))
        year.timestamp=timeStamp;
        year.amount= year.amount.plus(amount);
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        day.depositCount = BigInt.fromString('1')
        day.amount=amount;
        day.token=token;

        day.save();
        days.push(day.id)
        year.dayDeposit = days

        year.save()
    }else {
        day.timestamp=timeStamp;
        day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        day.amount=day.amount.plus(amount);
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        hour.amount=amount;
        hour.depositCount = BigInt.fromString('1')
        hour.token=token;        

        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;

        day.save();
    }else {
        hour.depositCount =hour.depositCount.plus(BigInt.fromString('1'))

        hour.timestamp=timeStamp;
        hour.amount=hour.amount.plus(amount);
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        minute.depositCount = BigInt.fromString('1')
        minute.amount=amount;
        minute.token=token;      
        minute.save();

        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))
        minute.timestamp=timeStamp;
        minute.amount=minute.amount.plus(minute.amount);
        minute.token=token;        
        minute.save();

    }

    let seconds = minute.secondDeposit;
    let second =Deposit.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new Deposit(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedDAI = counter.totalDepositedDAI.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.depositCount = BigInt.fromString('1')
        second.totalDepositedDAI = counter.totalDepositedDAI
        second.timestamp=timeStamp;
        second.amount=amount;
        second.token=token;
        second.save();
        seconds.push(second.id);
        minute.secondDeposit=seconds;
        minute.save();
    }
    else
    {
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedDAI = counter.totalDepositedDAI.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.totalDepositedDAI = counter.totalDepositedDAI
        second.depositCount = second.depositCount.plus(BigInt.fromString('1'))
        second.timestamp=timeStamp;
        second.amount=second.amount.plus(amount);
        second.token=token;
        second.save();
    }

}

/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddETH(  token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearETHEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearETHEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new DepositYearETHEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            year.save();
        }else{
            year= new DepositYearETHEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            year.save();
        }
    }else {
        year.depositCount = year.depositCount.plus(BigInt.fromString('1'))
        year.timestamp=timeStamp;
        year.amount= year.amount.plus(amount)
        year.token=token
        year.save()
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        day.depositCount = BigInt.fromString('1')
        day.amount=amount;
        day.token=token;
        day.save();
        days.push(day.id)
        year.dayDeposit = days
        year.save()
    }else {
        day.timestamp=timeStamp;
        day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        day.amount=day.amount.plus(amount);
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        hour.amount=amount;
        hour.depositCount = BigInt.fromString('1')
        hour.token=token;        
        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;
        day.save();
    }else {
        hour.depositCount =hour.depositCount.plus(BigInt.fromString('1'))

        hour.timestamp=timeStamp;
        hour.amount=hour.amount.plus(amount);
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        minute.depositCount = BigInt.fromString('1')
        minute.amount=amount;
        minute.token=token;        
        minute.save();
        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        minute.timestamp=timeStamp;
        minute.amount=minute.amount.plus(minute.amount);
        minute.token=token;        
        minute.save();

    }

    let seconds = minute.secondDeposit;
    let second =Deposit.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new Deposit(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedETH = counter.totalDepositedETH.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.depositCount = BigInt.fromString('1')
        second.totalDepositedETH = counter.totalDepositedETH
        second.timestamp=timeStamp;
        second.amount=amount;
        second.token=token;
        second.save();
        seconds.push(second.id);
        minute.secondDeposit=seconds;
        minute.save();
    }
    else
    {
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedETH = counter.totalDepositedETH.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.totalDepositedETH = counter.totalDepositedETH
        second.depositCount = second.depositCount.plus(BigInt.fromString('1'))
        second.timestamp=timeStamp;
        second.amount=second.amount.plus(amount);
        second.token=token;
        second.save();
    }

}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddFrax( token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearFraxEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearFraxEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new DepositYearFraxEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            year.save();
        }else{
            year= new DepositYearFraxEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            // year.totalDeposit = counter.id
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            year.save();
        }
    }else {
        year.depositCount = year.depositCount.plus(BigInt.fromString('1'))
        year.timestamp=timeStamp;
        year.amount= year.amount.plus(amount);
        year.token=token
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        day.depositCount = BigInt.fromString('1')
        day.amount=amount;
        day.token=token;
        day.save();
        days.push(day.id)
        year.dayDeposit = days
        year.save()
    }else {
        day.timestamp=timeStamp;
        day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        day.amount=day.amount.plus(amount);
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        hour.amount=amount;
        hour.depositCount = BigInt.fromString('1')
        hour.token=token;        
        hour.save();
        hours.push(hour.id);

        day.hourDeposit=hours;
        day.save();
    }else {
        hour.depositCount =hour.depositCount.plus(BigInt.fromString('1'))

        hour.timestamp=timeStamp;
        hour.amount=hour.amount.plus(amount);
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        minute.depositCount = BigInt.fromString('1')
        minute.amount=amount;
        minute.token=token;        
        minute.save();

        minutes.push(minute.id);

        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        minute.timestamp=timeStamp;
        minute.amount=minute.amount.plus(minute.amount);
        minute.token=token;        
        minute.save();

    }

    let seconds = minute.secondDeposit;
    let second =Deposit.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new Deposit(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);
        
        second.depositCount = BigInt.fromString('1')
        second.timestamp=timeStamp;
        second.amount=amount;
        second.token=token;
        // second.totalDeposit = counter.id
        second.save();
        seconds.push(second.id);
        minute.secondDeposit=seconds;
        minute.save();
    }
    else
    {
        
        second.depositCount = second.depositCount.plus(BigInt.fromString('1'))
        second.timestamp=timeStamp;
        second.amount=second.amount.plus(amount);
        second.token=token;
        second.save();
    }
}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddLusd( token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearLusdEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearLusdEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new DepositYearLusdEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            year.save();
        }else{
            year= new DepositYearLusdEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            year.save();
        }
    }else {
        year.depositCount = year.depositCount.plus(BigInt.fromString('1'))
        year.timestamp=timeStamp;
        year.amount= year.amount.plus(amount);
        year.token=token;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        day.depositCount = BigInt.fromString('1')
        day.amount=amount;
        day.token=token;
        day.save();
        days.push(day.id)
        year.dayDeposit = days
        year.save()
    }else {
        day.timestamp=timeStamp;
        day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        day.amount=day.amount.plus(amount);
        day.token=token;        
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        hour.amount=amount;
        hour.depositCount = BigInt.fromString('1')
        hour.token=token;        
        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;
        day.save();
    }else {
        hour.depositCount =hour.depositCount.plus(BigInt.fromString('1'))

        hour.timestamp=timeStamp;
        hour.amount=hour.amount.plus(amount);
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        minute.depositCount = BigInt.fromString('1')
        minute.amount=amount;
        minute.token=token;        
        minute.save();
        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        minute.timestamp=timeStamp;
        minute.amount=minute.amount.plus(minute.amount);
        minute.token=token;        
        minute.save();

    }

    let seconds = minute.secondDeposit;
    let second =Deposit.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new Deposit(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedLUSD = counter.totalDepositedLUSD.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.depositCount = BigInt.fromString('1')
        second.totalDepositedLUSD = counter.totalDepositedLUSD
        second.timestamp=timeStamp;
        second.amount=amount;
        second.token=token;
        second.save();
        seconds.push(second.id);
        minute.secondDeposit=seconds;
        minute.save();
    }
    else
    {
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedLUSD = counter.totalDepositedLUSD.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.totalDepositedLUSD = counter.totalDepositedLUSD
        second.depositCount = second.depositCount.plus(BigInt.fromString('1'))
        second.timestamp=timeStamp;
        second.amount=second.amount.plus(amount);
        second.token=token;
        // second.totalDeposit = counter.id
        second.save();
    }
}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddOHMDAI( token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearOHMDAIEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearOHMDAIEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new DepositYearOHMDAIEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            // year.totalDeposit = counter.id
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            // year.sender.push(sender);
            year.save();
        }else{
            year= new DepositYearOHMDAIEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            // year.totalDeposit = counter.id
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            // year.sender.push(sender);
            year.save();
        }
    }else {
        year.depositCount = year.depositCount.plus(BigInt.fromString('1'))
        year.timestamp=timeStamp;
        year.amount= year.amount.plus(amount);
        // year.totalDeposit = counter.id
        year.token=token;        // year.sender.push(sender);
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        day.depositCount = BigInt.fromString('1')
        day.amount=amount;
        // day.totalDeposit = counter.id
        day.token=token;        // year.sender.push(sender);
        day.save();
        days.push(day.id)
        year.dayDeposit = days
        year.save()
    }else {
        day.timestamp=timeStamp;
        day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        day.amount=day.amount.plus(amount);
        // day.totalDeposit = counter.id
        day.token=token;        
        // year.sender.push(sender);
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        hour.amount=amount;
        hour.depositCount = BigInt.fromString('1')
        // hour.totalDeposit = counter.id
        hour.token=token;        
        // year.sender.push(sender);
        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;
        day.save();
    }else {
        hour.depositCount =hour.depositCount.plus(BigInt.fromString('1'))

        hour.timestamp=timeStamp;
        hour.amount=hour.amount.plus(amount);
        // hour.totalDeposit = counter.id
        hour.token=token;        
        // year.sender.push(sender);
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        minute.depositCount = BigInt.fromString('1')
        minute.amount=amount;
        // minute.totalDeposit = counter.id
        minute.token=token;        
        minute.save();
        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        minute.timestamp=timeStamp;
        minute.amount=minute.amount.plus(minute.amount);
        // minute.totalDeposit = counter.id
        minute.token=token;        
        minute.save();

    }

    let seconds = minute.secondDeposit;
    let second =Deposit.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new Deposit(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedOHMDAI = counter.totalDepositedOHMDAI.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.depositCount = BigInt.fromString('1')
        second.totalDepositedOHMDAI = counter.totalDepositedOHMDAI
        second.timestamp=timeStamp;
        second.amount=amount;
        second.token=token;
        // second.totalDeposit = counter.id
        second.save();
        seconds.push(second.id);
        minute.secondDeposit=seconds;
        minute.save();
    }
    else
    {
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedOHMDAI = counter.totalDepositedOHMDAI.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.totalDepositedOHMDAI = counter.totalDepositedOHMDAI
        second.depositCount = second.depositCount.plus(BigInt.fromString('1'))
        second.timestamp=timeStamp;
        second.amount=second.amount.plus(amount);
        second.token=token;
        // second.totalDeposit = counter.id
        second.save();
    }
}
/**
     * @dev : Add deposits to graph
     * @param token - Deposit token
     * @param amount - Amount of tokens to deposit
     * @param timeStamp - Timestamp of transaction block
*/
export function DepositAddOHMFRAX( token:string, amount:BigDecimal, timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositYearOHMFRAXEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositYearOHMFRAXEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new DepositYearOHMFRAXEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            // year.totalDeposit = counter.id
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            // year.sender.push(sender);
            year.save();
        }else{
            year= new DepositYearOHMFRAXEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            // year.totalDeposit = counter.id
            year.token=token;
            year.depositCount = BigInt.fromString('1')
            // year.sender.push(sender);
            year.save();
        }
    }else {
        year.depositCount = year.depositCount.plus(BigInt.fromString('1'))
        year.timestamp=timeStamp;
        year.amount= year.amount.plus(amount);
        // year.totalDeposit = counter.id
        year.token=token;        // year.sender.push(sender);
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        day.depositCount = BigInt.fromString('1')
        day.amount=amount;
        // day.totalDeposit = counter.id
        day.token=token;        // year.sender.push(sender);
        day.save();
        days.push(day.id)
        year.dayDeposit = days
        year.save()
    }else {
        day.timestamp=timeStamp;
        day.depositCount = day.depositCount.plus(BigInt.fromString('1'))
        day.amount=day.amount.plus(amount);
        // day.totalDeposit = counter.id
        day.token=token;        
        // year.sender.push(sender);
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour = DepositHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        hour.amount=amount;
        hour.depositCount = BigInt.fromString('1')
        // hour.totalDeposit = counter.id
        hour.token=token;        
        // year.sender.push(sender);
        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;
        day.save();
    }else {
        hour.depositCount =hour.depositCount.plus(BigInt.fromString('1'))

        hour.timestamp=timeStamp;
        hour.amount=hour.amount.plus(amount);
        hour.token=token;        
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;

        minute.depositCount = BigInt.fromString('1')
        minute.amount=amount;
        minute.token=token;        
        minute.save();
        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        
        minute.depositCount = minute.depositCount.plus(BigInt.fromString('1'))

        minute.timestamp=timeStamp;
        minute.amount=minute.amount.plus(minute.amount);
        minute.token=token;        
        minute.save();

    }

    let seconds = minute.secondDeposit;
    let second =Deposit.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new Deposit(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedOHMFRAX = counter.totalDepositedOHMFRAX.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.depositCount = BigInt.fromString('1')
        second.totalDepositedOHMFRAX = counter.totalDepositedOHMFRAX
        second.timestamp=timeStamp;
        second.amount=amount;
        second.token=token;
        second.save();
        seconds.push(second.id);
        minute.secondDeposit=seconds;
        minute.save();
    }
    else
    {
        let counter = Deposit.load('1')
        if(counter == null)
        {
            counter = new Deposit('1')
        }
        counter.totalDepositedOHMFRAX = counter.totalDepositedOHMFRAX.plus(amount)
        counter.depositCount = counter.depositCount.plus(BigInt.fromString('1'))
        counter.save()
        
        second.totalDepositedOHMFRAX = counter.totalDepositedOHMFRAX
        second.depositCount = second.depositCount.plus(BigInt.fromString('1'))
        second.timestamp=timeStamp;
        second.amount=second.amount.plus(amount);
        second.token=token;
        second.save();
    }
}