from test import *
from transcripter import generateTransitions
from transcripter import generateInterval
from json import dumps
dataSet = dict()
dataSet['triangulo'] = [[1,1,1],[2,1,1],[1.5,1.72,1], [1,1,1]]
dataSet['quadrado'] = [[1,1,1],[1,2,1],[2,2,1], [2,1,1], [1,1,1]]
dataSet['losango'] = [[1,1,1],[2,2,1],[3,1,1], [2,0,1], [1,1,1]]
dataSet['junina'] = [[0,0,1],[0,3,1],[2,3,1], [2,0,1], [1,1,1], [0,0,1]]
dataSet['trapezio'] = [[1,1,1],[1.5,1.5,1],[2,1.5,1], [2.5,1,1], [1,1,1]]
def toJson(name):
    obj = generateTest(name)
    return dumps(obj)

def generateTest(name):
    listPointT = list()

    firstCoords = dataSet[name][0]
    firstTest = Test(firstCoords,0)
    listPointT.append(firstTest)

    for x in range(1,len(dataSet[name])):
        coords  = dataSet[name][x]
        nTest = Test(coords,x)

        listPointT.append(nTest)
        
        trans =  generateTransitions(listPointT[x], listPointT[x-1])

        listPointT[x].upSound = trans[x]
        listPointT[x].downSound = trans[x-1]

    return listPointT