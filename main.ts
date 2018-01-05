//% weight=70 icon="\uf1e7" color=#64b8e0
namespace sourcekit {

    //% blockId=sourcekit_pick block="pick a %num"
    export function pick(num: number): void {
        serial.writeNumber(num)
        serial.writeLine("")
    }
}
