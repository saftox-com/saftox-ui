import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'

export const defaultConfig: preset.PresetOptions = {
  entries: [],
  drop_console: true,
  cjs: true,
}

export const doubleEntryConfig = (
  customPresetConfig?: preset.PresetOptions,
  generatePackageExports?: boolean,
) =>
  defineConfig((config) => {
    const isAllowedGeneratePackageExports = generatePackageExports ?? false
    const watching = !!config.watch

    const parsed_data = preset.parsePresetOptions(
      { ...defaultConfig, ...customPresetConfig },
      watching,
    )

    if (!watching && isAllowedGeneratePackageExports) {
      const package_fields = preset.generatePackageExports({ ...parsed_data })

      console.log(`package.json: \n\n${JSON.stringify(package_fields, null, 2)}\n\n`)

      preset.writePackageJson(package_fields)
    }

    return preset.generateTsupOptions(parsed_data)
  })
