from prody import *
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
        resNumList.append(residue.getResnum().item())
    return resNumList

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