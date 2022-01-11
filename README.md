# Nominatim-Data-Analyser-Frontend

The Nominatim Data Analyser is a QA tool used to scan the nominatim database and extract suspect data from it. These data are then presented to mappers through this webapp developed in React. The repository of the main backend can be found here: [Nominatim-Data-Analyser](https://github.com/osm-search/Nominatim-Data-Analyser).

# How to build

Before building this app you need to change some parameters:

* In the ```src/config/config.json``` file you need to set the right ```WEB_PATH``` which is the URL defined as the ```WebPrefixPath``` value in the config file of the [Nominatim-Data-Analyser](https://github.com/osm-search/Nominatim-Data-Analyser) (analyser/config/config.yaml). This is needed to fetch the data files from the server.

* If you will serve this frontend on a specific path like ```https://your-server.org/Nominatim-QA-Frontend``` you need to add ```"homepage": "https://your-server.org/Nominatim-QA-Frontend"``` in the package.json. This line can be added under ```"private": true``` for example.
By doing that, the app will add the prefix Nominatim-QA-Frontend/ before all its requests to static files when it gets built.
If you will serve the app at the root url of your server this step is not needed.

To build the app go into the root folder and run:
```
npm install
```
or:
```
yarn
```
This will install all the dependencies required by the app and then run:
```
npm run build
```
or:
```
yarn build
```
Then you need to serve the ```build/``` folder with any webserver to access the app.

For the app to fetch the data extracted by the analyser, you need to serve the ```<RulesFolderPath>``` defined in ```analyser/config/config.yaml``` of the [Nominatim-Data-Analyser](https://github.com/osm-search/Nominatim-Data-Analyser) with a web server. It should be accessible through the ```<WebPrefixPath>``` also defined in the configuration of the [Nominatim-Data-Analyser](https://github.com/osm-search/Nominatim-Data-Analyser).
