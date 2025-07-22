"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const db_1 = __importDefault(require("./config/db"));
const passport_2 = require("./config/passport");
const doctor_route_1 = __importDefault(require("./routes/doctor.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOperation = {
    origin: "http://localhost:2025",
    credentials: true
};
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || '3fedfee11c19bbcc6df09c4b',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}));
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOperation));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.confiqurePassport)();
app.use('/api/auth', auth_route_1.default);
app.use('/api/doctor', doctor_route_1.default);
app.use('/api/admin', admin_route_1.default);
(0, db_1.default)();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server ${PORT} is running`);
});
