import AlertSection from "@/components/molecules/AlertSection";

interface IProps {
    alerts: string[];
    onAlertDelete: (index: number) => void;
}

export const Alert = (props: IProps) => {
    return <AlertSection alerts={props.alerts} onAlertDelete={ props.onAlertDelete } />;
}