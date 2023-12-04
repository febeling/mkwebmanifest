import synopt from './synopt.js';

synopt
  .summary("Generate icons and web manifest for web applications")
  .description('`icon` path and `name` are required, too. Pass required parameters as options or by config file')
  .option("--icon", "source icon file")
  .option("--name", "name of the web application")
  .option("--config", "configuration file")
  .option("--outdir", "directory path for generated files")
  .option("--sizes", "comma-separated list of icon sizes to generate (no spaces)")
  .option("--short-name", "short variant of the app name")
  .option("--display", "configure browser UI or standalone")
  .option("--description", "app description")
  .option("--tags", "print meta tags to include manifest file and icons", { boolean: true })
  .option("--watch", "watch icon and configuration for changes", { boolean: true });

export { synopt as synoptions };