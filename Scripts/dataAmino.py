from convertMol import *
import SDFDownload
import os,json
from pprint import pprint
from dataTag import normalizer
from sdfUtils import *
def getAminoData(aminoName):
    AminoDataVerifier()
    sdf = getSDF(aminoName)
    # elements = list()
    # lenghtList = len(sdf)-1
    # for x in range(0, lenghtList):
    #     elements.append(sdf[str(x)])
    # elements = normalizeData(elements)
    # print(elements[0][0])
    # for x in range(0, lenghtList):
    #     sdf[str(x)]['x'] = elements[x][0]
    #     sdf[str(x)]['y'] = elements[x][1]
    #     sdf[str(x)]['z'] = elements[x][2]
    return json.dumps( sdf )
def normalizeData(array):
    array = normalizer(getCoord(array) )
    return array
def AminoDataVerifier():
    if not os.path.isdir("sdfFiles/"):
        os.mkdir("sdfFiles/")
        SDFDownload.downloadAll()
    return

def getCoord(aminoAtoms):
    listCoord = list()
    for x in aminoAtoms:
        auxList = list()
        auxList.append(x["x"])
        auxList.append(x["y"])
        auxList.append(x["z"])
        listCoord.append(auxList)
    return listCoord