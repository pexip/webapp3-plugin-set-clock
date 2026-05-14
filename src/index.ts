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

  // eslint-disable-next-line @typescript-eslint/init-declarations -- Assigned inside try/catch
  let json: unknown
  try {
    json = await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console -- Log diagnostic error for malformed config
    console.error('Failed to parse config.json:', error)
    return
  }

  const config = validateConfig(json)
  if (config === undefined) {
    return
  }

  // Skip if the clock is already configured (result is an object with the current config).
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-type-assertion,@typescript-eslint/no-explicit-any -- Send request is not typed
  const clock = (await (plugin.conference as any).sendRequest({
    path: 'get_clock',
    method: 'GET'
  })) as { data: { result: object | boolean } }

  if (typeof clock.data.result === 'object') {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-type-assertion,@typescript-eslint/no-explicit-any -- Send request is not typed
  ;(plugin.conference as any).sendRequest({
    path: 'set_clock',
    method: 'POST',
    payload: config
  })
})
