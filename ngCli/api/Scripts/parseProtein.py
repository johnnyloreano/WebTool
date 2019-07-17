#!/usr/bin/python
# -*- coding: utf-8 -*-
from Protein import *
from Point import Point

from prody_utils import *
from prody import parsePDB

from math_utils import normalizer
from math_utils import quadrantOfPoint

from transcripter import generateTransitions
from transcripter import generateInterval
from transcripter import generateFQuadrant
from json import dumps
    
def toJSON(pdb):
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
    residuesPosition = normalizer( getCoord(pdb) )
    
    helix_lengths = getHelixData(pdb)
    sheet_lengths = getSheetData(pdb)

    helixF = 0
    sheetF = 0

    list_residues = list()
    list_residues.append(Point( residuesPosition[0] ))

    coords_pdb = getCoord(pdb)

    intervalsDistance = generateInterval(coords_pdb)

    for x in range(1,len(residuesNames) ):
        newR = Point( residuesPosition[x] )
        rNum = residuesNumber[x-1]
        rName = residuesNames[x-1]
        sStructure = None

        if not len(helix_lengths) == helixF:
            sStructure = verifyHelix(rNum,helix_lengths[helixF])

        if (not len(sheet_lengths) == sheetF) and (sStructure == ""):
            sStructure = verifySheet(rNum,sheet_lengths[sheetF])

        if sStructure == 'HE':
            helixF +=1
        if sStructure == 'SE':
            sheetF +=1

        transition = generateTransitions(newR.coords,list_residues[x-1].coords)

        list_residues[x-1].transition = str( transition +" "+ intervalsDistance[x-1] )
        list_residues[x-1].message = generateMessage(list_residues[x-1].coords,str(x), sStructure, rName)
        list_residues[x-1].label = rName
        list_residues.append(newR)

    last = len(list_residues)-1
    list_residues[last].message = str(generateMessage(list_residues[last].coords,str(last+1),"",residuesNames[last]) + '. Você chegou ao final da proteína!')
    list_residues[last].label = residuesNames[last]
    list_residues[last].transition = " Não existem mais transições."

    return list_residues

def generateMessage(coords,index, sStructure, rName):
    message = 'Resíduo número  ' + index + '. ' + str(getAminoName(rName))

    if int(index) == 1:
        message += "Começando pelo " + str(generateFQuadrant(quadrantOfPoint(coords,100)))

    if sStructure == 'HB':
        message += "Início de Hélice. "
    elif sStructure == 'HM':
        message += "Dentro de Hélice. "
    elif sStructure == 'HE':
        message += "Fim de Hélice. "

    if sStructure == 'SB':
        message += "Inicio de Fita. "
    elif sStructure == 'SM':
        message += "Dentro de Fita. "
    elif sStructure == 'SE':
        message += "Fim de Fita. "
        
    return message
    
def verifyHelix(rNum,lengthHelix):
    if rNum == lengthHelix[0]:
        return 'HB'
    if rNum == lengthHelix[1]:
        return 'HE'
    if rNum > lengthHelix[0] and rNum < lengthHelix[1]:
        return 'HM'
    return None

def verifySheet(rNum,lengthSheet):
    if rNum == lengthSheet[0]:
        return 'SB'
    elif rNum == lengthSheet[1]:
        return 'SE'
    elif rNum > lengthSheet[0] and rNum < lengthSheet[1]:
        return 'SM'
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