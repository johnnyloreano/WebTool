sdfFile = open("../sdfFiles/GLY_model.sdf", "r+")
sdfLines = sdfFile.readlines()
atomsLine = list()
bondLine = list()
numAtoms = None
numBond = None
if not sdfLines[3][2] == " ":
    numAtoms = int(sdfLines[3][1]+sdfLines[3][2])
else:
    numAtoms = int(sdfLines[3][2])

if not sdfLines[3][6] == " ":
    numBond = int(sdfLines[3][5]+sdfLines[3][6])
else:
    numBond = int(sdfLines[3][5])    

for x in range(4,4+numAtoms):
    atomsLine.append(sdfLines[x][:32])
for x in range(4+numAtoms, numAtoms+4+numBond):
    bondLine.append(sdfLines[x])
print(atomsLine[1])