from prody import *
import json
import numpy as np
aminoNames = ['ALA','PHE','GLU','CYS','LYS','GLY','ASN','ASP','LEU','ILE','PRO','THR','TYR','ARG','HIS','MET','TRP','HYS','LYS','GLN']
def getGeneralData(pdb):
    pdb = parsePDB(pdb.encode("UTF-8"), header=True)
    dataParsed = dict()
    dataParsed['identifier'] = pdb[1]['identifier']
    dataParsed['authors'] = pdb[1]['authors']
    dataParsed['experiment'] = pdb[1]['experiment']
    dataParsed['classification'] = pdb[1]['classification']
    dataParsed['deposition_date'] = pdb[1]['deposition_date']
    dataParsed['version'] = pdb[1]['version']
    dataParsed['residues'] = pdb[0]._resList 
    dataParsed['residue_num'] = getResNum(pdb)
    dataParsed['alpha_loc'] = normalizer( getCoord(pdb) )
    dataParsed['helix_range'] = getHelixData(pdb)
    dataParsed['sheet_range'] = getSheetData(pdb)
    return json.dumps(dataParsed)
def getCoord(pdb):
    listCoord = list()
    iterator = iter(pdb[0])
    residue = iterator.next()
    while(True):
        residue = iterator.next()
        listCoord.append(residue.getCoordsets().tolist()[0])
        residue = skipResidue(residue.getResindex(),iterator)
        if residue is None:
            break
    return listCoord
def getResNum(pdb):
    resNumList = list()
    iterator = iter(pdb[0])
    residue = iterator.next()
    while(True):
        residue = iterator.next()
        resNumList.append(residue.getResnum())
        residue = skipResidue(residue.getResindex(),iterator)
        if residue is None:
            break
    return resNumList
def skipResidue(oldResidue, iterator):
    auxRes = iterator.next()
    while(oldResidue == auxRes.getResindex()):
        try:
            auxRes = iterator.next()
        except StopIteration:
            return None
    return auxRes

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
            valuesNormalized[i].append(res*100)
    return valuesNormalized
def getHelixData(pdb):
    helix = list()
    for i in range(len(pdb[1]['helix_range']) ):
        helix.append(list())
        helix[i].append(pdb[1]['helix_range'][i][4])
        helix[i].append(pdb[1]['helix_range'][i][5])
    return helix
def getSheetData(pdb):
    helix = list()
    for i in range(len(pdb[1]['sheet_range']) ):
        helix.append(list())
        helix[i].append(pdb[1]['sheet_range'][i][4])
        helix[i].append(pdb[1]['sheet_range'][i][5])
    return helix