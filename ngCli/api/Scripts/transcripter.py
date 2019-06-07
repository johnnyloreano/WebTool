#!/usr/bin/python
# -*- coding: utf-8 -*-
from prody_utils import getCoord
from math_hour import *
from math_intervals import getInfo as intervalInfo

def generateText(hour):
    message = "Transição : "
    if hour >= 11 or hour <= 2:
        message += 'Subindo'
    if hour > 2 and hour < 5:
        message += 'Indo para a direita'
    if hour >= 5 and hour <= 7:
        message += 'Descendo'
    if hour > 7 and hour < 11:
        message += 'Indo para a esquerda'
    if hour > 1:
        return message + " " +str(hour) +" horas"
    else:
        return message + " " +str(hour) +" hora"
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
    return generateText(info[1])

def generateInterval(coords):
    return intervalInfo(coords)