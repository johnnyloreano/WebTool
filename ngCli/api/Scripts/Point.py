#!/usr/bin/python
# -*- coding: utf-8 -*-
class Point:
    def __init__(self,coords,transition = None,message = "", label = ""):
        self.coords = coords
        self.transition = transition
        self.message = message
        self.label = label

    def toJSON(self):
        data = dict()
        data['location'] = self.coords
        data['transition'] = self.transition
        data['message'] = self.message
        data['label'] = self.label
        return data