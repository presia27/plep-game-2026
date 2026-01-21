/**
 * Main entrypoint for lightweight HTTP server for testing
 */

import createApp from './expressApp';

const PORT = process.env.PORT || 8000;

/** START the server, includes graceful shutdown */
const startServer = () => {
  console.log('\n');

  try {
    const app = createApp();
    const server = app.listen(PORT, () => {
      console.log('\n');
      console.log(`Server running on ${PORT}`);
    });

    const shutdownServer = (sig: string) => {
      console.log(`\n Received ${sig}. Shutting down...`);

      server.close((err) => {
        if (err) {
          console.error('Error during server shutdown: ', err);
          process.exit(1);
        }

        console.log('Server shutdown successful. Goodbye!');
        process.exit(0);
      });
    };

    // Register SIGNAL HANDLERS for graceful shutdown
    process.on('SIGTERM', () => shutdownServer('SIGTERM'));
    process.on('SIGINT', () => shutdownServer('SIGINT'));
  } catch (err) {
    console.error('Failed to start the server', err);
    process.exit(1);
  }
};

// Handle uncaught EXCEPTIONS and REJECTIONS
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception: ', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at: ', promise, 'Reason:', reason);
  process.exit(1);
});

// START the server
startServer();
