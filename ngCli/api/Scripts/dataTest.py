from prody import *
import json

x = parsePDB("1zdd", header=True)[1]
print(x)