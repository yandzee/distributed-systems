// Author: Renat Tuktarov (yandzeek@gmail.com)

module.exports = {
  'logger': {
    'levels': {
      'error': 0,
      'info': 1,
      'warn': 2,
      'prompt': 3,
      'debug': 4,
      'verbose': 5
    },
    'colors': {
      'info': 'green',
      'warn': 'yellow',
      'error': 'red',
      'verbose': 'cyan',
      'prompt': 'grey',
      'debug': 'magenta'
    },
    'dev': {
      'level': 'verbose',
      'prettyPrint': true,
      'colorize': true,
      'silent': false,
      'timestamp': false
    },
    'test': {
      'level': 'error',
      'prettyPrint': true,
      'colorize': true,
      'silent': false,
      'timestamp': false
    },
    'prod': {
      'level': 'warn',
      'prettyPrint': true,
      'colorize': true,
      'silent': false,
      'timestamp': true
    }
  },
  'server': {
    'port': process.env.BACKEND_PORT || 3181
  },
  'storage': {
    'test': {
      database: 'distributed-systems-test',
      host: 'localhost',
      user: '',
      password: '',
    },
    'prod': {
      database: 'distributed-systems',
      host: 'localhost',
      user: '',
      password: '',
    },
  }
};
