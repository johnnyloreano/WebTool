class Test:
    def __init__(self,coords,upSound = None,downSound = None):
        self.coords = coords
        self.upSound = upSound
        self.downSound = downSound


    def toJson(self):
        data = dict()
        data['coords'] = self.coords
        data['upSound'] = self.upSound
        data['downSound'] = self.downSound
        return data