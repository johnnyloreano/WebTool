from json import dumps
from json import loads
from parseRotation import fixPoints
def getRotation(points,types):
    points = loads(points)
    result = fixPoints(points,types.replace("\"", ""))
    listJson = list()
    # for x in result:
        # listJson.append(x.toJson())
    return dumps( listJson )