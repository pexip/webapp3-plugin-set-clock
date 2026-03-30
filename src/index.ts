import { registerPlugin } from '@pexip/plugin-api'

const version = 1

const plugin = await registerPlugin({
  id: 'set-clock',
  version
})

plugin.events.authenticatedWithConference.add(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-type-assertion,@typescript-eslint/no-explicit-any -- Send request is not typed
  ;(plugin.conference as any).sendRequest({
    path: 'set_clock',
    method: 'POST',
    payload: {
      type: 'time',
      date: 'dd/mm/yyyy'
    }
  })
})
