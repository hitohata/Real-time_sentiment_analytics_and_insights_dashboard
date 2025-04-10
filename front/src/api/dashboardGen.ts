/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Dashboard API
 * OpenAPI spec version: 1.0.0
 */
import { customFetch } from '../../orvalOverride';
/**
 * The source of the feedback. This can be either email, web, or app.
 */
export type PostFeedbacksBodyFeedbackSource = typeof PostFeedbacksBodyFeedbackSource[keyof typeof PostFeedbacksBodyFeedbackSource];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostFeedbacksBodyFeedbackSource = {
  email: 'email',
  web: 'web',
  app: 'app',
} as const;

export type PostFeedbacksBody = {
  /** The timestamp of the feedback. This should be in ISO 8601 format. */
  timestamp: string;
  /** The source of the feedback. This can be either email, web, or app. */
  feedbackSource: PostFeedbacksBodyFeedbackSource;
  /** The identifier of the user who provided the feedback. This can be an email address, a phone number, or a unique identifier. */
  userIdentifier: string;
  /**
   * The feedback provided by the user.
   * @minLength 1
   * @maxLength 400
   */
  feedback: string;
};

export type PostFeedbacks202 = {
  message: string;
};

export type PostFeedbacks400 = {
  message: string;
};

export type GetSuggestionsParams = {
from?: string;
to?: string;
};

export type GetSuggestions200SuggestionsItem = {
  /** The actions that we should take. */
  action: string;
  /** The impact of the suggestion. */
  reason: string;
};

export type GetSuggestions200 = {
  /** The current trend of the feedback. */
  trend: string;
  /**
   * The suggestions for the dashboard users.
   * @maxItems 3
   */
  suggestions: GetSuggestions200SuggestionsItem[];
};

export type GetSuggestions400 = {
  message: string;
};

export type GetAnalysisSummariesParams = {
from?: string;
to?: string;
};

export type GetAnalysisSummaries200SummariesItemFeedbackSource = typeof GetAnalysisSummaries200SummariesItemFeedbackSource[keyof typeof GetAnalysisSummaries200SummariesItemFeedbackSource];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAnalysisSummaries200SummariesItemFeedbackSource = {
  email: 'email',
  web: 'web',
  app: 'app',
} as const;

export type GetAnalysisSummaries200SummariesItemSentimentLabel = typeof GetAnalysisSummaries200SummariesItemSentimentLabel[keyof typeof GetAnalysisSummaries200SummariesItemSentimentLabel];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAnalysisSummaries200SummariesItemSentimentLabel = {
  positive: 'positive',
  negative: 'negative',
  neutral: 'neutral',
} as const;

export type GetAnalysisSummaries200SummariesItem = {
  timestamp: string;
  feedbackSource: GetAnalysisSummaries200SummariesItemFeedbackSource;
  /** The feedback from the user. */
  feedback: string;
  sentimentLabel: GetAnalysisSummaries200SummariesItemSentimentLabel;
  /**
   * The score of the statement. This should be between -1 and 1. The -1 means negative and 1 means positive.
   * @minimum -1
   * @maximum 1
   */
  sentimentScore: number;
};

export type GetAnalysisSummaries200 = {
  summaries: GetAnalysisSummaries200SummariesItem[];
};

export type GetAnalysisSummaries400 = {
  message: string;
};

export type postFeedbacksResponse202 = {
  data: PostFeedbacks202
  status: 202
}

export type postFeedbacksResponse400 = {
  data: PostFeedbacks400
  status: 400
}

export type postFeedbacksResponse500 = {
  data: string
  status: 500
}
    
export type postFeedbacksResponseComposite = postFeedbacksResponse202 | postFeedbacksResponse400 | postFeedbacksResponse500;
    
export type postFeedbacksResponse = postFeedbacksResponseComposite & {
  headers: Headers;
}

export const getPostFeedbacksUrl = () => {


  

  return `/feedbacks`
}

export const postFeedbacks = async (postFeedbacksBody: PostFeedbacksBody, options?: RequestInit): Promise<postFeedbacksResponse> => {
  
  return customFetch<postFeedbacksResponse>(getPostFeedbacksUrl(),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postFeedbacksBody,)
  }
);}



export type getSuggestionsResponse200 = {
  data: GetSuggestions200
  status: 200
}

export type getSuggestionsResponse400 = {
  data: GetSuggestions400
  status: 400
}

export type getSuggestionsResponse500 = {
  data: string
  status: 500
}
    
export type getSuggestionsResponseComposite = getSuggestionsResponse200 | getSuggestionsResponse400 | getSuggestionsResponse500;
    
export type getSuggestionsResponse = getSuggestionsResponseComposite & {
  headers: Headers;
}

export const getGetSuggestionsUrl = (params?: GetSuggestionsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/suggestions?${stringifiedParams}` : `/suggestions`
}

export const getSuggestions = async (params?: GetSuggestionsParams, options?: RequestInit): Promise<getSuggestionsResponse> => {
  
  return customFetch<getSuggestionsResponse>(getGetSuggestionsUrl(params),
  {      
    ...options,
    method: 'GET'
    
    
  }
);}



export type getAnalysisSummariesResponse200 = {
  data: GetAnalysisSummaries200
  status: 200
}

export type getAnalysisSummariesResponse400 = {
  data: GetAnalysisSummaries400
  status: 400
}

export type getAnalysisSummariesResponse500 = {
  data: string
  status: 500
}
    
export type getAnalysisSummariesResponseComposite = getAnalysisSummariesResponse200 | getAnalysisSummariesResponse400 | getAnalysisSummariesResponse500;
    
export type getAnalysisSummariesResponse = getAnalysisSummariesResponseComposite & {
  headers: Headers;
}

export const getGetAnalysisSummariesUrl = (params?: GetAnalysisSummariesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/analysis-summaries?${stringifiedParams}` : `/analysis-summaries`
}

export const getAnalysisSummaries = async (params?: GetAnalysisSummariesParams, options?: RequestInit): Promise<getAnalysisSummariesResponse> => {
  
  return customFetch<getAnalysisSummariesResponse>(getGetAnalysisSummariesUrl(params),
  {      
    ...options,
    method: 'GET'
    
    
  }
);}
