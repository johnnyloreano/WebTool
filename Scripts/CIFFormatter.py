from pprint import pprint
from CIFUtils import *

globalCIF = None
aminoNameG = None
STANDARD_DISTANCE = 0.1
DISTANCE_OF_H = 0.05
onlySideChain = None
def getCIF(aminoName):
    global globalCIF
    global aminoNameG
    global onlySideChain
    aminoNameG = aminoName
    globalCIF = getCIFData(aminoName)
    plotAlphaC()#VERIFICADO!
    plotHAlpha()#VERIFICADO!
    plotAmina() # VERIFICADO!
    plotCarboxylic()
    plotSideChain()
    return globalCIF[0]

def plotAlphaC():
    global onlySideChain
    changeCoords('CA', 0.5,0.5,0.5)
    # print(globalCIF[0]['CA'])
def plotAmina():
    global globalCIF
    global aminoNameG
    coordsCA = [globalCIF[0]['CA']['x'],globalCIF[0]['CA']['y'],globalCIF[0]['CA']['z']]
    changeCoords('N', coordsCA[0]-STANDARD_DISTANCE ,coordsCA[1],coordsCA[2]+STANDARD_DISTANCE)
    coordsCN = [globalCIF[0]['N']['x'],globalCIF[0]['N']['y'],globalCIF[0]['N']['z']]
    # print(globalCIF[0]['N'])
    if aminoNameG == 'PRO' or aminoNameG == 'pro':
        changeCoords('H', coordsCN[0]-DISTANCE_OF_H ,coordsCN[1]+DISTANCE_OF_H,coordsCN[2]+DISTANCE_OF_H)
        # print(globalCIF[0]['H'])
    else:
        changeCoords('H', coordsCN[0]-DISTANCE_OF_H ,coordsCN[1]+DISTANCE_OF_H,coordsCN[2]+DISTANCE_OF_H)
        changeCoords('H2', coordsCN[0]-DISTANCE_OF_H ,coordsCN[1]-DISTANCE_OF_H,coordsCN[2]+DISTANCE_OF_H)
        # print(globalCIF[0]['H'])
        # print(globalCIF[0]['H2'])

def plotHAlpha():
    global globalCIF
    changeCoords('HA',globalCIF[0]['CA']['x'],globalCIF[0]['CA']['y']+DISTANCE_OF_H,globalCIF[0]['CA']['z']+DISTANCE_OF_H)
    # print(globalCIF[0]['HA'])

def plotCarboxylic():
    global globalCIF
    global aminoNameG
    cName = None
    if aminoNameG == 'ALA':
        cName = 'CB'
    else:
        cName = 'C'
        changeCoords(cName,globalCIF[0]['CA']['x']+STANDARD_DISTANCE,globalCIF[0]['CA']['y'],globalCIF[0]['CA']['z']+DISTANCE_OF_H)
    changeCoords('O',globalCIF[0][cName]['x']+STANDARD_DISTANCE,globalCIF[0]['CA']['y']+STANDARD_DISTANCE,globalCIF[0]['CA']['z']+DISTANCE_OF_H)
    changeCoords('OXT',globalCIF[0][cName]['x']+STANDARD_DISTANCE,globalCIF[0]['CA']['y']-STANDARD_DISTANCE,globalCIF[0]['CA']['z']+DISTANCE_OF_H)
    changeCoords('HXT', globalCIF[0]['OXT']['x']+DISTANCE_OF_H,globalCIF[0]['OXT']['y'],globalCIF[0]['OXT']['z']-DISTANCE_OF_H)
    # print(globalCIF[0][cName])
    # print(globalCIF[0]['O'])
    # print(globalCIF[0]['OXT'])

def plotSideChain():
    plotCarbonB()
    for x in (globalCIF[0]):
        if not globalCIF[0][x]['plotted'] and not globalCIF[0][x]['symbol'].startswith('H'):
                # print("plotting...")
                # print(globalCIF[0][x])
                plotLigants(x)
            
