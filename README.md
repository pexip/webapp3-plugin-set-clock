# Web App 3 Plugin: Set Clock

Set a clock in the video layout of the conference.

To activate this plugin you have to comply with the following requirements:

- Use Pexip Infinity 39 or higher. For v39 the clock is a preview feature, so
  you need to enable it in the Management Node (Platform > Global settings >
  Tech preview features).
- Use a transcoded conference. The clock will not be shown in a direct media
  conference.

More information about the clock can be found in the
[documentation](https://docs.pexip.com/admin/display_timer.htm).

## Configuration

The plugin will read the configuration from the `config.json` file. The
configuration has the following format:

```json
{
  "type": "time",
  "date": "dd/mm/yyyy",
  "suffix": " UTC"
}
```

| Field          | Type   | Description                                                                                                                                                                                                       |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | string | The clock options are: <ul><li>`"elapsed"`: the clock increments starting from 0.</li><li>`"remaining"`: the clock decrements from `starting_value`.</li><li>`"time"`: displays the current local time.</li></ul> |
| starting_value | number | The starting value in seconds for the countdown timer. Only applies for a type of `remaining`. Range: 1-31536000                                                                                                  |
| prefix         | string | Optional text to display before the clock.                                                                                                                                                                        |
| suffix         | string | Optional text to display after the clock.                                                                                                                                                                         |
| date           | string | The required date format. The options are: <ul><li>`"dd/mm/yyyy"`</li><li>`"mm/dd/yyyy"`</li></ul> Only applies for a type of `time`.                                                                             |

Example to set a countdown clock of 5 minutes:

```json
{
  "type": "remaining",
  "starting_value": 300,
  "prefix": "Time remaining: "
}
```

The plugin first checks the current conference clock using `get_clock`. If a
clock is already configured, the plugin will not overwrite it with the values
from `config.json`.

For more information about the configuration of the clock, check the
[Pexip REST API documentation](https://docs.pexip.com/api_client/api_rest.htm#set_clock).

## Run for development

- To be able to build the plugin, you need to comply with the following versions
  or higher:

  | NodeJS   | NPM     |
  | -------- | ------- |
  | v22.19.0 | v10.9.3 |

- Create a file `.env` in the root of the project with the following content:

```env
VITE_INFINITY_TARGET=<infinity_url>
VITE_DEV_SERVER_PORT=<dev_server_port>
```

The `VITE_INFINITY_TARGET` variable is **mandatory** and should contain the URL
of the Pexip Infinity system where you want to test the plugin.

The `VITE_DEV_SERVER_PORT` variable is an optional variable used to specify the
port on which the development server will run. If not provided, it defaults to
`5173`.

You can check an example in the provided `.env.example` file.

- Install all the dependencies:

```bash
$ npm i
```

- Run the dev environment:

```bash
$ npm start
```

The plugin will be served from https://localhost:5173 (visit that page and
accept the self-signed certificates), but you should access it thought the Web
App 3 URL. You have more information about how to configure your environment in
the
[Developer Portal: Setup guide for plugin developers](https://developer.pexip.com/docs/plugins/webapp-3/setup-guide-for-plugin-developers).

## Build for production

To create a package, you will need to first install all the dependencies:

```bash
$ npm i
```

And now to create the package itself:

```bash
$ npm run build
```

Congrats! Your package is ready and it will be available in the `dist` folder.
The next step is to create a Web App3 branding and copy `dist` into that
branding.

If you want to know more about how to deploy your plugin in Pexip Infinity,
check our [Developer Portal](https://developer.pexip.com).
