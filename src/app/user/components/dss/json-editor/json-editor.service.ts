import { Injectable } from "@angular/core";
import * as JE from '@json-editor/json-editor';
import * as Ajv from 'ajv';
const ajv = new Ajv();
import { Observable } from "rxjs";
// https://json-editor.github.io/json-editor/
// https://github.com/json-editor/json-editor
@Injectable({ providedIn: 'root' })
export class JsonEditorService {
    createJsonEditor(htmlSelectorId: string, schema: any):JE.JSONEditor{
        const element = document.getElementById(htmlSelectorId);
        return new JE.JSONEditor(element, {
            schema: schema, 
            compact: true, 
            disable_collapse: true, 
            disable_edit_json: true, 
            disable_properties: true, 
            ajax: true, 
            theme: 'bootstrap4', 
            prompt_before_delete: false, 
            iconlib: "fontawesome5"
        });
    }
    reset(editor: JE.JSONEditor){
        editor.destroy();
    }
    listenChanges(editor: JE.JSONEditor) :Observable<any> {
        return new Observable((observer) => {
            editor.on('change',(data) => {
                observer.next(data);
            });
        });
    }
    isValid(editor: JE.JSONEditor) : boolean{
        // BE AWARE! JSONEditor validation lacks! I'm using AVJ below
        // const errors = editor.validate();
        // return !(typeof errors.length == 'number' && errors.length > 0);
        const validate = ajv.compile(editor.schema);
        if(validate(editor.getValue())){
            return true;
        }
        return false;
    }
    getValues(editor: JE.JSONEditor){
        return editor.getValue();
    }
}