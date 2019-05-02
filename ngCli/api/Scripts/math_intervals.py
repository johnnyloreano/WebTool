from pprint import pprint
from math_utils import distanceOfPoints
from math_utils import normalizer
from math import trunc
def getDistanceLabel(distances,classInfo):
    MIN = classInfo['start']
    INTERVAL = classInfo['interval']
    NAME_DISTANCES = getDistancesNames()
    distances_list = list()
    distances_loc = dict()
    distances_loc['front'] = None
    distances_loc['back'] = None
    distances_list.append(distances_loc)
    for x in range(0,len(distances) ):
        distances_loc = dict()
        distances_loc['front'] = None
        distances_loc['back'] = None
        distances_list.append(distances_loc)
        distanceIdx = trunc(distances[x] / INTERVAL) - 1
        if(distanceIdx == 3):
            distanceIdx -= 1
        distances_list[x]['front'] = NAME_DISTANCES[distanceIdx]
        distances_list[x+1]['back'] = NAME_DISTANCES[distanceIdx]
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
    
def getDistancesNames():
    NAME_DISTANCES = list()
    NAME_DISTANCES.append("Pequeno")
    NAME_DISTANCES.append("Medio")
    NAME_DISTANCES.append("Grande")
    return NAME_DISTANCES