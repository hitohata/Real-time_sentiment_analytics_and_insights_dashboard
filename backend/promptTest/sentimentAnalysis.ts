import { aiAnalysis } from "src/shared/ai/aiAnalysis"
import type { RowFeedback } from "src/shared/utils/sharedTypes";

const dummyFeedbacks: RowFeedback[] = [
  {
    timestamp: "2023-10-01T12:00:00Z",
    feedbackSource: "web",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440000",
    feedback: "Great service, very satisfied!",
  },
  {
    timestamp: "2023-10-02T15:30:00Z",
    feedbackSource: "email",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440001",
    feedback: "The product quality is poor.",
  },
  {
    timestamp: "2023-10-03T09:45:00Z",
    feedbackSource: "app",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440002",
    feedback: "Delivery time was acceptable.",
  },
  {
    timestamp: "2023-10-04T18:20:00Z",
    feedbackSource: "web",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440003",
    feedback: "Customer support was very helpful.",
  },
  {
    timestamp: "2023-10-05T11:10:00Z",
    feedbackSource: "email",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440004",
    feedback: "An average experience.",
  },
  {
    timestamp: "2023-10-06T14:00:00Z",
    feedbackSource: "app",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440005",
    feedback: "The interface is confusing.",
  },
  {
    timestamp: "2023-10-07T08:30:00Z",
    feedbackSource: "web",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440006",
    feedback: "Fantastic value for money.",
  },
  {
    timestamp: "2023-10-08T16:45:00Z",
    feedbackSource: "email",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440007",
    feedback: "The team was unresponsive.",
  },
  {
    timestamp: "2023-10-09T10:15:00Z",
    feedbackSource: "app",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440008",
    feedback: "Met my expectations.",
  },
  {
    timestamp: "2023-10-10T13:50:00Z",
    feedbackSource: "web",
    userIdentifier: "550e8400-e29b-41d4-a716-446655440009",
    feedback: "The product works perfectly.",
  },
];

console.log("Starting statement analysis...");
console.time("statement-analysis");

// Call the aiAnalysis function with dummy feedbacks
const result = aiAnalysis(dummyFeedbacks);

result.then((res) => {
  console.log(res);
  console.log("Statement analysis completed.");
  console.timeEnd("statement-analysis");
}).catch((err) => {
  console.error(err);
});
