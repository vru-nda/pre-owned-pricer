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
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

  it('throws an error if user signs up with an email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'test@test.com', password: 'test' } as User,
      ]);
    // done and async await doesn't work together with the latest version
    await expect(service.signup('test@test.com', 'test')).rejects.toThrow(
      BadRequestException,
    );
  });
});
