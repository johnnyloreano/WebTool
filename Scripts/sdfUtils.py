from convertMol import *
from pprint import pprint
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
def changeCoords(line,newX,newY,newZ = 0.500):
    line = changeX(line,newX)
    line = changeY(line,newY)
    line = changeZ(line,newZ)
    return line
def plotAlpha(alphaLine):
    default = "0.5000"
    alphaLine = changeCoords(alphaLine,default,default,default)

def plotAtom(sdfLine,atomRef,fatherRef,direction,diagonalDirection = None):
    x = None
    y = None
    if direction == "left":
        y = float(sdfLine[fatherRef]['y'])
        x = float(sdfLine[fatherRef]['x']) - STANDARD_DISTANCE
    elif direction == "right":
        y =float(sdfLine[fatherRef]['y'])
        x = float(sdfLine[fatherRef]['x']) + STANDARD_DISTANCE
    elif direction == "top":
        x = float(sdfLine[fatherRef]['x'])
        y =float(sdfLine[fatherRef]['y'])+ STANDARD_DISTANCE
    elif direction == "bottom":
        x = float(sdfLine[fatherRef]['x'])
        y =float(sdfLine[fatherRef]['y'])- STANDARD_DISTANCE

    if diagonalDirection == "top":
        if direction == "left" or direction == "right":
            y = float(sdfLine[fatherRef]['y']) + STANDARD_DISTANCE
        else:
            y = float(sdfLine[fatherRef]['x']) + STANDARD_DISTANCE
    elif diagonalDirection == "bottom":
        if direction == "left" or direction == "right":
            y = float(sdfLine[fatherRef]['y']) - STANDARD_DISTANCE
        else:
            y = float(sdfLine[fatherRef]['x']) - STANDARD_DISTANCE

    sdfLine[atomRef] = changeCoords(sdfLine[atomRef],x,y)

    if(len(sdfLine[atomRef]["bond"]) > 0):
        plotBond(sdfLine,atomRef,fatherRef)

def plotBond(sdfLine,atomRef,fatherRef):
    bond = sdfLine[atomRef]['bond']
    for x in range(0,len(bond)):
        

def plotAmina(sdfLines):
    plotAtom(sdfFile,AMINO_N_LOC,ALPHA_LOC,"left")
    bond = sdfLines[AMINO_N_LOC]['bond']
    plotAtom(sdfLines,str(bond[0]['to']), AMINO_N_LOC, "left","bottom")
    plotAtom(sdfLines,str(bond[1]['to']), AMINO_N_LOC, "left","top")

def plotHAlpha(sdfLines):
    bond = sdfLines[ALPHA_LOC]['bond']
    indexH = None
    for x in bond:
        if sdfLines[str(x['to'])]['symbol'] == 'H':
            indexH = str(x['to'])
            plotAtom(sdfLines,indexH,ALPHA_LOC,"top")
            break
def plotCarboxylic(sdfLines):
    plotAtom(sdfLines,CARBOXYLIC_LOC,ALPHA_LOC,"right")
    bond = sdfLines[CARBOXYLIC_LOC]['bond']
    plotAtom(sdfLines,str(bond[0]['to']), AMINO_N_LOC, "right","bottom")
    plotAtom(sdfLines,str(bond[1]['to']), AMINO_N_LOC, "right","top")

def plotOCarboxylic(sdfLines,index):
    newX = sdfLines[CARBOXYLIC_LOC]['x'] + STANDARD_DISTANCE
    newY = None
    if len(sdfLines[index]['bond']) == 0:
        newY = float(sdfLines[CARBOXYLIC_LOC]['y']) + STANDARD_DISTANCE
        sdfLines[index] = changeCoords(sdfLines[index],newX,newY)
    else:
        newY = float(sdfLines[CARBOXYLIC_LOC]['y']) - STANDARD_DISTANCE
        sdfLines[index] = changeCoords(sdfLines[index],newX,newY)
        plotHCarboxylic(sdfLines,str(sdfLines[index]['bond'][0]['to']),index)

def plotHCarboxylic(sdfLines, index, OIndex):
    newX = sdfLines[OIndex]['x'] + STANDARD_DISTANCE
    sdfLines[index] = changeCoords(sdfLines[index], newX, sdfLines[OIndex]['y'])


STANDARD_DISTANCE = 0.0500
DISTANCE_OF_H = 0.0300

ALPHA_LOC = '1'
AMINO_N_LOC = '0'
CARBOXYLIC_LOC = '2'
CHAIN_LOC = '4'
sdfFile = parse_sdf_file("../sdfFiles/SER_model.sdf",n=25000)[0]
plotAlpha(sdfFile[ALPHA_LOC])
plotAtom(sdfFile,AMINO_N_LOC,ALPHA_LOC,"left")
plotAmina(sdfFile)
plotHAlpha(sdfFile)
plotCarboxylic(sdfFile)