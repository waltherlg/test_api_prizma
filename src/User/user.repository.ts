import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateProfileDomainDto, CreateUserDto, DomainUser } from './user.dto';
import { TimeEntity } from './time.dto';

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}
	// Создание пользователя
	async createUser(userData: CreateUserDto): Promise<DomainUser> {
		// await this.prisma.user.deleteMany({});
		// await this.prisma.profile.deleteMany({});

		try {
			const user = await this.prisma.user.create({
				data: {
					login: userData.login,
					email: userData.email,
				},
			});
			return DomainUser.createFromData(user);
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async createProfile(dto: CreateProfileDomainDto) {
		try {
			const profile = await this.prisma.profile.create({
				data: {
					providerName: dto.providerName,
					providerEmail: dto.providerEmail,
					userId: dto.userId,
					bio: dto.bio,
				},
			});
			return profile;
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async createUserWithProfile(
		userData: CreateUserDto,
		profileData: CreateProfileDomainDto,
	): Promise<User> {
		await this.prisma.user.deleteMany({});
		await this.prisma.profile.deleteMany({});
		const user = await this.prisma.user.create({
			data: {
				login: userData.login,
				email: userData.email,
			},
		});
		const profile = await this.prisma.profile.create({
			data: {
				providerName: profileData.providerName,
				providerEmail: profileData.providerEmail,
				userId: profileData.userId,
				bio: profileData.bio,
			},
		});
		return user;
	}

	// Поиск пользователя по email
	async findUserByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	// Получение всех пользователей
	async findAllUsers(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	async getUserWithProfile(Id) {
		const userId = +Id;
		const user = await this.prisma.user.findUnique({
			where: { userId },
			include: {
				Profile: {
					select: {
						bio: true, // Указываем конкретное поле, которое нужно вернуть
					},
				},
			},
		});
		console.log(user);

		return user;
	}

	async deleteUserById(userId) {
		const result = await this.prisma.user.deleteMany({
			where: { userId: +userId },
		});
		console.log(result);

		return result.count > 0;
	}

	async getUserAsEntityById(userId: number): Promise<DomainUser | null> {
		const user = await this.prisma.user.findUnique({
			where: { userId },
		});
		if (!user) {
			return null;
		}
		return DomainUser.createFromData(user);
	}

	async getUserAsEntityWithProfiel(
		userId: number,
	): Promise<DomainUser | null> {
		const user = await this.prisma.user.findUnique({
			where: { userId },
			include: {
				Profile: {
					select: {
						bio: true, // Указываем конкретное поле, которое нужно вернуть
					},
				},
			},
		});
		return DomainUser.createFromData(user);
	}

	async createTime(time) {
		const raw = await this.prisma.$executeRawUnsafe(`
  INSERT INTO "Time" (
    "DateTime",
    "DateTimedbDate",
    "DateTimedbTimestamp3",
    "DateTimedbTimestamptz3"
  ) VALUES (
    NOW(),         -- обычное DateTime
    CURRENT_DATE,  -- только дата
    NOW(),         -- timestamp без timezone
    NOW()          -- timestamptz с timezone
  )
  RETURNING *;


`);

		console.log(raw);

		const prismaResult = await this.prisma.time.create({
			data: { ...time },
		});

		return { prismaResult };
	}
}
