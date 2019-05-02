
class Residue :

    def __init__(self,number =None,init=None,upSound=None,downSound=None,location=None,message=None):
        self.num = number
        self.init = init
        self.upSound = upSound
        self.downSound = downSound
        self.location = location
        self.message = message
        self.isFirst = False
        self.isLast = False
        self.helixInf = None
        self.sheetInf = None


    def toJSON(self):
        data = dict()
        data['init'] =      self.init
        data['upSound'] =   self.upSound
        data['downSound'] = self.downSound
        data['message'] =   self.message

        return data