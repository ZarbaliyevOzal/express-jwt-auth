const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint, printf } = format;
require('winston-daily-rotate-file')

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
})

var transport = new transports.DailyRotateFile({
  filename: '%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
})

transport.on('rotate', function(oldFilename, newFilename) {
  // do something fun
})

const logger = createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    prettyPrint()
  ),
  transports: [
    transport
  ]
})

module.exports = logger