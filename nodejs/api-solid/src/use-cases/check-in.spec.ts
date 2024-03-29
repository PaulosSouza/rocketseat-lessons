import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-numbers-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "Javascript Gym",
			description: "",
			phone: "",
			latitude: 0,
			longitude: 0,
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should be able to check in twice but in differente days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in distant gym", async () => {
		await gymsRepository.create({
			id: "gym-02",
			title: "Javascript Gym",
			description: "",
			phone: "",
			latitude: new Decimal(-18.8098115),
			longitude: new Decimal(-41.7253492),
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -18.8484347,
				userLongitude: -41.9494066,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
