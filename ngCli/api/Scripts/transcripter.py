from prody_utils import getCoord
from math_hour import *
from math_intervals import getInfo as intervalInfo

def generateText(hour):
    message = None
    if hour >= 11 or hour <= 2:
        message = 'Subindo'
    if hour > 2 and hour < 5:
        message = 'Indo para a direita'
    if hour >= 5 and hour <= 7:
        message = 'Descendo'
    if hour > 7 and hour < 11:
        message = 'Indo para a esquerda'
    return message + " " +str(hour) +" horas"
def generateFQuadrant(quadrant):
    if quadrant == 1:
        return 'Quadrante Superior Direito'
    elif quadrant == 2:
        return 'Quadrante Superior Esquerdo'
    elif quadrant == 3 :
        return 'Quadrante Inferior Esquerdo'
    return 'Quadrante Inferior Direito'

def generateTransitions(curr,pred):
    info = getInfo(curr,pred)
    return [generateText(info[1]),generateText(info[0])]

def generateInterval(coords):
    return intervalInfo(coords)