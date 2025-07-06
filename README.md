[![CI](https://github.com/febeling/mkwebmanifest/actions/workflows/node.js.yml/badge.svg)](https://github.com/febeling/mkwebmanifest/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/mkwebmanifest.svg)](https://badge.fury.io/js/mkwebmanifest)

# mkwebmanifest

Generate icons in different sizes and a web manifest ([W3C standard](https://w3c.github.io/manifest/), [MDN docs](https://developer.mozilla.org/en-US/docs/Web/Manifest)), in order to link icons (and make a web application installable).

The web manifest will contain all properties that are required on some platforms (`name`, `icons`, `start_url`, `display`).

## Usage

```shell
npx mkwebmanifest --icon app/assets/images/icon.svg --name myapp
```

Or using all settings from a default configuration file location

```shell
cat > mkwebmanifest.config.json << EOF
{
  "name": "myapp",
  "icon": "app/assets/images/icon.svg"
}
EOF

npx mkwebmanifest
```

Or if installed

```shell
mkwebmanifest --icon app/assets/images/icon.svg --name myapp
```

It's recommended to provide an SVG or large PNG (e.g. 512x512) source icon.

## Options and Configuration

Only the `icon` and `name` settings are required, either as option or configuration. `icon` is path of the input icon file, `name` is the name of the application.

If the `--name` option isn't given, the command assumes a configuration file at one of the default locations.

- `config/mkwebmanifest.json`
- `mkwebmanifest.json`
- `mkwebmanifest.config.json`
- `config/mkwebmanifest.config.json`

A configuration file might look like this:

```json
{
  "icon": "app/assets/images/icon-oval.svg",
  "outdir": "app/assets/builds",
  "name": "MyApp. Make my data available on the web while maintaining full control",
  "short_name": "MyApp",
  "description": "MyApp is a tool that makes your current data available while maintaining full control over it"
}
```

A different configuration file can be set with `--config`.

## Configuration

- `icon` (_required_) - input icon file
- `name` (_required_) - the app name
- `outdir` ("./public")
- `file` ("app.webmanifest") - name of the manifest file ("manifest.json" is common, too)
- `position` - ("center") placement of the input icon on resize (e.g. "bottom", see [sharp resize](https://sharp.pixelplumbing.com/api-resize/) documentation)
- `short_name` - short version of the name
- `display` ("browser") - controls if standard browser UI is used, see the standard for details
- `sizes` (`512,192,180,168,144,96,72,48,32,16`) - which icon sizes to generate from the input icon. The input should be larger than these, or vector based for best results. Use comma-delimited list of sizes (without spaces)
- `description` - description of the app
- `webmanifest` - provide further properties for the generated web manifest file (only available via configuration file)
- `ico` - generate a favicon.ico file (default: false). Recommended to include 16x16, 32x32, and 48x48 output icons, possibly 64x64 and 128x128, as these will all be packaged into the `favicon.ico` file

## Limitations

- The icon files with the various sizes are all written to a subdirectory in `outdir`. This subdirectory cannot be configure for now. It's always named 'icons'.

## Credit

Besides the dependencies declared in package.json, test fixtures contain the CheckBadge icon from https://heroicons.dev, used under an [MIT](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE) license, and a version converted to PNG sized 96x96 px by [svgexporter](https://www.npmjs.com/package/svgexport).
