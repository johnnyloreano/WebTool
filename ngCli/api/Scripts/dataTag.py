from json import dumps
from prody import * 
from parserData import generateProtein
from parserData import getListResidue
def getProteinData(pdb):
    pdb = parsePDB(pdb, header=True, secondary=True)
    protein = generateProtein(pdb[1])
    protein.residues = getListResidue(pdb)
    return dumps(protein.toJSON())
 