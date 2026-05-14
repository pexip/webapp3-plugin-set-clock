import { registerPlugin } from '@pexip/plugin-api'
import { validateConfig } from './validateConfig'

const version = 1

const plugin = await registerPlugin({
  id: 'set-clock',
  version
})

plugin.events.authenticatedWithConference.add(async () => {
  const response = await fetch('./config.json')
  if (!response.ok) {
    // eslint-disable-next-line no-console -- Log diagnostic error for missing or invalid config
    console.error(
      `Failed to load config.json: ${response.status.toString()} ${response.statusText}`
    )
    return
  }

  const json: unknown = await response.json()

  const config = validateConfig(json)
  if (config === undefined) {
    return
  }

  // Check if the clock is already set and only send the request if it needs to be updated.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-type-assertion,@typescript-eslint/no-explicit-any -- Send request is not typed
  const clock = (await (plugin.conference as any).sendRequest({
    path: 'get_clock',
    method: 'GET'
  })) as { data: { result: object | boolean } }

  if (clock.data.result === true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-type-assertion,@typescript-eslint/no-explicit-any -- Send request is not typed
    ;(plugin.conference as any).sendRequest({
      path: 'set_clock',
      method: 'POST',
      payload: config
    })
  }
})
