from math import degrees
from math_utils import *
def getQuadrant(pos,posRelative):
    posX = delta(pos[0],posRelative[0])
    posY = delta(pos[1],posRelative[1])
    if posX > 0:
        if posY > 0:
            return [0,2]
        elif posY < 0:
            return [1,3]
        else:
            return [1,3]

    if posX < 0:
        if posY > 0:
            return [3,1]
        elif posY < 0:
            return [2,0]
        else:
            return [3,1]
    else:
        if posY > 0:
            return [0,1]
        if posY < 0:
            return [1,0]

def degreeOnQuadrant(degree,quadrant):
    return degree + quadrant * 90

def fixDegree(curr,pred,quadrants,degrees):
    result = None
    if(curr[0] > pred[0]):
        if(curr[1] < pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['X'],quadrants[1])
            }
        elif(curr[1] > pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants[1])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['X'],quadrants[1])
            }
    elif(curr[0] < pred[0]):    
        if(curr[1] < pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants[1])
            }
        elif(curr[1] > pred[1]):
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['X'],quadrants[1])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['X'],quadrants[1])
            }
    else:
        if(curr[1] > pred [1]):
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['Y'],quadrants[1])
            }
        elif(curr[1] < pred [1]):
            result = {
                'curr': degreeOnQuadrant(degrees['Y'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['X'],quadrants[1])
            }
        else:
            result = {
                'curr': degreeOnQuadrant(degrees['X'],quadrants[0]),
                'pred': degreeOnQuadrant(degrees['X'],quadrants[1])
            }
    return result

def toHour(degree):
    hour = int(round(degree / 30.0))
    if hour == 0:
        hour = 12
    return hour
    
def getInfo(currAmino, predAmino):
    DEGREES = angleIn2Points(currAmino,predAmino)
    QUADRANTS = getQuadrant(currAmino,predAmino)
    CORRECT_DEGREE = fixDegree(currAmino,predAmino,QUADRANTS,DEGREES)
    HOURS = [toHour(CORRECT_DEGREE['curr']),
            toHour(CORRECT_DEGREE['pred'])]
    return HOURS