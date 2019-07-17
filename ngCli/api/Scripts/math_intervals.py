#!/usr/bin/python
# -*- coding: utf-8 -*-
from math_utils import distanceOfPoints
from math_utils import normalizer
from math import trunc
def getDistanceLabel(distances,classInfo):
    MIN = classInfo['start']
    INTERVAL = classInfo['interval']
    NAME_DISTANCES = getDistancesNames()
    distances_list = list()
    for x in range(0,len(distances) ):
        distanceIdx = trunc(distances[x] / INTERVAL) - 1
        if(distanceIdx == 3):
            distanceIdx -= 1
        interval = str("Distância " + str(NAME_DISTANCES[distanceIdx]))
        distances_list.append(interval)
    return distances_list

def allDistanceOfPairs(pdb):
    distanceList = list()
    for x in range(1,len(pdb)):
        distanceList.append(distanceOfPoints(pdb[x],pdb[x-1]))
    return distanceList
        
def getClassInfo(distances):
    NUMB_INTERVAL = 3
    interval = (max(distances) - min(distances)) / NUMB_INTERVAL
    return {'interval':interval,'start':min(distances)}

def getInfo(data):
    distances = allDistanceOfPairs(normalizer(data))
    classInfo = getClassInfo(distances)
    return getDistanceLabel(distances,classInfo)
def getTInfo(data):
    distances = allDistanceOfPairs(data)
    classInfo = {'interval': 1, 'start':1}
    return getDistanceLabel(distances,classInfo)

def getDistancesNames():
    NAME_DISTANCES = list()
    NAME_DISTANCES.append("Pequena.")
    NAME_DISTANCES.append("Média.")
    NAME_DISTANCES.append("Grande.")
    return NAME_DISTANCES