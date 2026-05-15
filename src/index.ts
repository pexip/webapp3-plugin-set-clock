import { registerPlugin } from '@pexip/plugin-api'
import { loadConfig } from './loadConfig'
import type { Config } from './types'

const version = 1

const plugin = await registerPlugin({
  id: 'set-clock',
  version
})

plugin.events.authenticatedWithConference.add(async () => {
  const config: Config | undefined = await loadConfig().catch(
    (error: unknown) => {
      // eslint-disable-next-line no-console -- Log error for failed config load
      console.error('Failed to load config:', error)
      return undefined
    }
  )

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
