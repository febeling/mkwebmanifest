# mkwebmanifest

Generate icons in different sizes and a web manifest for web applications.

In order to link icons and make a web application installable, it can provide a web manifest [1]. This tool generates icons in various output sizes from a single source file. It's recommended to provide an SVG or large PNG (e.g. 512x512) source icon.

## Usage

Run when installed

```shell
npm install -D mkwebmanifest
mkwebmanifest --icon app/assets/images/icon.svg --name myapp
```

or using `npx`

```shell
npx mkwebmanifest --icon app/assets/images/icon.svg --name myapp
npx mkwebmanifest --icon app/assets/images/icon.svg --name myapp --watch
```

or using all settings from a default configuration file

```shell
npx mkwebmanifest 
```

With `config/mkwebmanifest.config.json`
```json
{
  "name": "myapp",
  "icon": "app/assets/images/icon.svg"
}
```

`mkwebmanifest` makes guesses for these. `icons` is an array of objects describing the icon size variants with their respective file paths.

Only the `icon` path is required, and all other properties will be guessed or provided with reasonable defaults. The `name` will be looked for in `package.json`, only if that doesn't exist it is required from the command line option of configuration.

If the `--name` option isn't given, the command assumes a configuration file at the default locations.

- `config/mkwebmanifest.json`
- `mkwebmanifest.config.json`

A simple configuration file looks like this:

```json
{
  "icon": "app/assets/images/icon-oval.svg",
  "outdir": "app/assets/builds",
  "name": "Clipper. Make current data available on the web while maintaining full control",
  "short_name": "Clipper",
  "description": "Clipper is a tool that makes your current data available while maintaining full control over it"
}
```

The location of the configuration file can be set by the option `--config`.

## All Configuration

`icon` (required)
`name` (looked up from package.json, else required)
`outdir` ("./public")
`short_name` (none)
`display` ("browser")
`sizes` ([512, 192, 180, 168, 144, 96, 72, 48, 32, 16])
`description` (none)
`webmanifest` overrides properties in the generated web manifest file (available only via configuration file, not per option)

1 https://developer.mozilla.org/en-US/docs/Web/Manifest
