import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { AuthenticationGuard } from './guard/authentication.guard';

@Controller('token')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  create(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.authenticationService.create(createAuthenticationDto);
  }

  @Put()
  @UseGuards(AuthenticationGuard)
  update(@Request() { user }) {
    return this.authenticationService.update(+user.sub);
  }
}
