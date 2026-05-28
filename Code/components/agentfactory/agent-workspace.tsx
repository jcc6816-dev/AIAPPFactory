"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  normalizePageAgentResponse,
  type PageAgentResponseInput,
} from "@/lib/page-agent-response";

interface AgentExample {
  label: string;
  icon: string;
  response?: PageAgentResponseInput;
  agentResult?: AgentEndpointResult;
}

interface StaticAgentResponse {
  keywords: string[];
  response: PageAgentResponseInput;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
}

type AgentEndpointResult = Record<string, any>;

interface AgentWorkspaceProps {
  children: ReactNode;
  agentTitle?: string;
  agentDescription?: string;
  inputPlaceholder?: string;
  examples?: AgentExample[];
  agentInsights?: ReactNode;
  staticResponses?: StaticAgentResponse[];
  defaultResponse?: string;
  agentEndpoint?: string;
  agentPayload?: Record<string, unknown>;
  inputHint?: string;
  onInputSubmit?: (
    value: string
  ) => void | PageAgentResponseInput | Promise<PageAgentResponseInput | void>;
  onAgentResult?: (result: AgentEndpointResult) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  isGenerating?: boolean;
  variant?: "dark" | "light";
  scrollable?: boolean;
}

import { useLocale } from "next-intl";

