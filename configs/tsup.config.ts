import {defineConfig} from "tsup";
import * as preset from "tsup-preset-solid";

export const defaultConfig: preset.PresetOptions = {
  entries: [],
  // Setting `true` will remove all `console.*` calls and `debugger` statements
  drop_console: true,
  // Setting `true` will generate a CommonJS build alongside ESM (default: `false`)
  cjs: true,
};

export const doubleEntryConfig = (customPresetConfig?: preset.PresetOptions) =>
  defineConfig((config) => {
    const watching = !!config.watch;

    const parsed_data = preset.parsePresetOptions(
      {...defaultConfig, ...customPresetConfig},
      watching,
    );

    if (!watching) {
      const package_fields = preset.generatePackageExports(parsed_data);

      console.log(`package.json: \n\n${JSON.stringify(package_fields, null, 2)}\n\n`);

      /*
            will update ./package.json with the correct export fields
        */
      preset.writePackageJson(package_fields);
    }

    return preset.generateTsupOptions(parsed_data);
  });
