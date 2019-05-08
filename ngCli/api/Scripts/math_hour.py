from math import degrees
from math_utils import *
def getRelativeQuadrant(pos,posRelative):
    posX = delta(pos[0],posRelative[0])
    posY = delta(pos[1],posRelative[1])
    print("X = ",posX)
    print("Y = ",posY)
    if posX < 0:
        if posY < 0:
            return 3
        elif posY > 0:
            return 2
        else:
            return 3 # V

    elif posX > 0:
        if posY > 0:
            return 1
        elif posY < 0:
            return 4
        else:
            return 4 # V

    elif posX == 0:
        if posY > 0:
            return 1
        elif posY < 0:
            return 4

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
    return degree + auxMult * 90

def fixDegree(curr,pred,quadrants,degrees):
    result = None
    if(curr[0] > pred[0]):
        if(curr[1] < pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['X'],quadrants['predAmino'])
            }
        elif(curr[1] > pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants['predAmino'])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['X'],quadrants['predAmino'])
            }
    elif(curr[0] > pred[0]):    
        if(curr[1] < pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants['predAmino'])
            }
        elif(curr[1] > pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['X'],quadrants['predAmino'])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants['predAmino'])
            }
    else :
        if(curr[1] < pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['X'],quadrants['predAmino'])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants['currAmino']),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants['predAmino'])
            }
    print(result)
    print('\n')
    return result

def toHour(degree):
    hour = int(round(degree / 30.0))
    if hour == 0:
        hour = 12
    return hour
    
def getInfo(currAmino, predAmino):
    DEGREES = angleIn2Points(currAmino,predAmino)
    print(DEGREES)
    QUADRANTS = {
        'currAmino':getRelativeQuadrant(currAmino,predAmino),
        'predAmino':getRelativeQuadrant(predAmino,currAmino)
        }
    print(QUADRANTS)
    CORRECT_DEGREE = fixDegree(currAmino,predAmino,QUADRANTS,DEGREES)
    HOURS = [toHour(CORRECT_DEGREE['curr']),
            toHour(CORRECT_DEGREE['pred'])]
    print(HOURS)
    return HOURS