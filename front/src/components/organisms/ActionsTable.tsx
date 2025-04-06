import React from "react";
import { AnalysisSummaryType, SuggestedAction } from "../../types/feedback";
import SuggestedActions from "../molecules/SuggestedActions";

interface IProps {
	analysisSummaries: AnalysisSummaryType[];
}

export const ActionsTable = ({ analysisSummaries }: IProps) => {
    return <SuggestedActions actions={} />
}

const generateAction = (analysisSummaries: AnalysisSummaryType[]): SuggestedAction[] => {

}