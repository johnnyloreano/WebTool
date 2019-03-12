from CIFFormatter import getCIF as getFormattedCIF
from CIFUtils import getCIFData, retypeCIF
from pprint import pprint
def getCIF(aminoName):
    newCIF = getFormattedCIF(aminoName)
    return retypeCIF(newCIF,aminoName)
    