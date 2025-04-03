# **Take-Home Project: Real-Time Sentiment Analytics & Insights Dashboard**

**Role**: Full Stack Engineer – Real-Time AI & Data Pipelines  
**Estimated Time**: \~10 hours (completed over two evenings)  
**Submission Format**: GitHub repository link

---

## **Key Deliverables**

You will submit a GitHub repository containing:

* A working front-end dashboard (React or similar) for visualizing real-time customer sentiment data

* A backend (preferably on AWS) that:

    * Simulates and stores customer feedback from multiple sources

    * Analyzes sentiment using a model or API

    * Generates insights and suggestions based on recent sentiment trends

    * Sends email alerts when sentiment spikes negatively (can also be a notification on the dashboard)

* A data ingestion pipeline that mimics real-time input

* A functioning email notification system

* A section of the dashboard displaying top 3 generated suggestions

* A README file with:

    * Setup instructions

    * Architecture overview

    * Summary of test cases and results

* (Optional) A 3–5 minute Loom or video walkthrough

---

## **Project Overview**

You're building a real-time sentiment analytics dashboard for internal teams (Customer Experience, Marketing) to monitor feedback across channels such as app reviews, web forms, and support tickets. In addition to visualizing trends, the tool also recommends actionable next steps when sentiment drops—such as adjusting Google Ads copy or improving onboarding messaging.

The dashboard helps stakeholders answer:

* "How are customers feeling right now?"

* "What can we do about it based on similar past issues?"

---

## **Requirements**

### **Frontend**

The dashboard should include:

* A **time-series chart** showing feedback volume by sentiment (positive, neutral, negative) over time

* A **bar or pie chart** showing sentiment breakdown by source (App, Web, Email)

* A **table** displaying individual feedback items with:

    * Timestamp

    * Source

    * Sentiment label

    * Sentiment score

    * Raw feedback text

* Filters for:

    * Time range

    * Source

* A **“Top 3 Suggested Actions”** section showing automatically generated recommendations based on the most recent 50–100 feedback entries

* Auto-refresh every 10 seconds

Framework: React is preferred, but any modern frontend stack is acceptable.

---

### **Backend**

#### **1\. Feedback Ingestion Simulator**

Simulate real-time customer feedback using:

* A script or AWS Lambda function that generates new feedback entries every few seconds

* Each entry should include:

    * Timestamp

    * Feedback source (App, Web, Email)

    * Random user ID

    * Realistic feedback text (you may use hardcoded examples or the OpenAI API to generate variety)

Store feedback in DynamoDB, Timestream, or RDS.

#### **2\. Sentiment Analysis Pipeline**

* Analyze each feedback item using:

    * OpenAI API (e.g., `gpt-3.5-turbo`)

    * A Hugging Face model (e.g., `distilbert-base-uncased-finetuned-sst-2-english`)

    * Or a rules-based fallback

* Store the sentiment label (positive/neutral/negative) and a numeric sentiment score

#### **3\. Suggestions Engine (Required)**

Add logic that monitors sentiment trends and generates **3 actionable suggestions** based on:

* Recent feedback trends (e.g., spike in negative feedback mentioning pricing or delivery)

* A small predefined dataset of **common resolution strategies** (this can be hardcoded JSON or a table)

* Optional: Use an LLM (e.g., OpenAI) to summarize the last 50–100 feedback entries and generate helpful suggestions tailored to a marketing or product team (e.g., suggestions for improving messaging, UX, or ads)

Suggestions must be displayed in the dashboard.

#### **4\. Email Alerts/Notifications on Dashboard**

* If **more than 5 negative feedback items** are received in any **rolling 5-minute window**, trigger an email/notification alert using AWS SES or a similar service

* The email/notification should contain a timestamp, number of negative entries, and links (or text) with the most recent examples

#### **5\. API Layer**

Expose backend endpoints via REST or GraphQL using API Gateway. Endpoints should support:

* Fetching feedback

* Fetching analytics summaries

* Fetching top suggestions

---

## **Test Cases**

Please test and document the following:

| Scenario | Expected Outcome |
| ----- | ----- |
| Dashboard loads | Initial data is fetched and displayed |
| New feedback entry generated | Appears in dashboard within 10 seconds |
| Filtering by source (e.g., "Web") | Only Web feedback is shown |
| 6+ negative feedback entries in 5 minutes | Email alert is sent |
| Suggestions are generated | Dashboard shows 3 relevant actions |
| Adjusting date filter | Charts and table update accordingly |
| API call to fetch analytics | Charts and table update accordingly |

Document results in your README.

---

## **Technical Guidelines**

* Use TypeScript wherever possible

* Use AWS services for backend infrastructure: Lambda, DynamoDB, SES, API Gateway, etc.

* Backend should be deployable using SAM, CDK, or the Serverless Framework

* Code should be modular, well-organized, and easy to read

* You may use external libraries for visualization (e.g., Chart.js, Recharts)

---

## **Submission Instructions**

Submit a **public GitHub repository** containing:

* All frontend and backend code

* `README.md` with:

    * Setup instructions

    * Deployment steps

    * Explanation of architecture and tech decisions

    * Summary of test results

* (Optional) 3–5 min Loom or video walkthrough

---

## **Evaluation Criteria**

* Code quality and organization

* Sound architecture and modularity

* Thoughtful use of AWS services

* Clean and functional frontend experience

* Smart, relevant suggestions based on sentiment data

* Realistic and well-handled data ingestion pipeline

* Attention to detail in alert logic and edge cases

* Documentation and ease of setup

* Intelligent use of tools like ChatGPT or Copilot to assist problem-solving
