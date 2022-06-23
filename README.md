# index-db-orm

[![npm version](https://img.shields.io/npm/v/axios.svg?style=flat-square)](https://www.npmjs.org/package/axios)
[![CDNJS](https://img.shields.io/cdnjs/v/axios.svg?style=flat-square)](https://cdnjs.com/libraries/axios)
![Build status](https://github.com/axios/axios/actions/workflows/ci.yml/badge.svg)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/axios/axios) 
[![code coverage](https://img.shields.io/coveralls/mzabriskie/axios.svg?style=flat-square)](https://coveralls.io/r/mzabriskie/axios)
[![install size](https://packagephobia.now.sh/badge?p=axios)](https://packagephobia.now.sh/result?p=axios)
[![npm downloads](https://img.shields.io/npm/dm/axios.svg?style=flat-square)](https://npm-stat.com/charts.html?package=axios)
[![gitter chat](https://img.shields.io/gitter/room/mzabriskie/axios.svg?style=flat-square)](https://gitter.im/mzabriskie/axios)
[![code helpers](https://www.codetriage.com/axios/axios/badges/users.svg)](https://www.codetriage.com/axios/axios)
[![Known Vulnerabilities](https://snyk.io/test/npm/axios/badge.svg)](https://snyk.io/test/npm/axios)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/axios)


Promise based using indexDb for the browser.


## Table of Contents
  - [Features](#features)
  - [Browser Support](#browser-support)
  - [Installing](#installing)
  - [Example](#example)
  - [API](#api)
    - [Use](#request-method-aliases)
    - [Build](#request-method-aliases)
         - [Add DB](#request-method-aliases)    
    - [Insert](#request-method-aliases)
    - [Update](#request-method-aliases)
    - [Delete](#request-method-aliases)
    - [Clear](#request-method-aliases)
    - [Find](#request-method-aliases)
    - [All](#request-method-aliases)
    - [Pagination](#request-method-aliases)
    - [Where](#request-method-aliases)
    - [Count](#request-method-aliases)
    - [DataBase](#request-method-aliases)
        - [Get All Databases](#request-method-aliases)
        - [Get Data Base](#request-method-aliases)
        - [Get Data Base Version](#request-method-aliases)
        - [Remove All DataBase](#request-method-aliases)
        - [Remove DataBase](#request-method-aliases)
    - [Event](#request-method-aliases)
        - [on](#request-method-aliases)
            - [insert](#request-method-aliases)
            - [update](#request-method-aliases)
            - [delete](#request-method-aliases)
            - [build](#request-method-aliases)
        - [unbind](#request-method-aliases)
            - [insert](#request-method-aliases)
            - [update](#request-method-aliases)
            - [delete](#request-method-aliases)
            - [build](#request-method-aliases)
  - [Credits](#credits)
  - [License](#license)

## Features

- Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API

## Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | No |


## Installing

Using npm:

```bash
$ npm install index-db-orm
```

Using yarn:

```bash
$ yarn add index-db-orm
```

