from microbit import uart, sleep, pin13, pin14
from struct import pack

uid = 0

# servo: 
#   RR: 0
#   RL: 1
#   YR: 2
#   YL: 3

# easing:
#   Linear: 0
#   SineIn: 1
#   SineOut: 2
#   SineInOut: 3
#   QuadIn: 4
#   QuadOut: 5
#   QuadInOut: 6
#   CubicIn: 7
#   CubicOut: 8
#   CubicInOut: 9
#   QuarticIn: 10
#   QuarticOut: 11
#   QuarticInOut: 12
#   ExponentialIn: 13
#   ExponentialOut: 14
#   ExponentialInOut: 15
#   CircularIn: 16
#   CircularOut: 17
#   CircularInOut: 18
#   BackIn: 19
#   BackOut: 20
#   BackInOut: 21
#   ElasticIn: 22
#   ElasticOut: 23
#   ElasticInOut: 24
#   BounceIn: 25
#   BounceOut: 26
#   BounceInOut: 27

def transmit(payload):
    global uid
    tx = bytes([len(payload) + 2, uid, 0xff - uid]) + payload    
    uart.write(tx)
    uid += 1
    uid &= 0xff

# angle in range(0, 180)
def moveTo(servo, angle, ms=10, easing = 0): 
    transmit(pack('<BBHHB', 0x05, servo, angle, int(ms / 10), easing))   

def oscillate(servo, amplitude, ms=10, phase=0):    
    transmit(pack('<BBhHh', 0x06, servo, amplitude, int(ms / 10), phase))

if __name__ == '__main__':
    uart.init(baudrate=115200, bits=8, parity=None, stop=1, tx=pin13, rx=pin14)
    
    moveTo(0, 90)
    moveTo(1, 90)
    moveTo(2, 90)
    moveTo(3, 90)
    sleep(10)
    
    while True:
        oscillate(0, 90, 1000)
        oscillate(1, 90, 1000, 90)
        oscillate(2, 90, 1000, 180)
        oscillate(3, 90, 1000, -90)
        sleep(1000)
        
        sleep(2000)
        