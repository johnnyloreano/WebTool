from prody import *
import json
from dataTag import getGeneralData
from dataAmino import getAminoData
from convertMolFUll import *
from pprint import pprint
x = parsePDB('3NIR', header=True)

# def getResNum(pdb):
#     resNumList = list()
#     iterator = iter(pdb[0])
#     residue = jumpIterator(iterator)
#     while(True):
#         residue = jumpIterator(iterator)
#         if residue is not None:
#             resNumList.append(residue.getResnum())
#         if residue is None:
#             break
#         residue = skipResidue(residue.getResindex(),iterator)
#     return resNumList
# def jumpIterator(iterator):
#     try:
#         return iterator.next()
#     except StopIteration:
#         return None
# def skipResidue(oldResidue, iterator):
#     auxRes = jumpIterator(iterator)
#     if auxRes is not None:
#         while(oldResidue == auxRes.getResindex()):
#             auxRes = jumpIterator(iterator)
#             if auxRes is None:
#                 return auxRes
#     return None

# print(getResNum(x))
# print(len(getResNum(x)))