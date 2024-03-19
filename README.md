<p align="center">
<img src="src\img\logo.svg" width="70%"/>
</p>

# IPM Decisions Platform

This repository contains the client-side code of the IPM Decisions platform, a web-based platform that enbles Farmer, Advisor, Researcher and Developer to use decision support systems (DSS) in the integrated pest management. This micro-service represents the frontend part of the IPM solution (as a whole), providing the user experience for the user friction of the system functionality.

## Table of contents
* [**Getting Started**](#getting-started)
* [**Platform Translation**](#platform-translation)
* [**Content Management System**](#content-management-system)
* [**Build Docker Image**](#build-docker-image)
* [**Versioning**](#versioning)
* [**Features under development**](#features-under-development)
* [**Authors**](#authors)

## Getting Started

### Prerequisites
This project was generated with [Angular CLI][angular_cli] 9

The following table lists all the requirements tools to be installed before proceeding with the setup steps:

|      Name       |      Version     |             Notes             |
| :-------------: | :--------------: | :---------------------------: |
|      Docker     |     24.0.6       | [Docker][docker]              |
|       NVM       |     1.1.11       | [NVM][nodejs_version_manager] |
|     NodeJS      |    v16.14.2      | Installation through nvm      |
|       NPM       |     8.5.0        | Included with NodeJS          |

After downloading and installing [NVM][nodejs_version_manager] (NodeJS Version Manager) open a command shell and run the following command to download and install NodeJS:

```
nvm install 16.14.2
```

Along with NodeJS, also NPM will be installed.

To check that everyting is in correctly set, run the commands:

``` 
node -v 
``` 
check NodeJS version

```
npm -v
``` 
check NPM version

Now run the command:

```
nvm use 16.14.2
``` 
to use the actual version of NodeJS.

To run the platform locally the following IPM services needs to be deployed in the local machine: 

|      Service    |      GitHub Repo                    |
| :-------------: | :---------------------------------: |
|     IDP         |    [Identity Provider Service][idp] |
|     UPR         |    [User Provisioning Service][upr] |
|     EML         |    [Email Service][eml]             |
|     CMS         |    [Content Management System][cms] |
|     DSS         |    [DSS Service][dss]               |
|     WX          |    [Weather Service][wx]            |
|     APG         |    [API Gateway][apg]               |

An example of docker-compose file containing all the above service images can be inspected [here][docker-compose-file]

Once the docker-compose file of IPM services is completly set, open a command shell on the same folder of the compose file and run the command:
```
docker-compose up -d
```

### Run the project

First clone this repository. 
Then move to the project's root directory and run the command line command:
```
npm install
```
this will install all required packages ( listed in the "**package-lock.json**" file ). 

To start the client, run the command:
```
npm start
```

When the compilation is complete, the client will be listening on **localhost:4200**. 

The connections to backend services are set within the file **enviroment.ts**, for development, and **enviroment.prod.ts**, for the production. In both files, the value indicating which services are used is the key **ApiUrl**.

To use the locally deployed IPM services, set the **ApiUrl** value to **"localhost:5000"**.

### Editing the Client

The IPM client is developed using [Angular components][angular-components], therefore to edit the template of a component, just modify its **.html and .css files**. 
To edit the business logic, however, it is necessary to modify the **.ts file**. 
Once the changes have been saved, if the client is running at the time, a quick recompilation of the code will be performed and the client page refreshed.

## Platform Translation

Platform contents translations are managed via the [ngx translate core v12.1.2][ngx-translate]

Country flags icons use this [CDN library][flag-icon-cdn] and are managed via [ngx flag picker 8.0.0][ngx-flag-picker]

Currently, the platform has been translated into 12 languages:

| Language        |
| :-------------: |
| English         |
| Italian         |
| Greek           |
| Swedish         |
| French          |
| German          |
| Dutch           |
| Slovenian       |
| Finnish         |
| Norwegian       |
| Lithuanian      |
| Danish          |

All the translations files are stored inside the folder **"i18n"** and use JSON format

### Adding a new Language

To add a new language:
 1. Duplicate the file **"en.json"** from the **"i18n"** and rename it using the **ISO 639** code of the language you want to add (e.g. Korean, ko.json).
 
 2. The flags icon use country code, which is different compared to the language code, check the CDN library above to check which code is used for the flag of the country (e.g. for the Korea example, kr).
 
 3. Before proceeding remember to add the new language and its translation inside the various json language files, under the object **"Language_Selector"**. 
 
Now that the file and both language code and country code is defined, head to the client script and search for the component **"language-selector.component.ts"** to edit the following parts:

 1. Declare a new string variable for the label e.g.:
 ```
 labelKorean: string;
 ```
 
 2. Update the function **ngOnInit()** by adding the new country code for the language inside the **countryCodes** array e.g.:
  ```
 this.countryCodes = ['gb','it','gr','se','fr','de','nl','si','fi','no','lt','dk','kr'];
 ```
 
 3. Update the function **initLanguageLabels()** , used to get the trasnlated label of the language to be shown inside the language picker element, by adding a new **switchmap** for the new language between the italian and danish one e.g.:
  ```
	...
	return this._translate.get('Language_Selector.Italian')}),
switchMap((itTranslation) => {
    this.labelItalian = itTranslation;
	return this._translate.get('Language_Selector.Korean')}),
switchMap((koTranslation) => {
    this.labelKorean = koTranslation;
    return this._translate.get('Language_Selector.Danish')}),
	...
	...
 ```
 
 4. After updating the **switchmap**, update the object **customlabels** inside the same function e.g.:
 ```
 this.customLabels = {
	"gb":this.labelEnglish,
	"it":this.labelItalian,
	"gr":this.labelGreek,
	"se":this.labelSwedish,
	"fr":this.labelFrench,
	"de":this.labelGerman,
	"nl":this.labelDutch,
	"si":this.labelSlovenian,
	"fi":this.labelFinnish,
	"no":this.labelNorwegian,
	"lt":this.labelLithuanian,
	"dk":this.labelDanish,
	"kr":this.labelKorean  <------ Country Code: Language Label
};
 ```
 
At this point move to the **"translation.service.ts"** script:

 1. Update the **initLanguageFromBrowser()** adding the new language code within both **.match** functions e.g.:
 ```
 this.currentLanguage.match(/en|el|se|de|nl|sl|no|dk|fi|fr|ko|it/)
 ```
 
 2. Now update mapping object inside the function **convertFlagToLangCode(flagCode: string)** by adding the new language e.g.:
 ``` 
 let flagToLangCodeMap: {[key: string]: string} = {
	"gb":"en",
	"it":"it",
	"gr":"el",
	"se":"se",
	"fr":"fr",
	"de":"de",
	"nl":"nl",
	"si":"sl",
	"fi":"fi",
	"no":"no",
	"lt":"lt",
	"dk":"dk",
	"kr":"ko"
  };
 ```
 
 3. Do the same with the function **convertLangToFlagCode(langCode: string)** e.g.:
 ```
   let langToFlagCode: {[key: string]: string} = {
	"en":"gb",
	"it":"it",
	"el":"gr",
	"se":"se",
	"fr":"fr",
	"de":"de",
	"nl":"nl",
	"sl":"si",
	"fi":"fi",
	"no":"no",
	"lt":"lt",
	"dk":"dk",
	"ko":"kr"
  };
 ```
 
 4. To get the correct Date-Time format by country, update the function **convertLangToMomentCode(langCode: string)**, check the correct code on **"node_modules\moment\locale"** folder e.g.:
  ```
  let langToFlagCode: {[key: string]: string} = {
	"en":"gb",
	"it":"it",
	"el":"el",
	"se":"sv",
	"fr":"fr",
	"de":"de",
	"nl":"nl",
	"sl":"sl",
	"fi":"fi",
	"no":"nn",
	"lt":"lt",
	"dk":"da",
	"ko":"ko"
  };
  ```
  
 Once done, if the newly added language json file was translated (do NOT translate the keys, just values), just re-run the project and the new language will be available.
 
 Note: some contents are loaded using a Content Management System (CMS), which contains also the translations of the provided content. Refer to the CMS guide to manage both content and their translations. Descriptions and other information data provided by services needs to be translated from the backend side.
 
## Content Management System

The Content Management System is a service that provides some contents and translated elements of the home page and the other public pages that are not present in the translation files described above. 

Refer to the [CMS Repository][cms] for further details. 

## Build Docker Image

To create a new client image, run the command in the root directory of the project:
```
docker build . -t ipm-decisions-platform:[tag_name]
``` 
The image version '**tag_name**' must have the suffix '**_dev**' for a development release, '**_demo**' for a demo release and no suffix for a production release. 

Then to publish the image, execute the command:
```
docker push ipm-decisions-platform:[tag_name]
```


## Versioning

For the versions available, see the [tags on this repository][ipm-platform-tags].

## Features under development

- Risk Map UI
- Select Weather Station settings

## Authors

Engineering Ingegneria Informatica - [ENG][eng-site]

[angular_cli]:https://github.com/angular/angular-cli
[angular-components]:https://angular.io/guide/architecture-components
[nodejs_version_manager]:https://github.com/coreybutler/nvm-windows/releases
[idp]:https://github.com/H2020-IPM-Decisions/IdentityProviderService
[upr]:https://github.com/H2020-IPM-Decisions/UserProvisionService
[eml]:https://github.com/H2020-IPM-Decisions/EmailService
[cms]:https://github.com/H2020-IPM-Decisions/Content-Management-System
[dss]:https://github.com/H2020-IPM-Decisions/DSSService
[wx]:https://github.com/H2020-IPM-Decisions/WeatherService
[apg]:https://github.com/H2020-IPM-Decisions/API-Gateway
[ipm-platform-tags]:https://github.com/H2020-IPM-Decisions/IPM-Decisions-Platform/tags
[eng-site]:https://www.eng.it/
[docker]:https://www.docker.com/
[docker-compose-file]:https://
[ngx-translate]:https://github.com/ngx-translate/core/tree/v12.1.2
[flag-icon-cdn]:https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.5/css/flag-icons.min.css
[ngx-flag-picker]:https://github.com/iamartyom/ngx-flag-picker/tree/8.0.0