function shutdown(server) {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server shut down gracefully.');
      process.exit(0);
    });
  }

  export default shutdown;