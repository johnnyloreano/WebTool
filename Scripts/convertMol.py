import json

h_count_dict = {
    0:"H0",
    1:"H0",
    2:"H1",
    3:"H2",
    4:"H3",
    5:"H4"
}
bond_type_dict = {
    1:"Single",
    2:"Double",
    3:"Triple",
    4:"Aromatic",
    5:"Single_or_Double",
    6:"Single_or_Aromatic",
    7:"Double_or_Aromatic",
    8:"Any"
}
def parse_bond_line(line):
    """
    Parses a line from a bondblock and turns it into a dict

    111222tttsssxxxrrrccc
    111 = number of atom 1
    222 = number of atom 2
    ttt = bond type
    sss = bond stereo
    xxx = not used
    rrr = bond topology
    ccc = reacting center status
    """
    ret = {}
    ret["111"] = int(float(line[0:3]))
    ret["222"] = int(float(line[3:6]))
    ret["ttt"] = int(float(line[6:9]))
    ret["sss"] = int(float(line[9:12]))
    ret["xxx"] = int(float(line[12:15]))
    ret["rrr"] = int(float(line[15:18]))
    return ret

def parse_counts_line(line):
    """
    Parses the counts line of a molecule and returns it asd a dictionary

    aaabbblllfffcccsssxxxrrrpppiiimmmvvvvvv
    aaa = number of atoms (current max 255)* 
    bbb = number of bonds (current max 255)* 
    lll = number of atom lists (max 30)* 
    fff = (obsolete)
    ccc = chiral flag: 0=not chiral, 1=chiral
    sss = number of stext entries 
    xxx = (obsolete)
    rrr = (obsolete)
    ppp = (obsolete)
    iii = (obsolete)
    mmm = number of lines of additional properties,
    vvvvv = version for the format
    """
    ret = {}
    ret["aaa"] = int(float(line[0:3]))
    ret["bbb"] = int(float(line[3:7]))
    return ret

def parse_atom_line(line):
    """
    Parses a line from the atom block and returns it as a dictionary

    xxxxx.xxxxyyyyy.yyyyzzzzz.zzzz aaaddcccssshhhbbbvvvHHHrrriiimmmnnneee
    [0:10] xxxxx.xxxx = x-coordinate
    [10:20] yyyyy.yyyy = y-coordinate
    [20:30] zzzzz.zzzz = z-coordinate
    [31:34] aaa = atomic symbol
    [34:36] dd = mass difference, i.e. difference from standard mass
    [36:39] ccc = charge 0 = uncharged or value other than these, 1 = +3, 2 = +2, 3 = +1, 4 = doublet radical, 5 = -1, 6 = -2, 7 = -3
    [39:42] sss = atom stereo parity 0 = not stereo, 1 = odd, 2 = even, 3 = either or unmarked stereo center
    [42:45] hhh = INGORED hydrogen count +1
    [45:48] bbb = IGNORED stereo care box
    [48:51] vvv = valence
    [51:54] HHH = IGNORED H0 designator
    [54:57] rrr = Not used
    [57:60] iii = Not used
    [60:63] mmm = IGNORED atom-atom mapping number 1 - number of atoms
    [63:66] nnn = IGNORED inversion/retention flag g 0 = property not applied 1 = configuration is inverted,2 = configuration is retained
    [66:69] eee = IGNORED 0 = property not applied, 1 = change on atom must be exactly as shown
    """
    ret = {}
    ret["xxx"] = float(line[0:10])
    ret["yyy"] = float(line[10:20])
    ret["zzz"] = float(line[20:30])
    ret["aaa"] = line[31:34].strip()
    ret["bbb"] = int(float(line[45:48]))
    return ret

def parse_mol(lines):
    """
    Parse the provided molfile and return a structured object representation
    that can be read by TRESTLE.
    """
    mol = {}
    num_atoms = 0
    num_bonds = 0
    mol["name"] = lines[0]
    ### COUNTS LINE ###
    c_line = parse_counts_line(lines[3])
    num_atoms = c_line["aaa"]
    num_bonds = c_line["bbb"]

    atom_dex = 4 + num_atoms
    bond_dex = atom_dex + num_bonds 

    for l,line in enumerate(lines[4:atom_dex]):
        atom = {}
        a_line = parse_atom_line(line)
        atom["x"] = a_line["xxx"]
        atom["y"] = a_line["yyy"]
        atom["z"] = a_line["zzz"]
        atom['bond'] = list()
        atom["symbol"] = a_line["aaa"]
        mol[str((l))] = atom

    for l,line in enumerate(lines[atom_dex:bond_dex]):
        bond = dict()
        b_line = parse_bond_line(line)
        bond['type'] = (bond_type_dict[b_line["ttt"]])
        at = (b_line["111"])
        bond['to'] = (b_line["222"])
        mol[str(at)]['bond'].append(bond)
    return mol

def parse_sdf_file(filename,n=-1):
    ret = []
    curr = []
    count = 0
    with open(filename,"r") as molefile:
        for line in molefile:
            line = line.rstrip('\r\n')
            if not line == "$$$$":
                curr.append(line)
            else:
                if len(curr) > 0:
                    ret.append(parse_mol(curr))    
                    count += 1
                    if n > 0 and count > n:
                        break
    return ret