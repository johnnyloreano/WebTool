from math import degrees
from math import atan2
from math import trunc
from math import hypot
import numpy as np

def delta(val1,val2):
    return abs(val2 - val1)

def angleIn2Points(pos1,pos2):
    deltaX = delta(pos1[0],pos2[0])
    deltaY = delta(pos1[1],pos2[1])
    degreesVal = dict()
    degreesVal['X'] = degrees(atan2(deltaY,deltaX))
    degreesVal['Y'] = 90 - degreesVal['X']
    return degreesVal

def distanceOfPoints(p1,p2):
    return trunc( hypot(p2[0] - p1[0] , p2[1] - p1[1]) )

def normalizer(arrayValues):
    minX = np.min(arrayValues, axis = 0)[0]
    maxX = np.max(arrayValues, axis = 0)[0]
    minY = np.min(arrayValues, axis = 0)[1]
    maxY = np.max(arrayValues, axis = 0)[1]
    minZ = np.min(arrayValues, axis = 0)[2]
    maxZ = np.max(arrayValues, axis = 0)[2]
    arrayMax = list()
    arrayMax.append(maxX)
    arrayMax.append(maxY)
    arrayMax.append(maxZ)
    arrayMin = list()
    arrayMin.append(minX)
    arrayMin.append(minY)
    arrayMin.append(minZ)

    valuesNormalized = list()
    for i in range(0, len(arrayValues)):
        valuesNormalized.append(list())
        for j in range(0,3):
            delta = arrayMax[j] - arrayMin[j]
            res = (arrayValues[i][j] - arrayMin[j])/(delta)
            valuesNormalized[i].append(res*95)
    return valuesNormalized