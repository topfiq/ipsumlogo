"use client";

import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class DynamicErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(e: Error): State {
    return { hasError: true, error: e };
  }

  componentDidCatch(e: Error) {
    console.error("[Ipsumlogo]", e);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#2c2c2c]">
          <div className="flex flex-col items-center gap-4 max-w-md text-center p-8">
            <div className="w-12 h-12 rounded-full bg-[#ef4444] flex items-center justify-center text-white text-xl font-bold">!</div>
            <h2 className="text-lg font-semibold text-[#e0e0e0]">Failed to load</h2>
            <p className="text-xs font-mono text-[#808080] break-all">{this.state.error?.message}</p>
            <button
              className="px-4 py-2 rounded bg-[#6366f1] text-white text-sm"
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            >Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
