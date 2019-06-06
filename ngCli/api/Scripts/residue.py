
class Residue :

    def __init__(self,number =None,init=None,transition=None,location=None,message=None,name = None, marker = None):
        self.num = number
        self.init = init
        self.transition = transition
        self.location = location
        self.message = message
        self.helixInf = None
        self.sheetInf = None
        self.name = name

    def toJSON(self):
        data = dict()
        data['init'] =      self.init
        data['name'] =      self.name
        data['transition'] =   self.transition
        data['message'] =   self.message
        data['location'] =  self.location
        return data