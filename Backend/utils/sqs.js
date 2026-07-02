
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});


export const pushEmailJob = async (data) => {
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.EMAIL_SQS_QUEUE_URL,
      MessageBody: JSON.stringify(data),
    })
  );
};


