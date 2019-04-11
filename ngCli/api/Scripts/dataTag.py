from prody import *
import json
import numpy as np
aminoNames = ['ALA','PHE','GLU','CYS','LYS','GLY','ASN','ASP','LEU','ILE','PRO','THR','TYR','ARG','HIS','MET','TRP','HYS','LYS','GLN']
def getGeneralData(pdb):
    pdb = parsePDB(pdb.encode("UTF-8"), header=True, secondary=True)
    dataParsed = dict()
    dataParsed['identifier'] =      pdb[1]['identifier']
    dataParsed['authors'] =         pdb[1]['authors']
    dataParsed['experiment'] =      pdb[1]['experiment']
    dataParsed['classification'] =  pdb[1]['classification']
    dataParsed['deposition_date'] = pdb[1]['deposition_date']
    dataParsed['version'] =         pdb[1]['version']
    dataParsed['title'] =           pdb[1]['title']
    dataParsed['residues'] =        getResidueList(pdb) 
    dataParsed['residue_num'] =     getResNum(pdb)
    dataParsed['alpha_loc'] =       normalizer( getCoord(pdb) )
    dataParsed['helix_range'] =     getHelixData(pdb)
    dataParsed['sheet_range'] =     getSheetData(pdb)
    return json.dumps(dataParsed)
def getCoord(pdb):
    hv = pdb[0].getHierView()
    coord_list = list()
    for i, residue in enumerate(hv.iterResidues()):
            atom = residue.getAtom("CA")
            if not atom == None:
                coord_list.append(atom.getCoords())
            else:
                coord_list.append(residue.getCoords()[0])
    return coord_list

def getResidueList(pdb):
    hv = pdb[0].getHierView()
    res_list = list()
    for i, residue in enumerate(hv.iterResidues()):
        res_list.append(residue.getResname())
    return res_list

def getResNum(pdb):
    hv = pdb[0].getHierView()
    resNumList = list()
    for i, residue in enumerate(hv.iterResidues()):
        resNumList.append(residue.getResnum())
    return resNumList

def normalizer(arrayValues):
    minX = np.min(arrayValues, axis = 0)[0]
    maxX = np.max(arrayValues, axis = 0)[0]
    minY = np.min(arrayValues, axis = 0)[1]
    maxY = np.max(arrayValues, axis = 0)[1]
    minZ = np.min(arrayValues, axis = 0)[2]
    maxZ = np.max(arrayValues, axis = 0)[2]

    arrayMax = list()
    arrayMax.append(maxX)
    arrayMax.append(maxY)
    arrayMax.append(maxZ)
    arrayMin = list()
    arrayMin.append(minX)
    arrayMin.append(minY)
    arrayMin.append(minZ)

    valuesNormalized = list()
    for i in range(0, len(arrayValues)):
        valuesNormalized.append(list())
        for j in range(0,3):
            delta = arrayMax[j] - arrayMin[j]
            res = (arrayValues[i][j] - arrayMin[j])/(delta)
            valuesNormalized[i].append(res*95)
    return valuesNormalized

def getHelixData(pdb):
    helix = list()
    for i in range(len(pdb[1]['helix_range']) ):
        helix.append(list())
        helix[i].append(pdb[1]['helix_range'][i][4])
        helix[i].append(pdb[1]['helix_range'][i][5])
    return helix
def getSheetData(pdb):
    sheet = list()
    for i in range(len(pdb[1]['sheet_range']) ):
        sheet.append(list())
        sheet[i].append(pdb[1]['sheet_range'][i][4])
        sheet[i].append(pdb[1]['sheet_range'][i][5])
    return sheet