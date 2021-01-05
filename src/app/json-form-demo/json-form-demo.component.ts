import { Component, OnInit } from '@angular/core';
declare var JSONEditor;


@Component({
  selector: 'app-json-form-demo',
  templateUrl: './json-form-demo.component.html',
  styleUrls: ['./json-form-demo.component.css']
})
export class JsonFormDemoComponent implements OnInit {


  options = {
    schema: {
      "type": "object",
      "properties": {
        "modelId": {
          "type": "string",
          "pattern": "^PSILARTEMP$",
          "title": "Model Id",
          "default": "PSILARTEMP",
          "description": "Must be PSILARTEMP"
        },
        "configParameters": {
          "title": "Configuration parameters",
          "type": "object",
          "properties": {
            "timeZone": {
              "type": "string",
              "title": "Time zone (e.g. Europe/Oslo)",
              "default": "Europe/Oslo"
            },
            "timeStart": {
              "type": "string",
              "format": "date",
              "title": "Start date of calculation (YYYY-MM-DD)"
            },
            "timeEnd": {
              "type": "string",
              "format": "date",
              "title": "End date of calculation (YYYY-MM-DD)"
            }
          },
          "required": ["timeZone", "timeStart", "timeEnd"]
        },
        "weatherData": {
          "$ref": "https://ipmdecisions.nibio.no/api/wx/rest/schema/weatherdata"
        }
      },
      "required": ["modelId", "configParameters"]
    },
    ajax: true
  }

  constructor() { }

  ngOnInit() {
    const element = document.getElementById('editor_holder');

    const editor = new JSONEditor(element, this.options);
  }

  yourOnSubmitFn(x) {
    console.log(x);
  }

}