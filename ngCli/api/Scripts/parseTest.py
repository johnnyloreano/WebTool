from Test import Test 
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
    listTest = list()
    for x in obj:
        listTest.append(x.toJson())
    data = dict()
    data['pTest'] = listTest
    return dumps(data)

def generateTest(name):
    listPointT = list()
    name = 'triangulo'
    firstCoords = dataSet[name][0]
    firstTest = Test(firstCoords)
    firstTest.downSound = "Voce saiu da figura!"
    listPointT.append(firstTest)

    for x in range(1,len(dataSet[name])):
        coords  = dataSet[name][x]
        nTest = Test(coords)
        listPointT.append(nTest)        
        trans =  generateTransitions(listPointT[x].coords, listPointT[x-1].coords)
        listPointT[x-1].upSound = trans[0]
        listPointT[x].downSound = trans[1]
    listPointT[len(listPointT) - 1].upSound = "Voce saiu da figura!"
    return listPointT