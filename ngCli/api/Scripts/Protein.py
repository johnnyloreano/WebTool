
class Protein:
    def __init__(self,identifier,title,author,version,date,experiment,residues):
        self.identifier = identifier
        self.title = title
        self.author = author
        self.version = version
        self.date = date
        self.experiment = experiment
        self.residues = residues

    def toJSON(self):
        data = dict()
        data['identifier'] = self.identifier
        data['title'] = self.title
        data['author'] = self.author
        data['version'] = self.version
        data['date'] =self.date
        data['experiment'] = self.experiment
        data['residues'] = list()
        for x in self.residues:
            data['residues'].append(x.toJSON())
        return data