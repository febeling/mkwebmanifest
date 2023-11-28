# mkwebmanifest

Generate icons in different sizes and a web manifest for web applications.

In order to link icons and make a web application installable, it can provide a web manifest [1]. This tool generates icons in various output sizes from a single source file. It's recommended to provide an SVG or large (512x512) source icon.

## Usage

```
npm install -D mkwebmanifest
```

```
npx mkwebmanifest
```

This command assumes a configuration file at a number of default locations.

* `config/mkwebmanifest.json`
* `mkwebmanifest.config.json`

A minimal configuration file looks like this:

```json
{
  "webmanifest": {
    "name": "Clipper. Make current data available on the web while maintaining full control",
    "short_name": "Clipper",
    "description": "Clipper is a tool that makes your current data available while maintaining full control over it"
  },
  "icon": "app/assets/images/icon-oval.svg",
  "outdir": "app/assets/builds"
}
```

The web manifest requires at least the following properties on some operating systems:

* name
* icons
* start_url
* display

`mkwebmanifest` makes guesses for these. `icons` is an array of objects describing the icon size variants with their respective file paths.

You can start by just providing an icon path, and all other properties will be guessed or provided with reasonable defaults. The `name` will be looked for in `package.json`.

It is recommended, though, to provide both `name`, `short_name` if you want people to install the app on mobile devices.

## All Properties

``


1 https://developer.mozilla.org/en-US/docs/Web/Manifest
