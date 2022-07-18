import { Controller } from '@nestjs/common';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@Controller('bilan-comptable')
@Roles(Role.Manager, Role.Accounting, Role.Manager)
export class BilanComptableController {}
