# NEXT OA FRONTEND

Branch | Travis Build Status
---|---
dev  | [![Travis Build Status](https://travis-ci.org/next-teable/next-oa-view.svg?branch=dev)](https://travis-ci.org/next-teable/next-oa-view)
master | [![Travis Build Status](https://travis-ci.org/next-teable/next-oa-view.svg?branch=master)](https://travis-ci.org/next-teable/next-oa-view)
image |  [![Travis Build Status](https://travis-ci.org/next-teable/next-oa-view.svg?branch=image)](https://travis-ci.org/next-teable/next-oa-view)


# Deps (for MAC)

* node 10.+
* npm 6.+
* Docker Desktop 2.+

# Get Started

## Before Start

```
> npm install
```

## Start Backend Service

```
> cd docker
> docker-compose pull && docker-compose up -d 
```

## Start 

```
> npm start
```

# Configuration

## Backend APIs Proxy

> proxy.conf.json

```
{
  "/nextoa-api": {
    "target": "http://127.0.0.1:8080/",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/nextoa-api": ""
    }
  }
}
```
