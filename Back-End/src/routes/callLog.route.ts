
import express from 'express';
import { CallLogController } from '../controllers/callLog/callLogController';
import { CallLogService } from '../services/callLog/callLog.service';
import { CallLogRepository } from '../repositories/callLogs/callLog.repository';

import { Routers } from '../utils/Routers';

const router = express.Router();

const callLogRepository = new CallLogRepository();
const callLogService = new CallLogService(callLogRepository);
const callLogController = new CallLogController(callLogService);

router.route(Routers.callLogRouters.getCallData)
.get(callLogController.getCallData.bind(callLogController));

export default router;