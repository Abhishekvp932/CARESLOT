"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const admin_model_1 = __importDefault(require("../../models/implementation/admin.model"));
const base_repository_1 = require("../base.repository");
class AdminRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(admin_model_1.default);
    }
}
exports.AdminRepository = AdminRepository;
