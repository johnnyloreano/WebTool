from math_utils import normalizer
from json import loads
def fixPoints(points):
    points = loads(points)
    points = normalizer(points)
    points = invert(points)
    for x in points:
        print(x)
def invert(points):
    for x in points:
        for i in range(len(x)):
            x[i] = 100 - abs(x[i])
    return points