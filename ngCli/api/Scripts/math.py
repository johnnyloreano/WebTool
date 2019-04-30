from math import degrees
from math import atan2
from math import ceil
from math import trunc
def delta(val1,val2):
    return abs(val2 - val1)

def angleIn2Points(pos1,pos2):
    deltaX = delta(pos1[0],pos2[0])
    deltaY = delta(pos1[1],pos2[1])
    degreesVal = dict()
    degreesVal['X'] = degrees(atan2(deltaY,deltaX))
    degreesVal['Y'] = 90 - degreesVal['X']
    return degreesVal

def getRelativeQuadrant(pos,posRelative):
    
    if pos[0] > posRelative[0]:
        if pos[1] > posRelative[1]:
            return 1
        else:
            return 4
    elif pos[0] < posRelative[0]:
        if pos[1] > posRelative[1]:
            return 2
        else:
            return 3
    elif pos[0] == posRelative[0]:
        if pos[1] > posRelative[1]:
            return 1
        else:
            return 4
            
def getPointQuadrant(pos,valueRelative):
    if pos[0] > valueRelative:
        if pos[1] > valueRelative:
            return 1
        else:
            return 4
    elif pos[0] < valueRelative:
        if pos[1] > valueRelative:
            return 2
        else:
            return 3

def degreeOnQuadrant(degree,quadrant):
    auxMult = 0
    if quadrant == 1:
        auxMult = 0
    elif quadrant == 2:
        auxMult = 3
    elif quadrant == 3:
        auxMult = 2
    elif quadrant == 4:
        auxMult = 1
    return degree + (auxMult * 90)

def toHour(degree):
    wholeHours = degree / 30.0
    hour = trunc(wholeHours)
    minutes = wholeHours - hour
    if minutes > 50:
        hour += 1
    if hour == 0:
        hour = 12
    return hour

print toHour(255)