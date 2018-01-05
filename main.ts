//% weight=70 icon="\uf1e7" color=#EC7505
namespace sourcekit {

  //% blockId=sourcekit_pick block="pick a %num"
  export function pick(num: Number): void {
    serial.writeNumber(num)
    serial.writeLine("")
  }
}
