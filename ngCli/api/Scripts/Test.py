#!/usr/bin/python
# -*- coding: utf-8 -*-
class Test:
    def __init__(self,coords,transition = None,message = ""):
        self.coords = coords
        self.transition = transition
        self.message = message

    def toJson(self):
        data = dict()
        data['location'] = self.coords
        data['transition'] = self.transition
        data['message'] = self.message
        return data