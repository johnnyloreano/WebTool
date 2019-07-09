from math_utils import normalizer
from json import loads
from Test import Test 
from transcripter import generateTransitions
from transcripter import generateFQuadrant
from math_utils import quadrantOfPoint
from math_utils import distanceOfPoints
def fixPoints(points):
    points = loads(points)
    points = normalizer(points)
    points = invert(points)
    points = recreatePoints(points)
def invert(points):
    for x in points:
        x[1] = 100 - abs(x[1])
    return points
def recreatePoints(points):
    listPointT = list()
    firstCoords = points[0]
    firstTest = Test(firstCoords)
    firstTest.message  = "Iniciando no "+ str( generateFQuadrant(quadrantOfPoint(firstTest.coords,5)) ) + ". "
    firstTest.init = 1
    intervals = None
    listPointT.append(firstTest)
    for x in range(1,len(points)):
        coords  = points[x]
        nTest = Test(coords)
        listPointT.append(nTest)        
        trans =  generateTransitions(listPointT[x].coords, listPointT[x-1].coords)
        distance = distanceOfPoints(listPointT[x].coords, listPointT[x-1].coords)
        interval = None
        if distance <= 1:
            interval = 'Pequena'
        elif distance <= 2:
            interval = 'Média'
        else:
            interval =  'Grande'
        listPointT[x-1].transition = trans + ". Distância " + interval 
        listPointT[x-1].message += "Ponto número " + str(x)+". "

    last = len(listPointT)-1
    listPointT[last].message = 'Você chegou ao final do desenho!'
    listPointT[last].transition = " Não existem mais transições"
    for x in listPointT:
        print(x.toJson())
    return listPointT   