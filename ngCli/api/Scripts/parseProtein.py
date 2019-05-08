from protein import *
from residue import Residue as Res
from prody_utils import *
from math_utils import normalizer
from math_utils import quadrantOfPoint
from transcripter import generateTransitions
from transcripter import generateInterval
from transcripter import generateFQuadrant
from json import dumps
from prody import parsePDB
    
def toJson(pdb):
    pdb = parsePDB(pdb, header=True, secondary=True)
    protein = generateProtein(pdb)
    return dumps(protein.toJSON())

def generateProtein(pdb):
    identifier =      pdb[1]['identifier']
    authors =         pdb[1]['authors']
    experiment =      pdb[1]['experiment']
    classification =  pdb[1]['classification']
    deposition_date = pdb[1]['deposition_date']
    version =         pdb[1]['version']
    title =           pdb[1]['title']
    residues = getListResidue(pdb)
    start = generateFQuadrant(quadrantOfPoint(residues[0].location,100))
    return Protein(identifier,title,authors,version,deposition_date,experiment,residues,start)

def getListResidue(pdb):
    residuesNumber = getResNum(pdb)
    residuesNames = getResidueList(pdb)
    residuesLocation = normalizer( getCoord(pdb) )
    
    helix_lengths = getHelixData(pdb)
    sheet_lengths = getSheetData(pdb)

    helixF = 0
    sheetF = 0

    list_residues = list()
    first_R = Res()

    first_R.num = residuesNumber[0]
    first_R.init = residuesNames[0]
    first_R.downSound = "Voce saiu da proteina!"
    first_R.location = residuesLocation[0]
    first_R.message = generateMessage(first_R)
    list_residues.append(first_R)
    coords_pdb = getCoord(pdb)
    intervalsDistance = generateInterval(coords_pdb)
    for x in range(1,len(residuesNumber)):
        newR = Res()
        newR.num = residuesNumber[x]
        newR.init = residuesNames[x]
        newR.location = residuesLocation[x]

        if x == 0:
            newR.isFirst == True
        if x == len(residuesNames):
            newR.isLast == True

        newR.location == residuesLocation[x]
        if not len(helix_lengths) == helixF:
            newR.helixInf = verifyHelix(newR.num,helix_lengths[helixF])

        if not len(sheet_lengths) == sheetF:
            newR.sheetInf = verifySheet(newR.num,sheet_lengths[sheetF])

        if newR.helixInf == 'E':
            helixF +=1
        if newR.sheetInf == 'E':
            sheetF +=1

        transitions = generateTransitions(newR.location,list_residues[x-1].location)
        newR.downSound = str(transitions[1]) + ". Intervalo " + str(intervalsDistance[x]['front'])
        list_residues[x-1].upSound = str(transitions[0]) + ". Intervalo " + str(intervalsDistance[x]['back'])
        
        newR.message = generateMessage(newR)

        list_residues.append(newR)

    list_residues[len(list_residues)-1].upSound = "Voce saiu da proteina!"

    return list_residues
def generateMessage(residue):
    message = 'Aminoacido atual '+str(getAminoName(residue.init))

    if residue.isFirst:
        message += "Primeiro aminoacido"
    elif residue.isLast:
        message += "Ultimo aminoacido"

    if residue.helixInf == 'B':
        message += "Inicio de Helice"
    elif residue.helixInf == 'E':
        message += "Fim de Helice"
    elif residue.helixInf == 'M':
        message += "Dentro de Helice"

    if residue.sheetInf == 'B':
        message += "Inicio de Fita"
    elif residue.sheetInf == 'E':
        message += "Fim de Fita"
    elif residue.sheetInf == 'M':
        message += "Dentro de Fita"

    return message
    
def verifyHelix(rNum,lengthHelix):
    if rNum == lengthHelix[0]:
        return 'B'
    if rNum == lengthHelix[1]:
        return 'E'
    if rNum > lengthHelix[0] and rNum < lengthHelix[1]:
        return 'M'
    return None

def verifySheet(rNum,lengthSheet):
    if rNum == lengthSheet[0]:
        return 'B'
    if rNum == lengthSheet[1]:
        return 'E'
    if rNum > lengthSheet[0] and rNum < lengthSheet[1]:
        return 'M'
    return None

def getAminoName(initials):
    if initials == 'PHE':
        return 'Fenilalanina. '
    if  initials ==  'ALA':
        return 'Alanina. '
    if  initials == 'MET':
        return 'Metionina'
    if  initials == 'LYS':
        return 'Lisina. '
    if  initials == 'GLU':
        return 'Glutamina. '
    if  initials == 'PRO':
        return 'Prolina. '
    if  initials == 'SER':
        return 'Serina. '
    if  initials == 'LEU':
        return 'Leucina. '
    if  initials == 'ILE':
        return 'Isoleucina. '
    if  initials == 'THR':
        return 'Treonina. '
    if  initials == 'CYS':
        return 'Cisteina. '
    if  initials == 'TYR':
        return 'Tirosina. '
    if  initials == 'ASN':
        return 'Asparagina. '
    if  initials == 'GLN':
        return 'Glutamina. '
    if  initials == 'GLU':
        return 'Acido Glutamico. '
    if  initials == 'ARG':
        return 'Arginina. '
    if  initials == 'HYS':
        return 'Histidina. '
    if  initials == 'TRP':
        return 'Triptofano. '
    if  initials == 'ASP':
        return 'Acido Aspartico. '
    if  initials == 'GLY':
        return 'Glicina. '