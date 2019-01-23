from prody import *
import json
x = parsePDB('PHE', header=True)


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

print(x)