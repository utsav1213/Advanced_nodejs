# Caching Proxy CLI

A CLI tool to start a caching proxy server that forwards requests to an origin server and caches responses.

## Usage

Start the proxy server:

```
caching-proxy --port <number> --origin <url>
```

Example:

```
caching-proxy --port 3000 --origin http://dummyjson.com
```

Clear the cache:

```
caching-proxy --clear-cache
```

## Features

- Caches responses from the origin server
- Returns `X-Cache: HIT` for cached responses
- Returns `X-Cache: MISS` for fresh responses
- Supports clearing the cache via CLI

## Requirements

- Node.js 16+

## Install dependencies

```
npm install
```

## Run locally

```
npm start -- --port 3000 --origin http://dummyjson.com
```