def plotCarbonB():
    global globalCIF
    global aminoNameG
    coordsCA = [globalCIF[0]['CA']['x'],globalCIF[0]['CA']['y'],globalCIF[0]['CA']['z']]
    if aminoNameG == 'ALA':
        changeCoords('C', coordsCA[0],coordsCA[1] - STANDARD_DISTANCE, coordsCA[2]+STANDARD_DISTANCE)
        # print(globalCIF[0]['C'])
    else:
        changeCoords('CB', coordsCA[0],coordsCA[1] - STANDARD_DISTANCE, coordsCA[2]+STANDARD_DISTANCE)
        # print(globalCIF[0]['CB'])
    plotLigants('CB')
    
    # elif carbon.startswith('CG'):
    #     coordsCB = None
    #     if aminoNameG == 'ALA':
    #         coordsCB = [globalCIF[0]['C']['x'],globalCIF[0]['CA']['y'],globalCIF[0]['CA']['z']]
    #     else:
    #         coordsCB = [globalCIF[0]['CB']['x'],globalCIF[0]['CA']['y'],globalCIF[0]['CA']['z']]
    #     if nextCarbon.startswith('CG'):
    #         print(coordsCB)
    #         changeCoords('CG1', float(coordsCB[0])+STANDARD_DISTANCE,coordsCB[1] + STANDARD_DISTANCE, coordsCB[2]+STANDARD_DISTANCE)
    #         changeCoords('CG2', float(coordsCB[0]) - STANDARD_DISTANCE,coordsCB[1] - STANDARD_DISTANCE, coordsCB[2]+STANDARD_DISTANCE)
    #         print(globalCIF[0]['CG1'])
    #         print(globalCIF[0]['CG2'])
    #     else:
    #         changeCoords('CG', coordsCB[0],coordsCB[1] - STANDARD_DISTANCE, coordsCB[2]+STANDARD_DISTANCE)
    #         print(globalCIF[0]['CG'])

def plotLigants(amino):
    global globalCIF
    coordsRef = [
                float(globalCIF[0][amino]['x']),
                float(globalCIF[0][amino]['y']),
                float(globalCIF[0][amino]['z'])
                ]
    counterNonH = 0
    listBond = globalCIF[1][amino]
    for x in listBond:
        if not x['atom_2'].startswith('H'):
            counterNonH += 1
    isUnique = counterNonH == 1
    isSecond = False
    counterH = 1
    for x in listBond:
        if x['atom_2'].startswith('H'):
            plotHLigants(x['atom_2'],counterH,coordsRef)
            counterH +=1
        else:
            varX = coordsRef[0]
            varY = coordsRef[1]- STANDARD_DISTANCE
            varZ = coordsRef[2]
            if isUnique:
                changeCoords(x['atom_2'],varX,varY,varZ)
            elif not isSecond:
                varX += STANDARD_DISTANCE
                isSecond = True
            elif isSecond:
                    varX -= STANDARD_DISTANCE
            changeCoords(x['atom_2'],varX,varY,varZ)
            if x['atom_2'] in globalCIF[1].keys():
                plotLigants(x['atom_2'])
    return True

def plotHLigants(amino,number,coordsRef):
    global globalCIF

    varX = coordsRef[0]
    varY = coordsRef[1]
    varZ = coordsRef[2]
    if number == 1:
        varX += DISTANCE_OF_H
    elif number == 2:
        varX -= DISTANCE_OF_H
    elif number == 3:
        varY -= DISTANCE_OF_H
    changeCoords(amino,varX,varY,varZ)

def changeCoords(atom,newX= 0 ,newY = 0,newZ = 0):
    global globalCIF
    globalCIF[0][atom]['x'] = newX
    globalCIF[0][atom]['y'] = newY
    globalCIF[0][atom]['z'] = newZ
    globalCIF[0][atom]['plotted'] = True
    return True