export default function AgentWorkspace({
  children,
  agentTitle,
  agentDescription,
  inputPlaceholder,
  examples = [],
  agentInsights,
  staticResponses = [],
  defaultResponse,
  agentEndpoint,
  agentPayload,
  inputHint,
  onInputSubmit,
  onAgentResult,
  inputValue,
  onInputChange,
  isGenerating = false,
  variant = "light",
  scrollable = true,
}: AgentWorkspaceProps) {
  const locale = useLocale();
  const isZh = locale.toLowerCase().startsWith("zh");

  const displayAgentTitle = agentTitle ?? (isZh ? "AI 助手" : "AI Assistant");
  const displayAgentDescription = agentDescription ?? (isZh ? "我是你的 AI 助手，你可以问我任何问题。" : "I am your AI assistant, feel free to ask me anything.");
  const displayInputPlaceholder = inputPlaceholder ?? (isZh ? "输入指令..." : "Type instructions...");
  const displayInputHint = inputHint ?? (isZh ? "按 Enter 发送，Shift + Enter 换行" : "Press Enter to send, Shift + Enter for new line");

  const [internalInput, setInternalInput] = useState("");
  const currentInput = inputValue !== undefined ? inputValue : internalInput;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevIsGenerating = useRef(isGenerating);
  const isBusy = isGenerating || isAgentLoading;

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Handle generation completion
  useEffect(() => {
    if (prevIsGenerating.current && !isGenerating) {
      setMessages((prev) => [
        ...prev,
        { 
          id: Math.random().toString(), 
          role: "agent", 
          content: isZh 
            ? "表单内容已更新完毕，请在右侧预览区查看。您可以继续提出修改建议。" 
            : "The form has been updated. Please check the preview on the right. You can continue to suggest changes." 
        }
      ]);
    }
    prevIsGenerating.current = isGenerating;
  }, [isGenerating, isZh]);

  function resolveStaticResponse(value: string) {
    const normalized = value.toLowerCase();
    return staticResponses.find((item) =>
      item.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
    )?.response;
  }

  const appendAgentResponse = (content?: PageAgentResponseInput) => {
    if (!content) {
      return;
    }
    const response = normalizePageAgentResponse(content);

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        role: "agent",
        content: response.answer,
      },
    ]);
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isBusy) return;
    const submittedInput = currentInput.trim();
    
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), role: "user", content: submittedInput }
    ]);
    if (inputValue === undefined) setInternalInput("");
    
    try {
      const handlerResult = await onInputSubmit?.(submittedInput);
      if (typeof handlerResult === "string") {
        appendAgentResponse(handlerResult);
      } else if (agentEndpoint) {
        setIsAgentLoading(true);
        const response = await fetch(agentEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: submittedInput, ...(agentPayload || {}) }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "agent request failed");
        }
        if (result.code !== 0) {
          throw new Error(result.message || "agent request failed");
        }
        appendAgentResponse(
          result.data?.agent_response || result.data?.answer || defaultResponse
        );
        onAgentResult?.(result.data);
      } else {
        appendAgentResponse(resolveStaticResponse(submittedInput) || defaultResponse);
      }
    } catch (error: any) {
      appendAgentResponse(error.message || (isZh ? "Agent 暂时无法处理这个请求，请稍后再试。" : "The Agent is temporarily unable to process this request. Please try again later."));
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleExampleClick = (example: AgentExample) => {
    const response = example.response;
    if (response) {
      const normalizedResponse = normalizePageAgentResponse(response);
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), role: "user", content: example.label },
        {
          id: Math.random().toString(),
          role: "agent",
          content: normalizedResponse.answer,
        },
      ]);
      if (example.agentResult) {
        onAgentResult?.(example.agentResult);
      }
      return;
    }

    if (onInputChange) onInputChange(example.label);
    else setInternalInput(example.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 强制根据 variant 判断，确保不会因为默认值导致黑色
  const isDark = variant === "dark";

  return (
    <div className="flex h-full w-full flex-1 overflow-hidden bg-slate-50 print:h-auto print:overflow-visible print:bg-white">
      {/* 左侧 Agent 空间 (Prompt Area) */}
      <aside className={cn(
        "relative flex w-[380px] shrink-0 flex-col border-r transition-all duration-500 print:hidden",
        isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
      )}>
        {/* Agent Output */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-none">
          {/* AI Bubble */}
          <div className={cn(
            "p-5 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed shadow-sm",
            isDark 
              ? "bg-white/5 text-slate-200 border border-white/5" 
              : "bg-brand-blue/5 text-slate-700 border border-brand-blue/10"
          )}>
            <div className="mb-3 flex items-center gap-2">
              <Icon name="RiRobot2Line" className="h-4 w-4 text-brand-blue" />
              <span className="font-black text-brand-blue text-[11px] uppercase tracking-wider">{displayAgentTitle}</span>
            </div>
            {displayAgentDescription}

            {agentInsights && (
              <div className="mt-5">
                {agentInsights}
              </div>
            )}
            
            {examples.length > 0 && (
              <div className="mt-5">
                <span className={cn(
                  "block mb-2.5 text-[10px] font-black uppercase tracking-widest",
                  isDark ? "text-white/30" : "text-brand-blue/50"
                )}>
                  {isZh ? "🚀 快捷任务 / 可直接点击" : "🚀 Quick Tasks / Click to select"}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {examples.map((ex, i) => (
                    <div
                      key={i}
                      onClick={() => handleExampleClick(ex)}
                      className={cn(
                        "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                        isDark 
                          ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-blue/40" 
                          : "bg-white border border-slate-200 hover:border-brand-blue/40 hover:shadow-sm"
                      )}
                    >
                      <Icon name={ex.icon} className="h-3.5 w-3.5 text-brand-blue transition-transform group-hover:scale-110" />
                      <span className={cn("text-xs font-bold", isDark ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-brand-blue")}>{ex.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 对话历史记录 */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm max-w-[85%]",
                msg.role === "user"
                  ? "bg-brand-blue text-white rounded-br-sm self-end"
                  : cn(
                      "whitespace-pre-line",
                      isDark
                        ? "bg-white/5 text-slate-200 border border-white/5 rounded-bl-sm self-start"
                        : "bg-brand-blue/5 text-slate-700 border border-brand-blue/10 rounded-bl-sm self-start"
                    )
              )}
            >
              {msg.role === "agent" && (
                <div className="mb-2 flex items-center gap-2">
                  <Icon name="RiRobot2Line" className="h-4 w-4 text-brand-blue" />
                </div>
              )}
              {msg.content}
            </div>
          ))}

          {/* 生成中状态 */}
          {isBusy && (
            <div className={cn(
              "p-4 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed shadow-sm max-w-[85%] self-start flex items-center gap-3",
              isDark 
                ? "bg-white/5 text-slate-200 border border-white/5" 
                : "bg-brand-blue/5 text-slate-700 border border-brand-blue/10"
            )}>
              <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
              <span className="font-bold opacity-80">
                {isGenerating 
                  ? (isZh ? "正在为您构建场景..." : "Building your scene...") 
                  : (isZh ? "正在分析当前页面上下文..." : "Analyzing page context...")}
              </span>
            </div>
          )}
        </div>

        {/* Agent Input Box */}
        <div className={cn(
          "p-5 border-t",
          isDark ? "bg-slate-900/60 border-white/5" : "bg-slate-50/50 border-slate-100"
        )}>
          <div className={cn(
            "rounded-2xl p-3 transition-all",
            isDark 
              ? "bg-white/5 border border-white/10 focus-within:bg-white/10" 
              : "bg-white border border-slate-200 shadow-sm focus-within:border-brand-blue/30 focus-within:ring-4 focus-within:ring-brand-blue/5"
          )}>
            <textarea
              id="agentInput"
              value={currentInput}
              onChange={(e) => {
                if (onInputChange) onInputChange(e.target.value);
                else setInternalInput(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              disabled={isBusy}
              placeholder={displayInputPlaceholder}
              className={cn(
                "w-full h-[54px] resize-none bg-transparent border-none outline-none text-[13px] font-medium leading-relaxed px-1",
                isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
              )}
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className={cn(
                "px-1 text-[10px] font-semibold leading-4",
                isDark ? "text-slate-500" : "text-slate-400"
              )}>
                {displayInputHint}
              </div>
              <Button
                title={isZh ? "发送给 Agent" : "Send to Agent"}
                onClick={handleSend}
                disabled={isBusy || !currentInput.trim()}
                className="h-8 shrink-0 rounded-lg bg-brand-blue px-3 text-xs font-black text-white shadow-md shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isBusy ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-white" />
                ) : (
                  <Icon name="RiSendPlaneFill" className="mr-1.5 h-3.5 w-3.5 text-white" />
                )}
                {isZh ? "发送" : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* 右侧工作区 (Canvas) */}
      <main className={cn(
        "bg-white text-slate-900 print:bg-white print:w-full print:h-auto print:overflow-visible print:p-0 print:m-0",
        scrollable ? "flex-1 overflow-y-auto scrollbar-none print:overflow-visible" : "flex-1 flex flex-col min-h-0 overflow-hidden print:overflow-visible"
      )}>
        {scrollable ? (
          <div className="h-full w-full overflow-y-auto print:h-auto print:overflow-visible">
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
