import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.Interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Serialize(UserDto) //ignore some fields with interceptor
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/currentUser')
   getCurrentUser(@Session() session:any) {
    return this.usersService.findOne(session.userId)
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session:any) {
    const user = await this.authService.singup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/singin')
  async singin(@Body() body: CreateUserDto, @Session() session:any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/singout')
  async singout(@Session() session:any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
