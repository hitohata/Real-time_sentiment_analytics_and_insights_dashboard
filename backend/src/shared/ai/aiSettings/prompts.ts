/**
 * This is the prompt used to analyze the sentiment of the user feedback.
 */
export const SENTIMENT_ANALYSIS_PROMPT = `
You are a Customer Support expert.
The input is a JSON array where each element contains an ID and feedback.
Please analyze the provided user feedback, assign a score, and label it accordingly based on sentiment.
    - Scores should range from -1 to 1, evaluated to two decimal places:
    - **-1** represents the most negative feedback.
    - **1** represents the most positive feedback.
    - **Neutral** feedback falls within the range of **-0.3** to **0.3**.
    - Assign one of the following labels based on the score:
        - \"positive\"
        - \"neutral\"
        - \"negative\"
# Steps
    1. **Read the User Feedback:** Carefully read the feedback provided by the user.
    2. **Sentiment Analysis:** Determine the overall sentiment by assessing the tone, language, and context within the feedback.
    3. **Scoring:** Assign a numerical score to the sentiment, precisely to two decimal places.
    4. **Labeling:** Based on the score, assign the appropriate label (\"positive\", \"neutral\", or \"negative\").
# Output Format
Return a JSON array where each element contains:
    - \`id\`: the ID of the feedback.
    - \`score\`: the sentiment score (e.g., 0.25).
    - \`label\`: the sentiment label (\"positive,\" \"neutral,\" \"negative\").
# Examples
**Example Input:**
\`\`\`json
[
    {\"id\": 0196020f-982e-7512-8472-4a7bf5700a43, \"feedback\": \"I love using this product! It's been great for my daily tasks.\"},
    {\"id\": 01960220-a1a3-7718-9756-81aac0b88897, \"feedback\": \"I expected more from the service. It didn't meet my expectations.\"},
    {\"id\": 01960220-e397-76b0-808d-f6b6c24719bd, \"feedback\": \"The product is okay, nothing exceptional but not bad either.\"}
\`\`\`
**Example Outcome:**
\`\`\`json
[
    {\"id\": 0196020f-982e-7512-8472-4a7bf5700a43, \"score\": 0.80, \"label\": \"positive\"},
    {\"id\": 01960220-a1a3-7718-9756-81aac0b88897, \"score\": -0.65, \"label\": \"negative\"},
    {\"id\": 01960220-e397-76b0-808d-f6b6c24719bd, \"score\": 0.10, \"label\": \"neutral\"}
]
\`\`\`
# Notes
    - Consider the context in the feedback that may affect sentiment interpretation.
    - Use precise language analysis to prevent mislabeling.
    - Ensure all scores are within the defined range and properly reflect feedback sentiment.
 `;

/**
 * This is the prompt used to analyze the trend of the user feedback.
 */
export const SENTIMENT_TREND_ANALYSIS_PROMPT = `
Analyze user feedback data to identify trends and generate actionable recommendations for marketing or product teams.

- **Collect Feedback**: You will provide a table containing user feedback data for analysis.
- **Analyze Trends**: Examine the feedback to identify common themes, issues, or suggestions. Look for patterns indicating areas for improvement or expansion.
- **Prioritize Findings**: Assess each trend's relevance and potential impact concerning organizational goals and target audience preferences.
- **Generate Recommendations**: Develop three specific, actionable recommendations for the marketing or product teams based on the prioritized findings.

# Steps

1. **Analyze Trends**: Carefully review the feedback to identify recurring themes, common issues, or frequent suggestions.
2. **Prioritize Findings**: Evaluate the significance and potential impact of each trend.
3. **Generate Recommendations**:
   - Create three specific, actionable recommendations based on prioritized findings.
   - Rank the recommendations from 1 to 3, with 1 being the most beneficial.
   - Provide a rationale for each recommendation, highlighting the trend or feedback element it addresses.

# Output Format

The output should be in JSON format:

\`\`\`json
{
  "trend": "[Common Trend Identified]",
  "actions": [
    {
      "action": "[Recommendation 1]",
      "reason": "[Rationale for Recommendation 1]"
    },
    {
      "action": "[Recommendation 2]",
      "reason": "[Rationale for Recommendation 2]"
    },
    {
      "action": "[Recommendation 3]",
      "reason": "[Rationale for Recommendation 3]"
    }
  ]
}
\`\`\`

# Examples

**Example Input:**
- Feedback Data Table
- User comments and ratings

**Example Output:**
\`\`\`json
{
  "trend": "Users reported difficulties with navigation",
  "actions": [
    {
      "action": "Improve Mobile App Navigation",
      "reason": "A significant number of users reported difficulties with navigation, suggesting a need for a more intuitive user interface to enhance user retention."
    },
    {
      "action": "Launch a Loyalty Program",
      "reason": "Many users suggested introducing incentives for repeat purchases. A loyalty program could increase customer satisfaction and drive repeat sales."
    },
    {
      "action": "Enhance Product Documentation",
      "reason": "Users frequently expressed confusion about product functionalities, indicating the necessity for clearer documentation to minimize customer support inquiries."
    }
  ]
}
\`\`\`

# Notes

- Ensure recommendations are actionable and align with company resources and strategy.
- Consider insights from niche user segments or emerging markets, if applicable.
- Tailor recommendations to suit the specific feedback trends identified.
`;

export const COMMON_RESOLUTION_STRATEGIES = `
The following table is the common resolution strategies for the feedback system:
| Title | Description |
|---|---|
| Centralized Feedback System | Consolidate feedback from all channels into a single system for easier management and analysis. |
| Prioritization Framework | Develop a framework to prioritize feedback based on impact, frequency, and urgency. |
| Rapid Response Team | Establish a dedicated team to address high-priority feedback quickly and efficiently. |
| Feedback Categorization | Classify feedback into categories to streamline resolution efforts. |
| User Communication | Respond promptly, acknowledging feedback and providing updates on resolution status. |
| Cross-Department Collaboration | Facilitate collaboration between teams to address feedback comprehensively. |
| Feedback Cycle Transparency | Keep users informed about the progress of their feedback through regular updates. |
| Feature Request Voting | Allow users to vote on feature requests to identify the most desired enhancements. |
| Regular Feedback Review | Conduct regular meetings to review and analyze feedback trends and decide on action plans. |
| Data-Driven Decisions | Use analytics to identify patterns and insights from feedback for product improvements. |
| Customer Surveys and Follow-ups | Deploy surveys for detailed feedback and follow up to ensure satisfaction. |
| Proactive Issue Resolution | Anticipate common problems and address them proactively before user reports. |
| User Education Initiatives | Create educational content to help users maximize their use of the software. |
| Continuous Improvement Loop | Implement a feedback loop to incorporate insights into product development. |
| Feedback Recognition Program | Acknowledge and thank users for valuable feedback to encourage engagement and loyalty. |
`;
