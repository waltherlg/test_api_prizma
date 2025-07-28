import { Time } from '@prisma/client';

export class TimeEntity {
	DateTime: Date;
	DateTimedbDate: Date;
	DateTimedbTimestamp3: Date;
	DateTimedbTimestamptz3: Date;

	static newEntity(): TimeEntity {
		return {
			DateTime: new Date(),
			DateTimedbDate: new Date(),
			DateTimedbTimestamp3: new Date(),
			DateTimedbTimestamptz3: new Date(),
		};
	}
}
