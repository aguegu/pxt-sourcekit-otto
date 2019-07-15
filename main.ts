//% weight=70 icon="\uf1e7" color=#64b8e0
namespace sourcekit {

    let uid = 0;
    let head = pins.createBuffer(3);

    export enum Servo {
        RR,
        RL,
        YR,
        YL,
    };

    export enum Easing {
        Linear = 0,
        SineIn = 1,
        SineOut = 2,
        SineInOut = 3,
        // QuadIn = 4,
        // QuadOut = 5,
        // QuadInOut = 6,
        // CubicIn = 7,
        // CubicOut = 8,
        // CubicInOut = 9,
        QuarticIn = 10,
        QuarticOut = 11,
        QuarticInOut = 12,
        // ExponentialIn = 13,
        // ExponentialOut = 14,
        // ExponentialInOut = 15,
        // CircularIn = 16,
        // CircularOut = 17,
        // CircularInOut = 18,
        BackIn = 19,
        BackOut = 20,
        BackInOut = 21,
        ElasticIn = 22,
        ElasticOut = 23,
        ElasticInOut = 24,
        BounceIn = 25,
        BounceOut = 26,
        BounceInOut = 27,
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

    //% blockId=sourcekit_init()
    //% block="init otto";
    export function init(tx: SerialPin = SerialPin.P13, rx: SerialPin = SerialPin.P14) {
        serial.redirect(tx, rx, 115200);
    }

    //% blockId=sourcekit_moveto block="move %servo to %angle ° in %span ms style %curve"
    //% angle.min=0 angle.max=180
    export function moveto(index: Servo, angle: number, span: number, curve: Easing): void {
        let payload = pins.createBuffer(7);
        payload.setNumber(NumberFormat.UInt8LE, 0, 0x05);
        payload.setNumber(NumberFormat.UInt8LE, 1, index);
        payload.setNumber(NumberFormat.UInt16LE, 2, angle);
        payload.setNumber(NumberFormat.UInt16LE, 4, span / 10);
        payload.setNumber(NumberFormat.UInt8LE, 6, curve);
        transmit(payload);
    }

    //% blockId=sourcekit_oscillate block="oscillate servo #%servo |Amplitude(°) %amplitude |in(ms) %span|Phase(°) %phase"
    export function oscillate(index: Servo, amplitude: number, span: number, phase: number): void {
        let payload = pins.createBuffer(8);
        payload.setNumber(NumberFormat.UInt8LE, 0, 0x06);
        payload.setNumber(NumberFormat.UInt8LE, 1, index);
        payload.setNumber(NumberFormat.Int16LE, 2, amplitude);
        payload.setNumber(NumberFormat.UInt16LE, 4, span / 10);
        payload.setNumber(NumberFormat.Int16LE, 6, phase);
        transmit(payload);
    }

    //% blockId=sourcekit_all block="move servo all to degree(°) %angle |in(ms) %span"
    export function all(angle: number, span: number, curve = Easing.Linear): void {
        let payload = pins.createBuffer(1 + 6 * 4);
        payload.setNumber(NumberFormat.UInt8LE, 0, 0x05);
        for (let i = 0; i < 4; i++) {
            payload.setNumber(NumberFormat.UInt8LE, i * 6 + 1, i);
            payload.setNumber(NumberFormat.UInt16LE, i * 6 + 2, angle);
            payload.setNumber(NumberFormat.UInt16LE, i * 6 + 4, span / 10);
            payload.setNumber(NumberFormat.UInt8LE, i * 6 + 6, curve);
        }
        transmit(payload);
    }

    function setPosition(index: Servo, angle: number): void {
        let payload = pins.createBuffer(4);
        payload.setNumber(NumberFormat.UInt8LE, 0, 0x08);
        payload.setNumber(NumberFormat.UInt8LE, 1, index);
        payload.setNumber(NumberFormat.Int16LE, 2, angle);
        transmit(payload);
    }

    //% blockId=sourcekit_turn_right block="turn right in %span |ms"
    export function turnRight(span: number) {
        oscillate(
            Servo.RR,
            16,
            span,
            270
        )
        oscillate(
            Servo.RL,
            30,
            span,
            270
        )
        oscillate(
            Servo.YR,
            30,
            span,
            0
        )
        oscillate(
            Servo.YL,
            15,
            span,
            270
        )
        basic.pause(span);
    }

    //% blockId=sourcekit_turn_left block="turn left in %span |ms"
    export function turnLeft(span: number) {
        oscillate(
            Servo.RR,
            30,
            span,
            90
        )
        oscillate(
            Servo.RL,
            16,
            span,
            90
        )
        oscillate(
            Servo.YR,
            15,
            span,
            90
        )
        oscillate(
            Servo.YL,
            30,
            span,
            180
        )
        basic.pause(span);
    }


}
