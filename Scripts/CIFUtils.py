from CifFile import ReadCif
from pprint import pprint
import wget,os
def getCIFData(filename):
	AminoDataVerifier()
	cf = ReadCif("cifFiles/"+filename+".cif")
	key = cf.keys()[0]
	cf = cf[key]
	data_atom = parseAtom(cf)
	data_bond = parseBond(cf)
	return [data_atom,data_bond]

def parseAtom(cf):
	data_atom = dict()
	numb_atoms = len(cf['_chem_comp_atom.pdbx_ordinal'])
	for x in range(0, numb_atoms):
		data = dict()
		data['symbol'] = cf['_chem_comp_atom.atom_id'][x]
		data['aromatic'] = cf['_chem_comp_atom.pdbx_aromatic_flag'][x] == 'Y'
		data['x'] = cf['_chem_comp_atom.model_Cartn_x'][x]
		data['y'] = cf['_chem_comp_atom.model_Cartn_y'][x]
		data['z'] = cf['_chem_comp_atom.model_Cartn_z'][x]
		data['order'] = cf['_chem_comp_atom.pdbx_ordinal'][x]
		data['plotted'] = False
		data_atom[data['symbol']] = data

	return data_atom

def parseBond(cf):
	numb_bonds = len(cf['_chem_comp_bond.pdbx_ordinal'])	
	data_bonds = dict()
	for x in range(0, numb_bonds):
		data = dict()
		data['atom_1'] = cf['_chem_comp_bond.atom_id_1'][x]
		data['atom_2'] = cf['_chem_comp_bond.atom_id_2'][x]
		data['type_bond'] = cf['_chem_comp_bond.value_order'][x]
		data['aromatic'] = cf['_chem_comp_bond.pdbx_aromatic_flag'][x]
		if data['atom_1'] not in data_bonds: 
			data_bonds[data['atom_1']] = list()
		data_bonds[data['atom_1']].append(data)
	return data_bonds

def AminoDataVerifier():
  if not os.path.isdir("cifFiles/"):
    os.mkdir("cifFiles/")
  downloadAll()
  
def downloadAll():
  allAmino = ['ALA', 'PHE', 'GLU', 'CYS', 'LYS', 'GLY', 'ASN', 'ASP', 'LEU', 'ILE', 'PRO', 'THR', 'TYR', 'ARG', 'MET', 'TRP', 'HIS', 'LYS', 'GLN', 'SER']
  url = "https://files.rcsb.org/ligands/view/"
  url2 = ".cif"
  for i in allAmino:
    if not os.path.isfile("cifFiles/" + i + url2):
      print("Downloading file ", i)
      urlComplete = url + i + url2
      filename = wget.download(urlComplete, out = "cifFiles")
      print("\nDownloaded at " + filename)
    else :
      print("Already downloaded.")
  return
def retypeCIF(newCIF,aminoName):
	linesRef = dict()
	url = "cifFiles/" + aminoName + ".cif"
	cifFile = open(url, "r")
	STARTINDEXATOM = 46
	ENDINDEXATOM = 46 + len(newCIF)
	whole_file = cifFile.readlines() 
	atom_data = whole_file[STARTINDEXATOM:ENDINDEXATOM]
	newCIF = parseCIFDict(newCIF)
	atom_data = formatValues(newCIF,atom_data)
	cifFile.close()
	cifFile = open(url, "w")
	counter = 0
	for x in range(STARTINDEXATOM,ENDINDEXATOM):
		whole_file[x] = atom_data[counter]
		counter += 1
	cifFile.writelines(whole_file)

	return newCIF

def formatValues(newFile, oldLines):
	STANDARD_FORMAT = "{:06.3f}"
	for x in range(0,len(oldLines)):
		newValx = STANDARD_FORMAT.format(newFile[x]['x'])
		newValy = STANDARD_FORMAT.format(newFile[x]['y'])
		newValz = STANDARD_FORMAT.format(newFile[x]['z'])
		oldLines[x] = replaceValues(oldLines[x],'x',newValx)
		oldLines[x] = replaceValues(oldLines[x],'y',newValy)
		oldLines[x] = replaceValues(oldLines[x],'z',newValz)
	return oldLines

def parseCIFDict(dictCif):
	pprint(dictCif)
	newList = [None] * (len(dictCif))
	for x in dictCif:
		newList[int(dictCif[x]['order'])-1] = dictCif[x]
	return newList


def replaceValues(line, coord, newVal):
	if coord == 'x':
			newStr = line[:26] + newVal +line[32:]
	elif coord == 'y':
			newStr = line[:33] + newVal + line[39:]			
	elif coord == 'z':
			newStr = line[:40] + newVal + line[46:]
	return newStr