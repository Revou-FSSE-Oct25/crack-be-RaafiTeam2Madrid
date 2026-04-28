import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async getAllLogs() {
    return this.auditLogsService.findAll();
  }

  @Post()
  async createLog(@Body() logData: any) {
    return this.auditLogsService.create(logData);
  }
}