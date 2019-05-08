from pprint import pprint
from Test import Test 
from transcripter import generateTransitions
from json import dumps
from math_utils import normalizer
dataSet = dict()
# dataSet['triangulo'] = [[2,0,1],[3,0,1],[2.5,1.94,1],[2,0,1]]
# dataSet['quadrado'] = [[2,0,1],[4,0,1],[4,3,1],[2,3,1],[2,0,1]] # OK!
# dataSet['triangulo'] = [[2,0,1],[4,0,1],[3,3,1],[2,0,1]] # OK!
# dataSet['losango'] = [[1,1,1],[2,2,1],[3,1,1], [2,0,1], [1,1,1]] # OK!
# dataSet['junina'] = [[0,0,1],[0,3,1],[2,3,1], [2,0,1], [1,1,1], [0,0,1]] # OK!
# dataSet['trapezio'] = [[1,1,1],[1.5,1.5,1],[2,1.5,1], [2.5,1,1], [1,1,1]] # OK!
# dataSet['test'] = [[1,3,1], [ 2,2,1]] A < B
# dataSet['test'] = [[2,2,1],[1,3,1]] A > B
# dataSet['test'] = [[1,2,1], [ 1,1,1]] #A = B
# dataSet['test'] = [[1,1,1], [ 1,2,1]] #A = B
def toJson(name):
    obj = generateTest(name)
    listTest = list()
    for x in obj:
        listTest.append(x.toJson())
    data = dict()
    data['pTest'] = listTest
    return dumps(data)

def generateTest(name):
    listPointT = list()
    name = 'quadrado'
    firstCoords = dataSet[name][0]
    firstTest = Test(firstCoords)
    firstTest.downSound = "Voce saiu da figura!"
    intervals = None
    listPointT.append(firstTest)

    for x in range(1,len(dataSet[name])):
        coords  = dataSet[name][x]
        nTest = Test(coords)
        listPointT.append(nTest)        
        trans =  generateTransitions(listPointT[x].coords, listPointT[x-1].coords)
        listPointT[x-1].upSound = trans[0] + ". Intervalo " 
        listPointT[x].downSound = trans[1] + ". Intervalo "

    listPointT[len(listPointT) - 1].upSound = "Voce saiu da figura!"
    return listPointT




