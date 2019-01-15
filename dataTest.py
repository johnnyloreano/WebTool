from prody import *
import json
x = parsePDB('1zdd', header=True)

iterator = iter(x[0])
residue = iterator.next()
print(residue.getResindex())
print(residue.getResnum())



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

print(x[1]['sheet_range'])
print(x[1]['sheet_range'])