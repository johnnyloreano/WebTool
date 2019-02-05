from convertMol import *
import SDFDownload
import os,json
from dataTag import normalizer
def getAminoData(aminoName):
    AminoDataVerifier()
    content = parse_sdf_file("sdfFiles/"+aminoName+"_model.sdf",n=25000)[0]
    elements = list()
    for x in range(1, len(content)):
        elements.append(content[str(x)])
    return json.dumps( normalizeData(content) )
def normalizeData(array):
    onlyCoords = normalizer(getCoord(array) )
    for x in range(1, len(array)):
        array[str(x)]['x'] = onlyCoords[x-1][0]
        array[str(x)]['y'] = onlyCoords[x-1][1]
        array[str(x)]['z'] = onlyCoords[x-1][2]
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