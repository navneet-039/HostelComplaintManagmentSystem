import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import pLimit from "p-limit";

import Notice from "../models/Notice.js";
import Complaint from "../models/Complaint.js";
import Hostel from "../models/Hostel.js";
import User from "../models/User.js";
import sendMail from "../utils/resend.js";
import { sqs } from "../utils/sqs.js";

import { hostelNoticeEmailTemplate } from "../mailTemplates/noticeMailTemplate.js";
import { complaintTemplate } from "../mailTemplates/complaintTemplate.js";
import { registerStudentTemplate } from "../mailTemplates/registrationTemplate.js";

const QUEUE_URL = process.env.EMAIL_SQS_QUEUE_URL;

// ================= WORKER =================
export const startEmailWorker = async () => {
  console.log("Email Worker started");

  while (true) {
    try {
      const res = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: QUEUE_URL,
          MaxNumberOfMessages: 5,
          WaitTimeSeconds: 20,
        }),
      );

      if (!res.Messages?.length) continue;

      for (const msg of res.Messages) {
        const { type, payload } = JSON.parse(msg.Body);

        try {
          switch (type) {
            // ================= NOTICE =================
            case "NOTICE": {
              await handleNotice(payload);
              break;
            }

            // ================= COMPLAINT =================
            case "COMPLAINT": {
              await handleComplaint(payload);
              break;
            }

            // ========== STUDENT REGISTRATION ==========
            case "STUDENT_REGISTRATION": {
              await handleRegistration(payload);
              break;
            }

            default:
              console.log("Unknown type:", type);
          }

          // delete only after success
          await sqs.send(
            new DeleteMessageCommand({
              QueueUrl: QUEUE_URL,
              ReceiptHandle: msg.ReceiptHandle,
            }),
          );
        } catch (err) {
          console.error(`Handler error (${type}):`, err);
        }
      }
    } catch (err) {
      console.error("Worker loop error:", err);
    }
  }
};

// ================= HANDLERS =================


const handleNotice = async (payload) => {
  const notice = await Notice.findById(payload.noticeId);

  const hostel = await Hostel.findById(payload.hostelId).populate(
    "students supervisor",
  );

  if (!notice || !hostel) {
    throw new Error("Invalid NOTICE payload");
  }

  const html = hostelNoticeEmailTemplate({
    title: notice.title,
    description: notice.description,
    hostelName: hostel.name,
    publishedByName: hostel.supervisor.name,
    createdAt: notice.createdAt,
    expiryDate: notice.expiryDate,
  });

  const subject = "New Hostel Notice";
  const batchSize = 25;

  const start = Date.now();

  let total = 0;
  let success = 0;
  let failed = 0;

  for (let i = 0; i < hostel.students.length; i += batchSize) {
    const batch = hostel.students.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map((student) => sendMail(student.email, subject, html)),
    );

    total += results.length;

    results.forEach((r) => {
      if (r.status === "fulfilled") success++;
      else failed++;
    });
  }

  const end = Date.now();

  const successRate = (success / total) * 100;

  console.log("========== NOTICE EMAIL REPORT ==========");
  console.log(`Total Emails : ${total}`);
  console.log(`Success      : ${success}`);
  console.log(`Failed       : ${failed}`);
  console.log(`Success Rate : ${successRate.toFixed(2)}%`);
  console.log(`Time Taken   : ${((end - start) / 1000).toFixed(2)} sec`);
  console.log("=========================================");
  if (successRate < 90) {
    throw new Error(`Email success rate is only ${successRate.toFixed(2)}%`);
  }
};

// COMPLAINT EMAIL
const handleComplaint = async (payload) => {
  const complaint = await Complaint.findById(payload.complaintId).populate({
    path: "hostel",
    populate: { path: "supervisor" },
  });

  if (!complaint) {
    console.log("Invalid COMPLAINT payload");
    return;
  }

  const html = complaintTemplate(
    complaint.title,
    complaint.description,
    complaint.student?.name,
    complaint.student?.email,
  );

  await sendMail(
    complaint.hostel.supervisor.email,
    "New Hostel Complaint",
    html,
  );
};

// STUDENT REGISTRATION
const handleRegistration = async (payload) => {
  const html = registerStudentTemplate(
    payload.email,
    payload.password,
    payload.registrationNumber,
    payload.supervisorName,
    payload.roomNumber,
    payload.resetLink,
    payload.floor,
  );

  await sendMail(payload.email, "Student Registration Successful", html);
};
