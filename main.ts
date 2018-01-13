//% weight=70 icon="\uf1e7" color=#64b8e0
namespace sourcekit {

    let uid = 0;
    let head = pins.createBuffer(3);
    let mids = [306, 306, 306, 306];

    export enum Servo {
        YL,
        YR,
        RL,
        RR,
    }

    export enum Easing {
        Linear,
        SineIn,
        SineOut,
        SineInOut,
        QuadIn,
        QuadOut,
        QuadInOut,
        CubicIn,
        CubicOut,
        CubicInOut,
        QuarticIn,
        QuarticOut,
        QuarticInOut,
        ExponentialIn,
        ExponentialOut,
        ExponentialInOut,
        CircularIn,
        CircularOut,
        CircularInOut,
        BackIn,
        BackOut,
        BackInOut,
        ElasticIn,
        ElasticOut,
        ElasticInOut,
        BounceIn,
        BounceOut,
        BounceInOut,
    }

    function transmit(payload: Buffer) {
        head.setNumber(NumberFormat.Int8LE, 0, payload.length + 2);
        head.setNumber(NumberFormat.Int8LE, 1, uid);
        head.setNumber(NumberFormat.Int8LE, 2, 255 - uid);
        uid++;
        uid = uid & 0xff;
        serial.writeBuffer(head);
        serial.writeBuffer(payload);
    }

    //% blockId=sourcekit_setmiddle
    //% block="set Middle(90°) YL %yl |YR %yr |RL %rl | RR %rr"
    export function setMiddle(yl: number, yr: number, rl: number, rr: number) {
        mids[Servo.YL] = yl;
        mids[Servo.YR] = yr;
        mids[Servo.RL] = rl;
        mids[Servo.RR] = rr;
    }

    //% blockId=sourcekit_moveto block="move servo #%servo |to degree(°) %angle |in (ms) %span ms|style %curve"
    //% angle.min=0 angle.max=180
    export function moveto(index: Servo, angle: number, span: number, curve: Easing): void {
        let payload = pins.createBuffer(7);
        let width = mids[index] + (angle - 90) * 34 / 15;
        payload.setNumber(NumberFormat.UInt8LE, 0, 0x01);
        payload.setNumber(NumberFormat.UInt8LE, 1, index);
        payload.setNumber(NumberFormat.UInt16LE, 2, width);
        payload.setNumber(NumberFormat.UInt16LE, 4, span / 10);
        payload.setNumber(NumberFormat.UInt8LE, 6, curve);
        transmit(payload);
    }

    //% blockId=sourcekit_oscillate block="oscillate servo #%servo |Amplitude %amplitude |in (ms) %span ms|Phase %phase"
    export function oscillate(index: Servo, amplitude: number, span: number, phase: number): void {
        let payload = pins.createBuffer(8);
        let width = amplitude * 34 / 15;
        payload.setNumber(NumberFormat.UInt8LE, 0, 0x02);
        payload.setNumber(NumberFormat.UInt8LE, 1, index);
        payload.setNumber(NumberFormat.Int16LE, 2, width);
        payload.setNumber(NumberFormat.UInt16LE, 4, span / 10);
        payload.setNumber(NumberFormat.Int16LE, 6, phase);
        transmit(payload);
    }

    //% blockId=sourcekit_all block="move servo all to degree(°) %angle |in (ms) %span ms|style %curve"
    export function all(angle: number, span: number, curve: Easing): void {
        let payload = pins.createBuffer(1 + 6 * 4);
        payload.setNumber(NumberFormat.UInt8LE, 0, 0x01);
        for (let i = 0; i < 4; i++) {
            let width = mids[i] + (angle - 90) * 34 / 15;
            payload.setNumber(NumberFormat.UInt8LE, i * 6 + 1, i);
            payload.setNumber(NumberFormat.UInt16LE, i * 6 + 2, width);
            payload.setNumber(NumberFormat.UInt16LE, i * 6 + 4, span / 10);
            payload.setNumber(NumberFormat.UInt8LE, i * 6 + 6, curve);
        }
        transmit(payload);
    }
}
