"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AgentExample {
  label: string;
  icon: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
}

interface AgentWorkspaceProps {
  children: ReactNode;
  agentTitle?: string;
  agentDescription?: string;
  inputPlaceholder?: string;
  examples?: AgentExample[];
  agentInsights?: ReactNode;
  onInputSubmit?: (value: string) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  isGenerating?: boolean;
  variant?: "dark" | "light";
  scrollable?: boolean;
}

export default function AgentWorkspace({
  children,
  agentTitle = "AI 助手",
  agentDescription = "我是你的 AI 助手，你可以问我任何问题。",
  inputPlaceholder = "输入指令...",
  examples = [],
  agentInsights,
  onInputSubmit,
  inputValue,
  onInputChange,
  isGenerating = false,
  variant = "light",
  scrollable = true,
}: AgentWorkspaceProps) {
  const [internalInput, setInternalInput] = useState("");
  const currentInput = inputValue !== undefined ? inputValue : internalInput;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevIsGenerating = useRef(isGenerating);

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
        { id: Math.random().toString(), role: "agent", content: "表单内容已更新完毕，请在右侧预览区查看。您可以继续提出修改建议。" }
      ]);
    }
    prevIsGenerating.current = isGenerating;
  }, [isGenerating]);

  const handleSend = () => {
    if (!currentInput.trim() || isGenerating) return;
    
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), role: "user", content: currentInput }
    ]);
    
    onInputSubmit?.(currentInput);
    if (inputValue === undefined) setInternalInput("");
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
    <div className="flex h-full w-full flex-1 overflow-hidden bg-slate-50">
      {/* 左侧 Agent 空间 (Prompt Area) */}
      <aside className={cn(
        "relative flex w-[380px] shrink-0 flex-col border-r transition-all duration-500",
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
              <span className="font-black text-brand-blue text-[11px] uppercase tracking-wider">{agentTitle}</span>
            </div>
            {agentDescription}

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
                  🚀 快速跳转 / Quick Start
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {examples.map((ex, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (onInputChange) onInputChange(ex.label);
                        else setInternalInput(ex.label);
                      }}
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
          {isGenerating && (
            <div className={cn(
              "p-4 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed shadow-sm max-w-[85%] self-start flex items-center gap-3",
              isDark 
                ? "bg-white/5 text-slate-200 border border-white/5" 
                : "bg-brand-blue/5 text-slate-700 border border-brand-blue/10"
            )}>
              <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
              <span className="font-bold opacity-80">正在为您构建场景...</span>
            </div>
          )}
        </div>

        {/* Agent Input Box */}
        <div className={cn(
          "p-5 border-t",
          isDark ? "bg-slate-900/60 border-white/5" : "bg-slate-50/50 border-slate-100"
        )}>
          <div className={cn(
            "relative rounded-2xl p-3 transition-all",
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
              placeholder={inputPlaceholder}
              className={cn(
                "w-full h-[54px] resize-none bg-transparent border-none outline-none text-[13px] font-medium leading-relaxed px-1",
                isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
              )}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isGenerating || !currentInput.trim()}
              className="absolute right-3 bottom-3 h-8 w-8 rounded-lg bg-brand-blue shadow-md shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
              ) : (
                <Icon name="RiSendPlaneFill" className="h-3.5 w-3.5 text-white" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* 右侧工作区 (Canvas) */}
      <main className={cn(
        "bg-white",
        scrollable ? "flex-1 overflow-y-auto scrollbar-none" : "flex-1 flex flex-col min-h-0 overflow-hidden"
      )}>
        {scrollable ? (
          <div className="h-full w-full overflow-y-auto">
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
