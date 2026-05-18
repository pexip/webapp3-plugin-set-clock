import type { Config } from './types'
import { validateConfig } from './validateConfig'

export const loadConfig = async (): Promise<Config> => {
  const response = await fetch('./config.json')
  if (!response.ok) {
    throw new Error(
      `Failed to load config.json: ${response.status.toString()} ${response.statusText}`
    )
  }

  const json: unknown = await response.json().catch((error: unknown) => {
    throw new Error('Failed to parse config.json', { cause: error })
  })

  const config = validateConfig(json)
  if (config === undefined) {
    throw new Error('Invalid config.json')
  }

  return config
}
