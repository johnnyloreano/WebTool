import wget,os

def downloadAll():
    allAmino = ['ALA','PHE','GLU','CYS','LYS','GLY','ASN','ASP','LEU','ILE','PRO','THR','TYR','ARG','MET','TRP','HIS','LYS','GLN','SER']
    url = "https://files.rcsb.org/ligands/view/"
    url2 = "_model.sdf"
    for i in allAmino:
        if not os.path.isfile("sdfFiles/"+i+url2):
            print("Downloading file ",i)
            filename = wget.download(url+i+url2, out="sdfFiles")
            print("\nDownloaded at "+filename)