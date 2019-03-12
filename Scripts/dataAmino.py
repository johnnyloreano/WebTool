from convertMol import *
import os,json
from dataTag import normalizer
from CIFTester import getCIF 
from CIFUtils import downloadAll
def getAminoData(aminoName):
    AminoDataVerifier()
    cif = getCIF(aminoName)
    elements = list()
    lenghtList = len(cif)
    for x in cif:
        elements.append(x)
    elements = normalizeData(elements)
    for x in range(0, lenghtList):
        cif[x]['x'] = elements[x][0] 
        cif[x]['y'] = elements[x][1] 
        cif[x]['z'] = elements[x][2]
        print(cif[x])
    return json.dumps(cif)
    
def normalizeData(array):
    array = normalizer(getCoord(array))
    return array
def AminoDataVerifier():
    if not os.path.isdir("cifFiles/"):
        os.mkdir("cifFiles/")
        downloadAll()

def getCoord(aminoAtoms):
    listCoord = list()
    for x in aminoAtoms:
        auxList = list()
        auxList.append(x["x"])
        auxList.append(x["y"])
        auxList.append(x["z"])
        listCoord.append(auxList)
    return listCoord