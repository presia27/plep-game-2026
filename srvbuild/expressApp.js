"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use('/', express_1.default.static('view'));
    app.use('/assets', express_1.default.static('assets'));
    app.use('/js', express_1.default.static('js'));
    return app;
};
exports.default = createApp;
//# sourceMappingURL=expressApp.js.map