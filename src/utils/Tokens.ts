import {Token} from "../../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function loadOrCreateToken(name: string): Token{
    let token = Token.load(name)
    if (token == null) {
        token = new Token(name)
        token.save()
    }
    return token as Token
}

export function loadOrCreateSecondToken(_token : Bytes,timestamp:BigInt):Token {
    let token = Token.load(_token.toHexString());
    if(token==null){
        token =new Token(_token.toHexString());
        token.timestamp= timestamp;
        token.save();
    }
    return token as Token;
}
