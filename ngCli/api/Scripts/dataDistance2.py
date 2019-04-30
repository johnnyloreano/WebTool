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
    pdb_coords = list()
    pdb_coords.append(getCoord(parsePDB('1zdd', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('3NIR', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1K5R', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1N09', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1A5R', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('2NR2', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('2MOC', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1YWD', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1GPT', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1C5A', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1C5P', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('1CTF', header=True, secondary=True)))
    # pdb_coords.append(getCoord(parsePDB('2EZK', header=True, secondary=True)))
    return normalizeAll(pdb_coords)

def generateClass(data):
    delta = max(data) - min(data)
    AMOUNT_INTERVALS = 3
    intervals = ceil(delta / AMOUNT_INTERVALS)
    print(intervals)
    numb_start = min(data)
    classes = list()
    for x in range(0,int(AMOUNT_INTERVALS)):
        classes_size = list()
        classes_size.append( numb_start + x * intervals)
        classes_size.append( numb_start +  (x + 1) * intervals)
        classes.append(classes_size)
    return classes

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

def getDistance(point1,point2):
    return trunc(hypot(point2[0] - point1[0], point2[1] - point1[1]))

def allDistanceOfPairs(pdb):
    pdb_coords = set()
    for x in range(0,len(pdb) ):
        for y in range(1,len(pdb[x]) ):
            pdb_coords.add(getDistance(pdb[x][y],pdb[x][y-1]))
    return pdb_coords

def normalizeAll(array_pdb):
    normalizedData = list()
    for x in array_pdb:
        normalizedData.append(normalizer(x))
    return normalizedData

print(getClasses('1zdd'))