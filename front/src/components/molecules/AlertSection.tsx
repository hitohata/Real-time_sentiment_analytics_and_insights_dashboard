import { X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import { Button } from "@/components/atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/card";

interface IProps {
    alerts: string[],
    onAlertDelete: (index: number) => void;
}

/**
 * If there are no alerts, this component will not render.
 * @param alerts
 * @param initialAlerts
 * @constructor
 */
export default function AlertDashboard({ alerts, onAlertDelete }: IProps) {

    if (alerts.length === 0) return <></>

    return (
        <div className="w-full mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Dashboard Alerts</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {alerts.length === 0 ? (
                        <div className="text-center p-8 border rounded-lg bg-muted/50">
                            <p className="text-muted-foreground">No active alerts</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map((alert, index) => (
                                <Alert key={index} className="flex items-center justify-between pr-2 bg-red-100 border-red-200">
                                    <AlertDescription className="flex-1">{alert}</AlertDescription>
                                    <Button variant="ghost" size="icon" onClick={() => onAlertDelete(index)} aria-label="Dismiss alert">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </Alert>
                            ))}
                        </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                        {alerts.length > 0 ? `${alerts.length} active alert${alerts.length > 1 ? "s" : ""}` : ""}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

