import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-amber-50 border-2 border-amber-300 rounded-3xl text-center space-y-4 shadow-sm max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-300">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-amber-950">
            {this.props.fallbackTitle || "حدث تنبيه أثناء عرض هذا القسم"}
          </h3>
          <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
            تم تفادي توقف التطبيق بنجاح. يمكنك الضغط على زر إعادة المحاولة لمتابعة التصفح بشكل سليم.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة وتحديث العرض</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
