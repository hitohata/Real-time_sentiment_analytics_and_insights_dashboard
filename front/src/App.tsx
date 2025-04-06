import React from "react";
import { Toaster } from "./components/atoms/toaster";
import { Toaster as Sonner } from "./components/atoms/sonner";
import { TooltipProvider } from "./components/atoms/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			{/*<Toaster />*/}
			{/*<Sonner />*/}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
