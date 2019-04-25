import json
import numpy as np
dataSet = dict()
dataSet['triangulo'] = [[1,1,1],[2,1,1],[1.5,1.72,1], [1,1,1]]
dataSet['quadrado'] = [[1,1,1],[1,2,1],[2,2,1], [2,1,1], [1,1,1]]
dataSet['losango'] = [[1,1,1],[2,2,1],[3,1,1], [2,0,1], [1,1,1]]
dataSet['junina'] = [[0,0,1],[0,3,1],[2,3,1], [2,0,1], [1,1,1], [0,0,1]]
dataSet['trapezio'] = [[1,1,1],[1.5,1.5,1],[2,1.5,1], [2.5,1,1], [1,1,1]]
def getTests(name):
    testDatas = dict()
    testDatas['identifier'] = 'TRIANGULO'
    testDatas['authors'] = 'EQUIPE LABIO'
    testDatas['deposition_date'] = '08/04/2019'
    testDatas['version'] = '1.0'
    testDatas['title'] = 'FIGURA TRIDIMENSIONAL DE '+ name.upper()
    testDatas['pointLoc'] = dataSet[name]
    return json.dumps(testDatas)
