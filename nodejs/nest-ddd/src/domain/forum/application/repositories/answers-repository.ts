import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  save(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>;
  findById(id: string): Promise<Answer | null>;
}