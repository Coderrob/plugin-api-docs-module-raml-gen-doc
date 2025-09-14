# Backstage.io Api-Docs Plugin: RAML to OpenAPI Renderer

![Coverage Badge](badges/coverage.svg)

## Overview

This is a plugin for [Backstage](https://backstage.io/) that extends the capabilities of the built-in API documentation feature by adding support for parsing and rendering [RAML](https://raml.org/) (RESTful API Modeling Language) definitions in [OpenAPI](https://www.openapis.org/) format.

With this integration, Backstage users can seamlessly view and manage their APIs defined in RAML within the same familiar interface as OpenAPI.

## Features

- **Converts RAML to OpenAPI**: Automatically translates RAML API definitions into OpenAPI v2.0 specifications.
- **Enhanced Documentation**: Leverages Backstage's Api-Docs capabilities for a consistent user experience.
- **Easy Integration**: Designed to work seamlessly with existing Backstage setups and plugins.

## Prerequisites

- Basic knowledge of Backstage setup.
- Node.js installed on your development machine (preferably the latest LTS version).
- Existing or planned RAML API definitions in your project.

## Installation

1. **Clone or Download this Repository**

   ```bash
   git clone https://github.com/Coderrob/plugin-api-docs-module-raml-gen-doc.git
   cd plugin-api-docs-module-raml-gen-doc
   ```

2. **Install Dependencies**

   Ensure that you have Backstage installed and configured. If not, follow the [official Backstage documentation](https://backstage.io/docs/getting-started/) to set up a new instance.

3. **Build the Plugin**

   ```bash
   yarn build
   ```

4. **Link the Plugin to your Backstage App**

   Navigate to your Backstage app directory and link the plugin:

   ```bash
   cd path/to/your-backstage-app
   yarn --cwd packages/app add @coderrob/plugin-api-docs-module-raml-gen-doc
   ```

5. **Register the Plugin in Your App's `packages/app/src/plugins.ts`**

   Add the following import statement to register the plugin with Backstage:

   ```typescript
   export const ramlOpenApiPlugin = createPlugin({
     id: 'raml-open-api',
     routes: {
       root: rootRouteRef,
     },
   });
   ```

6. **Restart Your Backstage App**

   After making changes, restart your Backstage application to see the new plugin in action:

   ```bash
   yarn dev
   ```

## Usage

1. **Add RAML Files**

   Place your RAML API definitions under a directory specified for API documentation within your Backstage app (e.g., `static/docs/api`).

2. **Navigate to API Docs**

   Access the API documentation section in Backstage, and you should see an option or tab dedicated to RAML-based APIs.

3. **View Rendered OpenAPI Documentation**

   The plugin will automatically convert the RAML definitions into OpenAPI format and render them using Backstage's built-in tools for a clean, interactive experience.

## Configuration

The plugin leverages Backstage’s existing configuration settings for API documentation. No additional configuration is required unless you need to customize the conversion process or rendering options.

If customization is needed, refer to the following optional configuration steps:

1. **Custom Conversion Scripts**

   Modify the conversion scripts located in `src/raml-to-openapi` to suit your specific RAML and OpenAPI version requirements.

2. **Update Plugin Settings**

   Adjust settings within `src/plugin.tsx` or related configuration files to change behavior such as API scanning paths, default rendering themes, etc.

## Contributing

Contributions are welcome! Feel free to open issues for bug reports or feature requests, and submit pull requests with your enhancements.

- Fork this repository.
- Create a new branch: `git checkout -b feature/your-feature-name`.
- Commit your changes: `git commit -m "Add some feature"`.
- Push to the branch: `git push origin feature/your-feature-name`.
- Open a pull request against the main branch in this repository.

## License

This plugin is released under the Apache 2.0 License. Please see [LICENSE](LICENSE) for more details.

## Support and Community

For any questions or support related to this plugin, please join our community on Slack or check out the GitHub Issues section of this repository.

- **GitHub Issues**: [Issues on GitHub](https://github.com/your-repo/backstage-raml-openapi-plugin/issues)

Enjoy using this plugin to enhance your Backstage API documentation capabilities with RAML support!
