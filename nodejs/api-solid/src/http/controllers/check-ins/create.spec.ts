import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, test } from "vitest";

describe("Create Check-in (e2e)", async () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a check-in", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const gym = await prisma.gym.create({
			data: {
				title: "Javascript Gym",
				latitude: -18.8484347,
				longitude: -41.9494066,
			},
		});

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: -18.8484347,
				longitude: -41.9494066,
			});

		expect(response.statusCode).toEqual(201);
	});
});
