import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const answerattachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerattachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
