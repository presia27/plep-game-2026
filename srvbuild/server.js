"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressApp_1 = __importDefault(require("./expressApp"));
const PORT = process.env.PORT || 8000;
const startServer = () => {
    console.log('\n');
    try {
        const app = (0, expressApp_1.default)();
        const server = app.listen(PORT, () => {
            console.log('\n');
            console.log(`Server running on ${PORT}`);
        });
        const shutdownServer = (sig) => {
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
        process.on('SIGTERM', () => shutdownServer('SIGTERM'));
        process.on('SIGINT', () => shutdownServer('SIGINT'));
    }
    catch (err) {
        console.error('Failed to start the server', err);
        process.exit(1);
    }
};
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at: ', promise, 'Reason:', reason);
    process.exit(1);
});
startServer();
//# sourceMappingURL=server.js.map