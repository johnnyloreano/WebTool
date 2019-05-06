from math import degrees
from math_utils import *
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
    # print(degree)
    # print(quadrant)
    # print(degree + (auxMult * 90))
    return degree + (auxMult * 90)

def toHour(degree):
    hour = int(round(degree / 30.0))
    if hour == 0:
        hour = 12
    return hour

def fixDegree(curr,pred,quadrants,degrees):
    result = None
    if(curr[0] < pred[0]):
        if(curr[1] < pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants['predAmino'])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['X'],quadrants['predAmino'])
            }
    else:
        if(curr[1] < pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants['predAmino'])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['X'],quadrants['predAmino'])
            }
    return result

def getInfo(currAmino, predAmino):
    DEGREES = angleIn2Points(currAmino,predAmino)
    QUADRANTS = {
        'currAmino':getRelativeQuadrant(currAmino,predAmino),
        'predAmino':getRelativeQuadrant(predAmino,currAmino)
        }
    CORRECT_DEGREE = fixDegree(currAmino,predAmino,QUADRANTS,DEGREES)
    HOURS = [toHour(CORRECT_DEGREE['pred']),
            toHour(CORRECT_DEGREE['curr'])]
    return HOURS