import type { Config } from './types'

const VALID_TYPES: readonly string[] = ['elapsed', 'remaining', 'time']
const VALID_DATE_FORMATS: readonly string[] = ['dd/mm/yyyy', 'mm/dd/yyyy']
const MIN_STARTING_VALUE = 1
const MAX_STARTING_VALUE = 31536000

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isValidType = (value: unknown): value is Config['type'] =>
  typeof value === 'string' && VALID_TYPES.includes(value)

const isValidDateFormat = (value: unknown): value is Config['date'] =>
  typeof value === 'string' && VALID_DATE_FORMATS.includes(value)

const isValidStartingValue = (value: unknown): value is number =>
  typeof value === 'number' &&
  value >= MIN_STARTING_VALUE &&
  value <= MAX_STARTING_VALUE

const logError = (message: string): void => {
  // eslint-disable-next-line no-console -- Log diagnostic error for invalid config
  console.error(`Invalid config.json: ${message}`)
}

const logWarning = (message: string): void => {
  // eslint-disable-next-line no-console -- Log diagnostic warning for ignored config fields
  console.warn(`config.json: ${message}`)
}

const warnIgnoredFields = (
  type: Config['type'],
  obj: Record<string, unknown>
): void => {
  if (type !== 'remaining' && obj.starting_value !== undefined) {
    logWarning(`"starting_value" is ignored when type is "${type}"`)
  }
  if (type !== 'time' && obj.date !== undefined) {
    logWarning(`"date" is ignored when type is "${type}"`)
  }
}

const validateTypeSpecificFields = (
  type: Config['type'],
  obj: Record<string, unknown>
): boolean => {
  if (type === 'remaining' && !isValidStartingValue(obj.starting_value)) {
    logError(
      `"starting_value" is required when type is "remaining" and must be a number between ${String(MIN_STARTING_VALUE)} and ${String(MAX_STARTING_VALUE)}`
    )
    return false
  }
  if (
    type === 'time' &&
    obj.date !== undefined &&
    !isValidDateFormat(obj.date)
  ) {
    logError(`"date" must be one of ${VALID_DATE_FORMATS.join(', ')}`)
    return false
  }
  warnIgnoredFields(type, obj)
  return true
}

const validateOptionalStrings = (obj: Record<string, unknown>): boolean => {
  if (obj.prefix !== undefined && typeof obj.prefix !== 'string') {
    logError('"prefix" must be a string')
    return false
  }
  if (obj.suffix !== undefined && typeof obj.suffix !== 'string') {
    logError('"suffix" must be a string')
    return false
  }
  return true
}

const buildConfig = (
  obj: Record<string, unknown>,
  type: Config['type']
): Config => ({
  type,
  ...(type === 'remaining' &&
    isValidStartingValue(obj.starting_value) && {
      starting_value: obj.starting_value
    }),
  ...(typeof obj.prefix === 'string' && { prefix: obj.prefix }),
  ...(typeof obj.suffix === 'string' && { suffix: obj.suffix }),
  ...(type === 'time' && isValidDateFormat(obj.date) && { date: obj.date })
})

export const validateConfig = (config: unknown): Config | undefined => {
  if (!isRecord(config)) {
    logError('must be a JSON object')
    return undefined
  }

  if (!isValidType(config.type)) {
    logError(`"type" must be one of ${VALID_TYPES.join(', ')}`)
    return undefined
  }

  if (!validateTypeSpecificFields(config.type, config)) {
    return undefined
  }

  if (!validateOptionalStrings(config)) {
    return undefined
  }

  return buildConfig(config, config.type)
}
