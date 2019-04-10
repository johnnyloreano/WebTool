import json
import numpy as np
dataSet = dict()
dataSet['triangulo'] = [[1,2,1],[2,3,1],[3,2,1], [1,2,1]]
dataSet['quadrado'] = [[1,1,1],[1,2,1],[2,2,1], [2,1,1], [1,1,1]]
dataSet['losango'] = [[1,1,1],[2,2,1],[3,1,1], [2,0,1], [1,1,1]]
dataSet['junina'] = [[0,0,1],[0,3,1],[2,3,1], [2,0,1], [1,1,1], [0,0,1]]
# dataSet['trapezio'] = [[1,1,1],[2.5,2.5,1],[3,1,1], [2,0,1], [1,1,1]]
def getTests(name):
    testDatas = dict()
    testDatas['identifier'] = 'TRIANGULO'
    testDatas['authors'] = 'EQUIPE LABIO'
    testDatas['deposition_date'] = '08/04/2019'
    testDatas['version'] = '1.0'
    testDatas['title'] = 'FIGURA TRIDIMENSIONAL DE '+ name.upper()
    testDatas['pointLoc'] = dataSet[name]
    print(name)
    return json.dumps(testDatas)

# def normalizer(arrayValues):
#     minX = np.min(arrayValues, axis = 0)[0]
#     maxX = np.max(arrayValues, axis = 0)[0]
#     minY = np.min(arrayValues, axis = 0)[1]
#     maxY = np.max(arrayValues, axis = 0)[1]
#     minZ = np.min(arrayValues, axis = 0)[2]
#     maxZ = np.max(arrayValues, axis = 0)[2]

#     arrayMax = list()
#     arrayMax.append(maxX)
#     arrayMax.append(maxY)
#     arrayMax.append(maxZ)
#     arrayMin = list()
#     arrayMin.append(minX)
#     arrayMin.append(minY)
#     arrayMin.append(minZ)

#     valuesNormalized = list()
#     for i in range(0, len(arrayValues)):
#         valuesNormalized.append(list())
#         for j in range(0,3):
#             delta = arrayMax[j] - arrayMin[j]
#             res = (arrayValues[i][j] - arrayMin[j])/(delta)
#             valuesNormalized[i].append(res*95)
#     return valuesNormalized