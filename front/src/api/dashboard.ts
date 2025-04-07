import {getAnalysisSummaries, getSuggestions} from "./dashboardGen";
import {err, ok, Result} from "result-ts-type";
import {AnalysisSummaryType, TrendSuggestionsType} from "../types/feedback";

/**
 * call the feedback API to get the feedback summaries
 * @param from
 * @param to
 */
export const getFeedbackSummaries = async (from?: Date, to?: Date): Promise<Result<AnalysisSummaryType[], string>> => {
	const analysisSummaries = await getAnalysisSummaries({
        from: from?.toISOString(),
        to: to?.toISOString(),
    })

    const {status, data} = analysisSummaries;

    if (status !== 200) {
        return err("Failed to get feedback summaries");
	}

    return ok(data.summaries.map(summary => ({
        ...summary,
        sentimentLabel: summary.sentimentLabel as "positive" | "negative" | "neutral",
        feedbackSource: summary.feedbackSource as "app" | "web" | "email",
    })))
}

export const getFeedbackTrend = async (from?: Date, to?: Date): Promise<Result<TrendSuggestionsType, string>> => {
    const suggestions = await getSuggestions({
        from: from?.toISOString(),
        to: to?.toISOString(),
    })

    const {status, data} = suggestions;

    if (status !== 200) {
        return err("Failed to get feedback trend");
    }

    return ok(data)
}
