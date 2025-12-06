import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 min-h-screen flex flex-col items-center justify-center text-red-900">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full overflow-auto">
                        <h2 className="font-bold text-lg mb-2 text-red-700">Error:</h2>
                        <pre className="bg-red-100 p-4 rounded text-sm mb-4 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </pre>
                        <h2 className="font-bold text-lg mb-2 text-red-700">Component Stack:</h2>
                        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
