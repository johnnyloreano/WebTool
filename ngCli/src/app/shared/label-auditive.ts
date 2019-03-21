import { Label } from "./label";

export interface LabelAuditive extends Label{
    sounds : string[];
    speak(message: string);
}