import { registerPlugin } from '@pexip/plugin-api'
import type { Config } from './types'

const version = 1

const plugin = await registerPlugin({
  id: 'set-clock',
  version
})

plugin.events.authenticatedWithConference.add(async () => {
  const response = await fetch('./config.json')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Response is a JSON file with the Config shape
  const config = (await response.json()) as Config

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
