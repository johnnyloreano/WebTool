from convertMol import *
import SDFDownload
import os,json

def getAminoData(aminoName):
    AminoDataVerifier()
    print( os.path.isdir("sdfFiles/") )
    print(json.dumps(parse_sdf_file("sdfFiles/"+aminoName+"_ideal.sdf",n=25000)[0]))
    return json.dumps(parse_sdf_file("sdfFiles/"+aminoName+"_ideal.sdf",n=25000)[0])
def AminoDataVerifier():
    if os.path.isdir("sdfFiles/"):
        return
    os.mkdir("sdfFiles/")
    SDFDownload.downloadAll()
    return