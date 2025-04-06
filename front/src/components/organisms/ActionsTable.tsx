import React from "react";
import { TrendSuggestionsType } from "../../types/feedback";
import SuggestedActions from "../molecules/SuggestedActions";

interface IProps {
	trendSuggestions: TrendSuggestionsType;
}

export const ActionsTable = ({ trendSuggestions }: IProps) => {
    return (
        <div>
            <p className="pl-2 text-lg stone-400">trend</p>
            <p className="pt-4 pb-8 pl-2 text-xl">{ trendSuggestions.trend }</p>
            <SuggestedActions actions={ trendSuggestions.suggestions } />
        </div>
    )
}