from math_utils import normalizer
from Test import Test 
from protein import *
from residue import Residue as Res
from transcripter import generateTransitions
from transcripter import generateFQuadrant
from math_utils import quadrantOfPoint
from math_utils import distanceOfPoints
from re import findall

def fixPoints(points,types):
    pointsList = list()
    for x in points:
        pointsList.append(x['position'])
    pointsList = normalizer(pointsList)
    pointsList = invert(pointsList)
    counter = 0
    for x in points:
        x['position'] = pointsList[counter]
        counter += 1
    if types == 'protein':
        return recreateProtein(points)
    elif types == 'test':
        return recreatePoints(pointsList)
def invert(points):
    for x in points:
        x[1] = 100 - abs(x[1])
    return points
    
def recreatePoints(points):
    listPointT = list()
    firstCoords = points[0]
    firstTest = Test(firstCoords)
    firstTest.message  = "Começando pelo "+ str( generateFQuadrant(quadrantOfPoint(firstTest.coords,5)) ) + ". "
    intervals = None
    listPointT.append(firstTest)
    for x in range(1,len(points)):
        coords  = points[x]
        listPointT.append(Test(coords))

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
    listPointT[last].transition = " Não existem mais transições."

    return listPointT

def recreateProtein(points):
    listPointR = list()
    firstRes = Test(points[0]['position'])
    firstRes.message  = "Começando pelo "+ str( generateFQuadrant(quadrantOfPoint(firstRes.coords,50)) ) + ". "
    listPointR.append(firstRes)
    for x in range(1,len(points)):
        newRes = Test(points[x]['position'])
        listPointR.append(newRes)

        trans =  generateTransitions(points[x]['position'], points[x-1]['position'])

        distance = distanceOfPoints( points[x]['position'], points[x-1]['position'])
        interval = None
        if distance <= 1:
            interval = 'Pequena'
        elif distance <= 2:
            interval = 'Média'
        else:
            interval =  'Grande'

        listPointR[x-1].transition = trans + ". Distância " + interval 
        listPointR[x-1].message += defineMessage(points[x-1]['message'])
    
    last = len(listPointR)-1
    listPointR[last].message = 'Você chegou ao final da proteína!'
    listPointR[last].transition = " Não existem mais transições."

    return listPointR

def defineMessage(message):
    number = getNumberRes(message)   
    aminoacid = getAminoName(message)
    structure = verifyHelix(message)
    if structure == "":
        structure = verifySheet(message)
    message = "Resíduo número " + str(number) +  ". "
    message += aminoacid
    message += structure
    # print(message)
    return message

def getNumberRes(message):
    return int(findall('\d+', message)[0])

def getAminoName(name):
    firstDot = name.index(".")+1
    finalDot = name.index(".",firstDot)
    return name[firstDot:finalDot] + ". "

def verifyHelix(message):
    if "Dentro de Hélice" in message:
        return "Dentro de Hélice. "
    elif "Fim de Hélice" in message:
        return "Fim de Hélice. "
    elif "Início de Hélice" in message:
        return "Início de Hélice. "
    return ""

def verifySheet(message):
    if "Dentro de Fita" in message:
        return "Dentro de Fita. "
    elif "Fim de Fita" in message:
        return "Fim de Fita. "
    elif "Início de Fita" in message:
        return "Início de Fita. "
    return ""