# Nominatim-Data-Analyser-Frontend

The Nominatim Data Analyser is a QA tool used to scan the nominatim database
and extract suspect data from it. These data are then
[presented to mappers](https://nominatim.org/qa/) through this webapp developed
in Svelte. The repository of the main backend can be found here:
[Nominatim-Data-Analyser](https://github.com/osm-search/Nominatim-Data-Analyser).

# How to build

By default, the frontend will load its data from the official
Nominatim QA service at `https://qa-tile.nominatim.openstreetmap.org`.
If you want to use your own data, set the environment variable
`NOMINATIM_QA_WEBPATH` to the URL of the QA service.

Building requires [yarn2](https://yarnpkg.com/). If your system only ships
with classic yarn (as with current Debian/Ubuntu distros), enable yarn2 by
running the following commands from the root folder:

    yarn set version berry
    yarn set version stable

To build the app go into the root folder and run:

    yarn install

This will install all the dependencies required by the app and then run:

    yarn build


Then you need to serve the `public/` folder with any webserver to access the app.
