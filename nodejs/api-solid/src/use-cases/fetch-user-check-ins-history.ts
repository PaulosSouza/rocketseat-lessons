import { CheckInsRespository } from "@/repositories/check-ins-repository";

import { CheckIn } from "@prisma/client";

interface FetchUserCheckInsHistoryUseCaseRequest {
	userId: string;
	page: number;
}

type FetchUserCheckInsHistoryUseCaseResponse = {
	checkIns: CheckIn[];
};

export class FetchUserCheckInsHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRespository) {}

	async execute({
		userId,
		page,
	}: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page,
		);

		return {
			checkIns,
		};
	}
}
