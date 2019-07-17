from pprint import pprint
from json import dumps
from json import loads
from parseRotation import fixPoints
def getRotation(points,types):
    points = loads(points)
    result = fixPoints(points,types.replace("\"", ""))
    listJson = list()
    for data in result:
        listJson.append(data.toJson())
    pprint(listJson)
    return dumps( listJson )