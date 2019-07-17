#!/usr/bin/python
# -*- coding: utf-8 -*-
from Test import Test 
from transcripter import generateTransitions
from transcripter import generateFQuadrant
from math_utils import quadrantOfPoint
from math_utils import distanceOfPoints
from json import dumps
dataSet = dict()
dataSet['quadrado'] = [[2,0,1],[4,0,1],[4,3,1],[2,3,1],[2,0,1]] # OK!
dataSet['triangulo'] = [[2,0,1],[4,0,1],[3,3,1],[2,0,1]] # OK!
dataSet['losango'] = [[1,1,1],[2,2,1],[3,1,1], [2,0,1], [1,1,1]] # OK!
dataSet['trapezio'] = [[1,1,1],[1.5,1.5,1],[2,1.5,1], [2.5,1,1], [1,1,1]] # OK!
def toJson(name):
    obj = generateTest(name)
    listTest = list()
    for x in obj:
        listTest.append(x.toJson())

    return dumps( {'pTest' : listTest} )

def generateTest(name):
    listPointT = list()
    firstCoords = dataSet[name][0]
    firstTest = Test(firstCoords)
    firstTest.message  = "Iniciando no "+ str( generateFQuadrant(quadrantOfPoint(firstTest.coords,5)) ) + ". "
    firstTest.init = 1
    intervals = None
    listPointT.append(firstTest)
    for x in range(1,len(dataSet[name])):
        coords  = dataSet[name][x]
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
    listPointT[last].transition = " Não existem mais transições"
    # for x in listPointT:
    #     print(x.toJson())
    return listPointT   