from convertMol import *
from pprint import pprint
import os
STANDARD_DISTANCE = 0.0500 * 100
DISTANCE_OF_H = 0.0300 * 100
ALPHA_LOC = '1'
AMINO_N_LOC = '0'
CARBOXYLIC_LOC = '2'
CHAIN_LOC = '4'
sdfFile = None
# def formatLine(line,counter = 0):
#     fromValue = 0 + counter * 10
#     toValue = 7 + fromValue
#     print(fromValue)
#     print(toValue)
#     if counter == 2:
#         return line.replace(line[fromValue:toValue], "00.0000",1)
#     else :
#         newString = line.replace(line[fromValue:toValue], "00.0000",1)
#         return formatLine(newString, counter + 1)
def changeX(line,newX):
    line['x'] = newX
    return line

def changeY(line,newY):
    line['y'] = newY
    return line

def changeZ(line,newZ):
    line['z'] = newZ
    return line
def changeCoords(line,newX,newY,newZ = 0.500 * 100):
    line = changeX(line,newX)
    line = changeY(line,newY)
    line = changeZ(line,newZ)
    return line
def plotAlpha(alphaLine):
    default = 0.5000
    alphaLine = changeCoords(alphaLine,default,default,default)

def plotAtom(atomRef,fatherRef,direction,diagonalDirection = None):
    global sdfFile
    x = None
    y = None
    if direction == "left":
        y = float(sdfFile[fatherRef]['y'])
        x = float(sdfFile[fatherRef]['x']) - STANDARD_DISTANCE
    elif direction == "right":
        y =float(sdfFile[fatherRef]['y'])
        x = float(sdfFile[fatherRef]['x']) + STANDARD_DISTANCE
    elif direction == "top":
        x = float(sdfFile[fatherRef]['x'])
        y =float(sdfFile[fatherRef]['y'])+ STANDARD_DISTANCE
    elif direction == "bottom":
        x = float(sdfFile[fatherRef]['x'])
        y =float(sdfFile[fatherRef]['y'])- STANDARD_DISTANCE
    if not diagonalDirection == None:
        if diagonalDirection == "top":
            if direction == "left" or direction == "right":
                y = float(sdfFile[fatherRef]['y']) + STANDARD_DISTANCE
            else:
                y = float(sdfFile[fatherRef]['x']) + STANDARD_DISTANCE
        elif diagonalDirection == "bottom":
            if direction == "left" or direction == "right":
                y = float(sdfFile[fatherRef]['y']) - STANDARD_DISTANCE
            else:
                y = float(sdfFile[fatherRef]['x']) - STANDARD_DISTANCE
    sdfFile[str(atomRef)] = changeCoords(sdfFile[str(atomRef)],x,y)
        
def plotBond(bond, fatherRef, fatherDir, isDiagonal = False):
    global sdfFile
    directions = {
        "top": ["bottom","left","right"],
        "bottom": ["top","left","right"],
        "right" : ["left","top","bottom"],
        "left" : ["right","top","bottom"]
    }
    diagonals = ["top", "bottom"]
    counterDir = 0
    counterDiag = 0
    for x in bond:
        if isDiagonal:
            plotAtom(x['to'],fatherRef,directions[fatherDir][counterDir],diagonals[counterDiag])
            counterDiag = counterDiag+1
            if counterDiag == 2:
                counterDiag = 0
                counterDir = counterDir+1
        else:
            plotAtom(x['to'],fatherRef,directions[fatherDir][counterDir])
            counterDir = counterDir + 1     

def plotAmina():
    global sdfFile
    plotAtom(AMINO_N_LOC,ALPHA_LOC,"left")
    bond = sdfFile[AMINO_N_LOC]['bond']
    plotBond(bond,AMINO_N_LOC,"left",True)

def plotHAlpha():
    global sdfFile
    bond = sdfFile[ALPHA_LOC]['bond']
    indexH = None
    for x in bond:
        if sdfFile[str(x['to'])]['symbol'] == 'H':
            indexH = str(x['to'])
            plotAtom(indexH,ALPHA_LOC,"top")
            break

def plotCarboxylic():
    global sdfFile
    plotAtom(CARBOXYLIC_LOC,ALPHA_LOC,"right")
    bond = sdfFile[CARBOXYLIC_LOC]['bond']
    plotOCarboxylic()

def plotOCarboxylic():
    global sdfFile
    plotBond(sdfFile[CARBOXYLIC_LOC]["bond"],CARBOXYLIC_LOC,"right",True)
    bonds = sdfFile[CARBOXYLIC_LOC]["bond"]
    if len( sdfFile[str(bonds[0]['to'])]['bond'] ) > 0:
        plotHCarboxylic(sdfFile[str(bonds[0]['to'])]['bond'][0]['to'],str(bonds[0]['to']))
    else:
        plotHCarboxylic(sdfFile[str(bonds[1]['to'])]['bond'][0]['to'],str(bonds[1]['to']))

def plotHCarboxylic(HIndex,OIndex):
    global sdfFile
    plotAtom(HIndex,OIndex,"left")
def getSDF(aminoName):
    global sdfFile
    url = "sdfFiles/"+aminoName+"_model.sdf"
    sdfFile = parse_sdf_file( url,n=25000)[0]
    plotAlpha(sdfFile[ALPHA_LOC])
    plotAmina()
    plotHAlpha()
    plotCarboxylic()
    retypeSDF(url)
    return sdfFile

def retypeSDF(nameFile):
    global sdfFile
    BEGIN = 4
    END = len(sdfFile) + 3
    fileSDF = open(nameFile,"r+")
    fileLines = fileSDF.readlines()
    fileSDF.seek(0)
    # fileSDF.
    for x in range(0,len(fileLines) ):
        fileLines[x] = fileLines[x].strip()
    for x in range(0,len(sdfFile)-1):
        newValx = "{:07.4f}".format(sdfFile[str(x)]['x'])
        newValy = "{:07.4f}".format(sdfFile[str(x)]['y'])
        newValz = "{:07.4f}".format(sdfFile[str(x)]['z'])
        fileLines[x] = replaceValues(fileLines[x],'x',newValx)
        fileLines[x] = replaceValues(fileLines[x],'y',newValy)
        fileLines[x] = replaceValues(fileLines[x],'z',newValz)
        fileSDF
    for x in fileSDF:
        print(x)
    return
def replaceValues(line, coord, newVal):
    if coord == 'x':
        newStr = newVal + line[7:]
    elif coord == 'y':
        newStr = line[:10] + newVal + line[17:]
    elif coord == 'z':
        newStr = line[:20] + newVal + line[27:]
    return newStr
getSDF('SER')