import { AIAnalysisImplementation } from "src/shared/ai/aiAnalysis";

const dummyFeedbacks: string[] = [
  "Great service, very satisfied!",
  "The product quality is poor.",
  "Delivery time was acceptable.",
  "Customer support was very helpful.",
  "An average experience.",
  "The interface is confusing.",
  "Fantastic value for money.",
  "The team was unresponsive.",
  "Met my expectations.",
  "The product works perfectly.",
  "Very disappointed with the service.",
  "Excellent product quality!",
  "Fast delivery, highly recommend!",
  "Customer support was unhelpful.",
  "Terrible experience, won't buy again.",
  "The interface is alright.",
  "Fair value for money.",
  "The team was moderately responsive.",
  "Satisfied with my purchase.",
  "The app is functional.",
  "Great service, very satisfied!",
  "The product quality is poor.",
  "Delivery time was acceptable.",
  "Customer support was very helpful.",
  "An average experience.",
  "The interface is confusing.",
  "Fantastic value for money.",
  "The team was unresponsive.",
  "Met my expectations.",
  "The product works perfectly.",
  "Very disappointed with the service.",
  "Excellent product quality!",
  "Fast delivery, highly recommend!",
  "Customer support was unhelpful.",
  "Terrible experience, won't buy again.",
  "The interface is alright.",
  "Fair value for money.",
  "The team was moderately responsive.",
  "Satisfied with my purchase.",
  "The app is functional.",
  "Great service, very satisfied!",
  "The product quality is poor.",
  "Delivery time was acceptable.",
  "Customer support was very helpful.",
  "An average experience.",
  "The interface is confusing.",
  "Fantastic value for money.",
  "The team was unresponsive.",
  "Met my expectations.",
  "The product works perfectly.",
  "Very disappointed with the service.",
  "Excellent product quality!",
  "Fast delivery, highly recommend!",
  "Customer support was unhelpful.",
  "Terrible experience, won't buy again.",
  "The interface is alright.",
  "Fair value for money.",
  "The team was moderately responsive.",
  "Satisfied with my purchase.",
  "The app is functional.",
  "Great service, very satisfied!",
  "The product quality is poor.",
  "Delivery time was acceptable.",
  "Customer support was very helpful.",
  "An average experience.",
  "The interface is confusing.",
  "Fantastic value for money.",
  "The team was unresponsive.",
  "Met my expectations.",
  "The product works perfectly.",
  "Very disappointed with the service.",
  "Excellent product quality!",
  "Fast delivery, highly recommend!",
  "Customer support was unhelpful.",
  "Terrible experience, won't buy again.",
  "The interface is alright.",
  "Fair value for money.",
  "The team was moderately responsive.",
  "Satisfied with my purchase.",
  "The app is functional.",
  "Great service, very satisfied!",
  "The product quality is poor.",
  "Delivery time was acceptable.",
  "Customer support was very helpful.",
  "An average experience.",
  "The interface is confusing.",
  "Fantastic value for money.",
  "The team was unresponsive.",
  "Met my expectations.",
  "The product works perfectly.",
  "Very disappointed with the service.",
  "Excellent product quality!",
  "Fast delivery, highly recommend!",
  "Customer support was unhelpful.",
  "Terrible experience, won't buy again.",
  "The interface is alright.",
  "Fair value for money.",
  "The team was moderately responsive.",
  "Satisfied with my purchase.",
  "The app is functional."
];

console.log("Starting trend analysis...");
console.time("statement-trend-analysis");

const client = AIAnalysisImplementation.mock();
const result = client.feedbackTrendAnalysis(dummyFeedbacks);

result.then((res) => {
  console.log(res);
  console.log("Statement trend analysis completed.");
  console.timeEnd("statement-trend-analysis");
}).catch((err) => {
  console.error(err);
});
