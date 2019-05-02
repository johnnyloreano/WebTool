from prody import *
import json
import numpy as np
from math import hypot
from dataDistances import getClasses
from math import trunc
from utils import normalizer
def getGeneralData(pdb):
    pdbName = pdb
    pdb = parsePDB(pdb, header=True, secondary=True)
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
    dataParsed['residues_dist'] =   getDistances( dataParsed['alpha_loc'],pdbName )
    dataParsed['helix_range'] =     getHelixData(pdb)
    dataParsed['sheet_range'] =     getSheetData(pdb)
    return json.dumps(dataParsed)



getGeneralData('1zdd')