/**
 * Logger Utility
 * Provides consistent logging throughout the application
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const LOG_LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
}

const LOG_COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m', // Green
  WARN: '\x1b[33m', // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m', // Reset
}

class Logger {
  constructor(context = 'APP', level = LOG_LEVELS.INFO) {
    this.context = context
    this.level = level
  }

  /**
   * Format log message with timestamp and context
   */
  format(levelName, message, data) {
    const timestamp = new Date().toISOString()
    const color = LOG_COLORS[levelName]
    const reset = LOG_COLORS.RESET

    const prefix = `${color}[${timestamp}] [${levelName}] [${this.context}]${reset}`
    const body = message

    return {
      prefix,
      body,
      data,
    }
  }

  /**
   * Log debug message
   */
  debug(message, data = null) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      const { prefix, body } = this.format('DEBUG', message, data)
      if (data) {
        console.debug(`${prefix} ${body}`, data)
      } else {
        console.debug(`${prefix} ${body}`)
      }
    }
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    if (this.level <= LOG_LEVELS.INFO) {
      const { prefix, body } = this.format('INFO', message, data)
      if (data) {
        console.log(`${prefix} ${body}`, data)
      } else {
        console.log(`${prefix} ${body}`)
      }
    }
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    if (this.level <= LOG_LEVELS.WARN) {
      const { prefix, body } = this.format('WARN', message, data)
      if (data) {
        console.warn(`${prefix} ${body}`, data)
      } else {
        console.warn(`${prefix} ${body}`)
      }
    }
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    if (this.level <= LOG_LEVELS.ERROR) {
      const { prefix, body } = this.format('ERROR', message, error)
      if (error instanceof Error) {
        console.error(`${prefix} ${body}`, {
          message: error.message,
          stack: error.stack,
        })
      } else if (error) {
        console.error(`${prefix} ${body}`, error)
      } else {
        console.error(`${prefix} ${body}`)
      }
    }
  }

  /**
   * Log HTTP request
   */
  logRequest(req) {
    const { method, path, query, ip } = req
    this.debug(`${method} ${path}`, {
      ip,
      query: Object.keys(query).length > 0 ? query : undefined,
    })
  }

  /**
   * Log HTTP response
   */
  logResponse(req, status, duration) {
    const { method, path } = req
    const color = status >= 400 ? LOG_COLORS.WARN : LOG_COLORS.INFO
    const levelName = status >= 400 ? 'WARN' : 'INFO'
    const { prefix } = this.format(levelName, `${method} ${path} ${status}`, null)

    console.log(`${prefix} (${duration}ms)`)
  }

  /**
   * Create child logger with different context
   */
  child(context) {
    return new Logger(`${this.context}:${context}`, this.level)
  }
}

/**
 * Create logger instance
 */
export function createLogger(context = 'APP', level = 'info') {
  const numericLevel = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO
  return new Logger(context, numericLevel)
}

/**
 * Global logger instance
 */
export const logger = createLogger('STUDYHUB', process.env.LOG_LEVEL || 'info')

export default logger
