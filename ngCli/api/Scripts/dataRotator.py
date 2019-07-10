from json import dumps
from parseRotation import fixPoints
def getRotation(points,types):
    print(points)
    if types == "\"test\"":
        result = fixPoints(points)
        listJson = list()
        for x in result:
            listJson.append(x.toJson())
        return dumps( listJson)
    elif types == '\"protein\"':
        return 'hello'