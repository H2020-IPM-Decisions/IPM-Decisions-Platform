<p align="center">
<img src="src\img\logo.svg" width="70%"/> 
<img src="src\img\logo-euro.jpg" width="15%"/> 
</p>

# IPMDecisionsPlatform

This repository contains the client-side code of the IPM Decisions platform, a precision agriculture website that provides DSS (Decisions Support Systems) to predict the possible infection of crops by pests using meteorological data from weather stations in northern Europe.

## Table of contents
* [**Development**](#development)
* [**How To Start**](#how-to-start)
* [**Run**](#run)
* [**Build Docker Image**](#build-docker-image)
* [**API links**](#api-links)

## Development

This project was generated with NodeJS, TypeScript and [Angular CLI](https://github.com/angular/angular-cli) version 9. To be able to modify the client, NodeJS and Angular must be installed.

## How To Start

To start editing the client, you must first copy this repository within your development environment. Then move to the project's root directory and run the command line command ``npm install``, this will install all required packages ( listed in the "**package-lock.json**" file ). To start the client, run the command ``npm start`` and when the compilation finishes the client will be listening on **localhost:4200**. The connection to backend services is set within the file **enviroment.ts**, for development, and **enviroment.prod.ts**, for the release of a new version. In both files, the value indicating which services are used is the key **ApiUrl**.

### Connect To Localhost

it is possible to run IPM services locally using docker, which must be installed on your machine to run the docker-compose file of the IPM services with the command ``docker-compose up``(you can add the flag ``-d`` to make the command execution in background). Once this is done, simply set the "**apiUrl**" key to the value **"localhost:5000"**.

### Editing the Client

The IPM client is developed using [Angular components](https://angular.io/guide/architecture-components), so to change the graphical interface of a component, one only has to modify its .html file and .css file. To modify the operating logic, however, it is necessary to modify the .ts file. Once the changes have been saved, if the client is running at the time, a quick recompilation of the code will be performed and the client page refreshed.

## CMS

The Content Management System is a service that provides some translated elements of the home page and the other public pages that are not present in the translation files described above. The connection to this service is set within the file **enviroment.ts**, for development, and **enviroment.prod.ts**, for the release of a new version, with the key **"cmsUrl"** value. 

### Editing the CMS

Within the CMS there are three sets of elements: Singletons, Collections and Forms. To change the content of the CMS, you need to:
  
  1. Connect to the service via the URL defined by the value of the cmsUrl key and log in.

  2. Find out which CMS element is used in the template. One must view the .html files of the public page in question and look for the 'innerHtml' property, which is used to load the content received from the CMS into the template.

  3. Look for the attribute of the .ts file of the public page loaded in the template and check which method of the class managing the CMS (class **CMSService**) is used to set it.

  4. The URL used by **CMSService** method is divided into ``<cmsURL>/api/<ElementSet>/get/<ElementName>?token=${}``, where "ElementSet" indicates whether it is a Collection, Singleton or Form and "ElementName" is the name associated with the element within the CMS.   

  5. Within the CMS, search for the corresponding element in the set specified in the URL.

  6. Click on element settings (gear icon) and select edit.

On the left are the name of the element, corresponding to 'ElementName' in the URL displayed earlier, and the element label, the name under which it is displayed within the CMS. Fields can be added to the CMS element. These fields are named after the abbreviated form of the language they translate and can contain either plain text or HTML. To add a new field, simply click on **"add field"** at the bottom of the fields list and edit the name. You can then use the field settings (gear icon) to add: content type, content, label (the name associated when displaying the element in view mode).
   

## Build Docker Image

To create a new client image, run the command ``docker build . -t ipm-decisions-platform:[tag_name]`` in the root directory of the project. The image version '**tag_name**' must have the suffix '**_dev**' for a development release, '**_demo**' for a demo release and no prefix for a production release. Then to publish the image, execute the command ``docker push ipm-decisions-platform:[tag_name]``.


## API links
http://localhost:5000/api/dss/apidocs/#resources
http://localhost:5000/api/wx/apidocs/#resources
http://localhost:5000/api/upr/swagger/index.html --> https://github.com/H2020-IPM-Decisions/UserProvisionService/tree/develop/Docker (docker help)

npm run build
docker build . -t ipmdecisions/ipm-decisions-platform:dev
docker push ipmdecisions/ipm-decisions-platform:dev