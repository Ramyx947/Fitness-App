module.exports = {
    mongodbMemoryServerOptions: {
      binary: {
        version: '5.0.5', // Or another stable MongoDB version
        skipMD5: true,
      },
      instance: {
        dbName: 'jest',
      },
      autoStart: false,
    },
  };