from prody import *
import json
from math import hypot
from math import ceil
from math import trunc
from utils import normalizer
def getClasses(pdbName):
    distances = allDistanceOfPairs(getDatas(pdbName))
    return generateClass(distances)

def getDatas(name):
    return normalizer((getCoord(parsePDB(name, header=True))))

def generateClass(data):
    delta = max(data) - min(data)
    AMOUNT_INTERVALS = 3
    intervals = ceil(delta / AMOUNT_INTERVALS)
    numb_start = min(data)
    classes = list()
    for x in range(0,int(AMOUNT_INTERVALS)):
        classes_size = list()
        classes_size.append( numb_start + x * intervals)
        classes_size.append( numb_start +  (x + 1) * intervals)
        classes.append(classes_size)
    return classes

def getDistance(point1,point2):
    return trunc(hypot(point2[0] - point1[0], point2[1] - point1[1]))

def allDistanceOfPairs(pdb):
    pdb_coords = set()
    for x in range(1,len(pdb)):
        pdb_coords.add(getDistance(pdb[x],pdb[x-1]))
    return pdb_coords

def getCoord(pdb):
    hv = pdb[0].getHierView()
    coord_list = list()
    for i,residue in enumerate(hv.iterResidues()):
            atom = residue.getAtom("CA")
            if not atom == None:
                coord_list.append(atom.getCoords())
            else:
                coord_list.append(residue.getCoords()[0])
    return coord_list