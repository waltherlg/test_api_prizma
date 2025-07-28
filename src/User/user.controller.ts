import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRepository } from './user.repository';
import {
	CreateUserDto,
	CreateUserResponseDto,
	schemesApi,
	ZodUserSchema,
} from './user.dto';
import { UserService } from './user.service';
import { createZodDto } from 'nestjs-zod';
import { TimeEntity } from './time.dto';

export class createUsersShemaDto extends createZodDto(schemesApi.user.create) {}

export class createUsersShemaDto2 extends createZodDto(ZodUserSchema) {}

type userInputKostil = {
	login: string;
	email: string;
};

type inputProfileBody = {
	providerName: string;
	providerEmail: string;
	bio: string;
	userId: number;
};
type rte = (typeof ZodUserSchema)['_output'];

@ApiTags('User') // Категория API в Swagger
@Controller('user')
export class UserController {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userServise: UserService,
	) {}

	@HttpCode(204)
	@Delete(':userId')
	async deleteUser(@Param('userId') userId) {
		const result = await this.userRepository.deleteUserById(userId);
		if (!result) throw new NotFoundException('user');
	}

	@Get(':userId')
	async getUserWithProfile(@Param('userId') userId) {
		const result = await this.userRepository.getUserWithProfile(userId);
		if (!result) throw new NotFoundException('user');
		return result;
	}

	@Get('withprofile/:userId')
	async getUserWithProfileEnt(@Param('userId') userId) {
		const result =
			await this.userRepository.getUserAsEntityWithProfiel(+userId);
		if (!result) throw new NotFoundException('user');
		return result;
	}

	@Post()
	async createUser(@Body() body: userInputKostil) {
		const result = await this.userServise.createUser(body);
		return result;
	}

	@Post('profile')
	async createProfileForUser(@Body() body: inputProfileBody) {
		const result = await this.userServise.createProfile(body);
		return result;
	}

	@Post('time')
	async postTime() {
		const time = TimeEntity.newEntity();
		const result = await this.userRepository.createTime(time);
		return result;
	}
}
