import json

h_count_dict = {
    0:"H0",
    1:"H0",
    2:"H1",
    3:"H2",
    4:"H3",
    5:"H4"
}

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
    return ret

def parse_mol(lines):
    """
    Parse the provided molfile and return a structured object representation
    that can be read by TRESTLE.
    """
    mol = {}
    num_atoms = 0
    mol["name"] = lines[0]
    ### COUNTS LINE ###
    c_line = parse_counts_line(lines[3])
    num_atoms = c_line["aaa"]

    atom_dex = 4 + num_atoms

    for l,line in enumerate(lines[4:atom_dex]):
        atom = {}
        a_line = parse_atom_line(line)
        atom["x"] = a_line["xxx"]
        atom["y"] = a_line["yyy"]
        atom["z"] = a_line["zzz"]

        atom["symbol"] = a_line["aaa"]
        mol[str((l+1))] = atom

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