from convertMol import *
import SDFDownload
import os,json
from pprint import pprint
from dataTag import normalizer

def getAminoData(aminoName):
    AminoDataVerifier()
    content = parse_sdf_file("sdfFiles/"+aminoName+"_model.sdf",n=25000)[0]
    pprint(content)
    elements = list()
    lenghtList = len(content)-1
    for x in range(0, lenghtList):
        elements.append(content[str(x)])
    elements = normalizeData(elements)
    for x in range(0, lenghtList):
        content[str(x)]['x'] = elements[x]['x']
        content[str(x)]['y'] = elements[x]['y']
        content[str(x)]['z'] = elements[x]['z']
        print(content[str(x)])
    return json.dumps( normalizeData(elements) )
def normalizeData(array):
    onlyCoords = normalizer(getCoord(array))
    for x in range(0, len(array)):
        array[x]['x'] = onlyCoords[x][0] * 0.6
        array[x]['y'] = onlyCoords[x][1] * 0.6
        array[x]['z'] = onlyCoords[x][2] * 0.6
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