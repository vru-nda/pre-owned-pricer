import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of usersService
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@new.com', 'password');

    expect(user.password).not.toEqual('test@new.com');
    const [salt, hashed] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hashed).toBeDefined();
  });

  it('throws an error if user signs up with an email that is already in use', async () => {
    await service.signup('test@test.com', 'test')

    // done and async await doesn't work together with the latest version
    await expect(service.signup('test@test.com', 'test')).rejects.toThrow(
      BadRequestException,
    );
  });

  // ********* Signin ************//
  it('throws an error if signin is called with an unused email', async () => {
    await expect(service.signin('wewe@jvf.com', 'ewewe')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'test')
    await expect(service.signin('test@test.com', 'jhvh')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('admin', 'mypassword')
    const user = await service.signin('admin', 'mypassword');
    expect(user).toBeDefined();
  });
});
