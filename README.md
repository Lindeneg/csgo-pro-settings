# CSGO Pro Settings Distribution

[See some graphs here](https://csgo-pro-settings-distribution.vercel.app/)

### Why

I had a discussion with a friend regarding the most popular resolution scaling amongst CSGO pros.

He was under the impression that black-bars still is the most popular, while I was under the impression that native had gained ground and claimed the top spot.

We tried answering the question, as always, via Google but the articles we found were simply not trustworthy - and I failed to find any that actually contained information of where and how they got their data.

So I said fuck it, and used a few hours to build a scraper to get the data from Liquidpedia, which has a stellar reputation when it comes to player details.

### Usage

##### Clone

```
git clone git@github.com:Lindeneg/csgo-pro-settings-distribution.git && cd csgo-pro-settings-distribution
```

##### Install

```
yarn install
```

##### Migrate DB (default: sqlite)

```
yarn prisma migrate dev
```

#### Extract Cache

Please unzip `scraper-cache.zip` and place the `scraper-cache` folder in the root of the project.

This will ensure that the scraper does not have to re-scrape data from Liquipedia servers - and that you don't have to wait a lot of hours due to rate-limiting.

##### Build Scraper

```
yarn build:scraper
```

##### Populate DB

```
yarn start:scraper
```

##### Start Next.js App

```
yarn dev
```
