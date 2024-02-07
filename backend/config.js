import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orderit',

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    item: {
      name: 'ItemController',
      path: '../controllers/itemController',
    },
    order: {
      name: 'OrderController',
      path: '../controllers/orderController',
    },
  },

  repos: {
    item: {
      name: 'ItemRepo',
      path: '../repos/itemRepo',
    },
    order: {
      name: 'OrderRepo',
      path: '../repos/orderRepo',
    },
  },

  services: {
    item: {
      name: 'ItemService',
      path: '../services/ServicesImpl/itemService',
    },
    order: {
      name: 'OrderService',
      path: '../services/ServicesImpl/orderService',
    },
  },
};
