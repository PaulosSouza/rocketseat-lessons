import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CommentPresenter } from "../presenters/comment-presenter";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(private readonly fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("answerId") answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments.map(CommentWithAuthorPresenter.toHTTP);

    return { comments };
  }
}
