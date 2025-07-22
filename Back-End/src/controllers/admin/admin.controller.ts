import { AdminService } from "../../services/admin/admin.service";
import IAdminController from "../../interface/admin/admin.controller.interface";
import { Request, Response } from "express";
import { HttpStatus } from "../../utils/httpStatus";
export class AdminController implements IAdminController {
  constructor(private adminService: AdminService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminService.findAllUsers();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminService.findAllDoctors();

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async blockAndUnblockUsers(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;
      const { isBlocked } = req.body;
      const result = await this.adminService.blockAndUnblockUsers(
        userId,
        isBlocked
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }
  async blockAndUnblockDoctors(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const { isBlocked } = req.body;

      const result = await this.adminService.blockAndUnblockDoctors(
        doctorId,
        isBlocked
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }
  async findUnprovedDoctors(req: Request, res: Response): Promise<void> {
      try {
        const result = await this.adminService.findUnApprovedDoctors();

        res.status(HttpStatus.OK).json(result)
      } catch (error) {
        const err = error as Error

        res.status(HttpStatus.NOT_FOUND).json({msg:err.message})
      }
  }
  async doctorApprove(req: Request, res: Response): Promise<void> {
    try {
      const {id:doctorId} = req.params
      console.log('approing doctor id is',doctorId);
      const result = await this.adminService.doctorApprove(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error

      res.status(HttpStatus.NOT_FOUND).json({msg:err.message})
    }
  }
  async doctorReject(req: Request, res: Response): Promise<void> {
    try {
      const {id:doctorId} = req.params

      const result = await this.adminService.doctorReject(doctorId)

    } catch (error) {
      const err = error as Error

      res.status(HttpStatus.NOT_FOUND).json({msg:err.message})
    }
  }
}
