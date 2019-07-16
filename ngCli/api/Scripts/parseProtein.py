#!/usr/bin/python
# -*- coding: utf-8 -*-
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
    return Protein(identifier,title,authors,version,deposition_date,experiment,residues)

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
    first_R.location = residuesLocation[0]
    list_residues.append(first_R)
    coords_pdb = getCoord(pdb)
    intervalsDistance = generateInterval(coords_pdb)
    for x in range(1,len(residuesNames) ):
        newR = Res()
        newR.num = residuesNumber[x]
        newR.init = residuesNames[x]
        newR.location = residuesLocation[x]

        newR.location == residuesLocation[x]
        if not len(helix_lengths) == helixF:
            newR.helixInf = verifyHelix(newR.num,helix_lengths[helixF])

        if not len(sheet_lengths) == sheetF:
            newR.sheetInf = verifySheet(newR.num,sheet_lengths[sheetF])

        if newR.helixInf == 'E':
            helixF +=1
        if newR.sheetInf == 'E':
            sheetF +=1

        transition = generateTransitions(newR.location,list_residues[x-1].location)
        list_residues[x-1].transition = str(transition +". "+intervalsDistance[x-1])
        list_residues[x-1].name = getAminoName(list_residues[x-1].init)
        list_residues[x-1].message = generateMessage(list_residues[x-1],str(x))
        
        list_residues.append(newR)

    last = len(list_residues)-1
    list_residues[last].message = generateMessage(list_residues[last],str(last))
    list_residues[last].message += '. Você chegou ao final da proteína!'
    list_residues[last].transition = " Não existem mais transições"
    list_residues[last].name = getAminoName(list_residues[last].init)
    return list_residues
def generateMessage(residue,index):
    message = 'Resíduo número  ' + index + '. '

    if residue.helixInf == 'B':
        message += "Início de Hélice. "
    elif residue.helixInf == 'E':
        message += "Fim de Hélice. "
    elif residue.helixInf == 'M':
        message += "Dentro de Hélice. "

    if residue.sheetInf == 'B':
        message += "Inicio de Fita. "
    elif residue.sheetInf == 'E':
        message += "Fim de Fita. "
    elif residue.sheetInf == 'M':
        message += "Dentro de Fita. "

    message += str(getAminoName(residue.init))
    if int(index) == 1:
        message += "Começando pelo " + str(generateFQuadrant(quadrantOfPoint(residue.location,100))) + ". "
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
def isAmino(name):
    return not getAminoName(name) == None

def getAminoName(initials):
    if initials == 'PHE':
        return 'Fenilalanina. '
    if  initials ==  'ALA':
        return 'Alanina. '
    if  initials == 'MET':
        return 'Metionina. '
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
        return 'Cisteína. '
    if  initials == 'TYR':
        return 'Tirosina. '
    if  initials == 'ASN':
        return 'Asparagina. '
    if  initials == 'GLN':
        return 'Glutamina. '
    if  initials == 'GLU':
        return 'Ácido Glutâmico. '
    if  initials == 'ARG':
        return 'Arginina. '
    if  initials == 'HIS':
        return 'Histidina. '
    if  initials == 'TRP':
        return 'Triptofano. '
    if  initials == 'ASP':
        return 'Ácido Aspártico. '
    if  initials == 'GLY':
        return 'Glicina. '
    if initials == 'NH2':
        return 'Grupo Amina. '