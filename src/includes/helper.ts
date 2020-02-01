import { WalkerRender, DonationRender } from './../types';

export enum Course {
    DE = "DE", // Deutsch
    MA = "MA", // Mathe
    EN = "EN", // Englisch
    PA = "PA" // Paedagogik
}

export function round(x: number) : number {
    return Math.round((x + Number.EPSILON) * 100) / 100;
}

export function courseToString(c: Course | string) : string {
    switch (c) {
        case Course.DE:
        case "DE":
            return "Deustch"
            break;
        case Course.EN:
        case "EN":
            return "Englisch"
            break;
        case Course.MA:
        case "ME":
            return "Mathe";
            break;
        case Course.PA:
        case "PA":
            return "Pädagogik"
            break;
        default:
            return ""
            break;
    }
}

type NamedObject = {
    firstname: string,
    lastname: string
};

export function getNameFunction(this: NamedObject ) : string {
    return this.firstname + " " + this.lastname;
}

declare global {
    interface String {
        left(pos: number) : string;
        getCharFromString(pos: number) : string;
        right(pos: number) : string;
        capitalize(pos?: number) : string;
    }
    interface Math {
        roundFloat(floatnumber: number, ppl?: number) : number;
        decimalPlace(floatnumber: number, ppl?: number) : number;
        isNegative(_number: number) : boolean;
    }
}

Math.roundFloat = function(floatnumber: number, ppl?: number) : number {
    (ppl==undefined)?ppl=0:ppl;
    return Math.round(floatnumber*Math.pow(10,ppl))/Math.pow(10,ppl);
};

Math.decimalPlace = function(floatnumber: number, ppl?: number) : number {
    (ppl==undefined)?ppl=0:ppl;
    return Math.roundFloat((floatnumber-parseInt(floatnumber.toString())),ppl)*Math.pow(10,ppl);
};

Math.isNegative = function(_number: number) : boolean {
    return(_number<0)?true:false;
};

String.prototype.left = function(pos: number) : string {
    pos=(pos>this.length)?this.length:pos;
    return this.substr(0,pos);
};

String.prototype.getCharFromString=function(pos?: number) : string {
    (pos==undefined)?pos=0:pos;
    return this.substr(pos,1);
};

String.prototype.right=function(pos: number) : string {
    pos=(pos>this.length)?this.length:pos;
    return this.substr(this.length-pos,pos);
};

String.prototype.capitalize=function(pos?: number) : string {
    (pos==undefined)?pos=0:pos;
    return this.left(pos).concat(this.getCharFromString(pos).toUpperCase().concat(this.right(this.length-(pos+1))));
};


export class SpellNumber {

    private to20: string[];
    private h10: string[];
    private h1000: string[];
    private spnum: any;
    private nafs: string;
    private _number: number;

    constructor(_number: number) {
        this.to20 = new Array(
            "","ein","zwei","drei","vier",
            "f\u00fcnf","sechs","sieben",
            "acht","neun","zehn","elf","zw\u00f6lf",
            "dreizehn","vierzehn","f\u00fcnfzehn",
            "sechzehn","siebzehn","achtzehn","neunzehn"
        );

        this.h10 = new Array(
            "","zehn","zwanzig",
            "dreißig","vierzig","f\u00fcnfzig",
            "sechzig","siebzig",
            "achtzig","neunzig"
        );

        this.h1000 = new Array("","tausend","million","milliard");

        this._number = _number;
        this.nafs = "";
    }

    public spell(capitalize?: boolean) : string {
        let neg: boolean = Math.isNegative(this._number);
        let dP: number = parseInt(Math.decimalPlace(Math.abs(this._number),2).toString());
        let wDP: boolean = false;
        let cap: boolean = (capitalize==undefined) ? capitalize = false : capitalize;
        let sN = (cap == true) ?
            this._tPot(
                parseInt(
                    Math.abs(this._number).toString()
                )
            ).capitalize()
        :
            this._tPot(
                parseInt(
                    Math.abs(this._number).toString()
                )
            )
        ;
        //@ts-ignore
        return ((wDP == true) ? sN.concat(" ").concat(dP).concat("/100"):sN);
    }

    public spellwDP(capitalize?: boolean) : string  {
        let neg: boolean = Math.isNegative(this._number);
        let dP: number = parseInt(Math.decimalPlace(Math.abs(this._number),2).toString());
        let wDP: boolean = true;
        let cap: boolean = (capitalize==undefined) ? capitalize = false : capitalize;
        let sN = (cap == true) ?
            this._tPot(
                parseInt(
                    Math.abs(this._number).toString()
                )
            ).capitalize()
        :
            this._tPot(
                parseInt(
                    Math.abs(this._number).toString()
                )
            )
        ;
        //@ts-ignore
        return ((wDP == true) ? sN.concat(" ").concat(dP).concat("/100"):sN);
    }

    public getSigned() : string {
        return(Math.isNegative(this._number)==true)?"-":"+";
    }

    public getSignedWord() : string {
        return(Math.isNegative(this._number)==true)?"negative":"positive";
    }

    private _spellNumber(n: number) : any {
        if((n%100)<20) {
            this.spnum=this.to20[(n%100)];
        } else {
            //@ts-ignore
            this.spnum=this.to20[n%10].toString().concat((((n%100)%10)>0)?"und":"").concat(this.h10[parseInt((n%100)/10)]);
        }
        if((((n%1000)-(n%100))/100)>0) {
            return this.to20[(((n%1000)-(n%100))/100)].toString().concat("hundert").concat(this.spnum);
        } else {
            return this.spnum;
        }
    }

    private _tPot(n: number) : string {
        if(n.toString().length%3==2) {
            this.nafs="0".concat(n.toString());
        } else if(n.toString().length%3==1) {
            this.nafs="00".concat(n.toString());
        } else {
            this.nafs=n.toString();
        }
        let pot: number = parseInt((this.nafs.length/3).toString());
        let x: string = "";
        let pot2: number = pot;
        for(let i: number = 0; i < pot; i++) {
            if(pot2==3||pot2==4) {
                if(parseInt(parseFloat(this.nafs.substr(i*3,3)).toString())==1) {
                    x=x+this._spellNumber(parseInt(parseFloat(this.nafs.substr(i*3,3)).toString())).concat("e").concat(this.h1000[pot2-1]).concat((pot2==3)?"":"e");
                } else if(parseInt(parseFloat(this.nafs.substr(i*3,3)).toString())>1) {
                    x=x+this._spellNumber(parseInt(parseFloat(this.nafs.substr(i*3,3)).toString())).concat(this.h1000[pot2-1].concat("en"));
                }
            } else {
                x=x+this._spellNumber(parseInt(parseFloat(this.nafs.substr(i*3,3)).toString()))+this.h1000[(parseInt(parseFloat(this.nafs.substr(i*3,3)).toString())==0)?0:pot2-1];
            }
            pot2--;
        }
        if(x.substr(x.length-3,3)=="ein") {
            x=x.concat("s");
        }

        return x;
    }
}