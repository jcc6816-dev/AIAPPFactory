import { getUserEmail } from "@/services/user";
import {
  getGscSummaryMetrics,
  getGa4SummaryMetrics,
  getClaritySummaryMetrics,
  generateBriefActions,
} from "@/services/admin-growth-daily-brief";

export const runtime = "nodejs";

// ===== 鉴权中间件 =====
async function requireAdmin() {
  const email = await getUserEmail();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());

  if (!email || !adminEmails?.includes(email)) {
    throw new Error("unauthorized");
  }
}

export async function GET(req: Request) {
  try {
    // 1. 严格管理员鉴权
    try {
      await requireAdmin();
    } catch (_) {
      return Response.json({ code: 403, message: "unauthorized" }, { status: 403 });
    }

    // 2. 解析 query 参数
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "zh";
    const isZh = locale === "zh";

    let numOfDays = Number(searchParams.get("numOfDays") || "7");
    if (![7, 28].includes(numOfDays)) {
      numOfDays = 7;
    }

    // 3. 并发拉取三大源数据并做降级保障
    const [gscRes, ga4Res, clarityRes] = await Promise.all([
      getGscSummaryMetrics(numOfDays).catch((err) => ({
        status: "error" as const,
        message: err.message || "GSC fetch crashed.",
      })),
      getGa4SummaryMetrics(numOfDays).catch((err) => ({
        status: "error" as const,
        message: err.message || "GA4 fetch crashed.",
      })),
      getClaritySummaryMetrics(numOfDays).catch((err) => ({
        status: "error" as const,
        message: err.message || "Clarity fetch crashed.",
      })),
    ]);

    // 4. 生成建议项
    const recommendedActions = generateBriefActions(gscRes, ga4Res, clarityRes, isZh);

    // 5. 组装 brief 看板
    const highlights: string[] = [];
    const risks: string[] = [];

    // GSC Highlights
    if (gscRes.status === "ready" && gscRes.data) {
      const gsc = gscRes.data;
      if (gsc.summary.impressions > 0) {
        highlights.push(
          isZh
            ? `Google 搜索自然曝光达到 ${gsc.summary.impressions.toLocaleString()} 次，产生 ${gsc.summary.clicks.toLocaleString()} 次点击。`
            : `Google search impressions reached ${gsc.summary.impressions.toLocaleString()} with ${gsc.summary.clicks.toLocaleString()} clicks.`
        );
      }
    }

    // GA4 Highlights & Funnel Risks
    if (ga4Res.status === "ready" && ga4Res.data) {
      const ga4 = ga4Res.data;
      highlights.push(
        isZh
          ? `GA4 录得 ${ga4.summary.sessions.toLocaleString()} 次独立会话与 ${ga4.summary.activeUsers.toLocaleString()} 名活跃用户。`
          : `GA4 recorded ${ga4.summary.sessions.toLocaleString()} sessions and ${ga4.summary.activeUsers.toLocaleString()} active users.`
      );

      const getCount = (name: string) => {
        return ga4.funnel?.find((f: any) => f.eventName === name)?.eventCount || 0;
      };
      const demoStart = getCount("demo_start");
      const demoComplete = getCount("demo_complete");
      const formGenerate = getCount("form_generate");
      const formPublish = getCount("form_publish");
      const formSubmit = getCount("form_submit");

      if (ga4.summary.sessions >= 20) {
        if (demoStart > 0 && demoComplete / demoStart < 0.40) {
          risks.push(
            isZh
              ? "免登录 Demo 体验完成率偏低，提示存在填写流失。"
              : "Sandbox demo completion rate is low, indicating potential user friction."
          );
        }
        if (formGenerate > 0 && formPublish / formGenerate < 0.50) {
          risks.push(
            isZh
              ? "表单生成后的最终发布率偏低，提示存在注册/额度拦截卡点。"
              : "Form publish conversion rate is low, suggesting sign-up wall friction."
          );
        }
        if (formPublish > 0 && formSubmit / formPublish < 0.10) {
          risks.push(
            isZh
              ? "已发布表单的公开数据提交转化率偏低，影响核心数据收集体验。"
              : "Published form submission rate is low, affecting data collection value."
          );
        }
      }
    }

    // Clarity Risks
    if (clarityRes.status === "ready" && clarityRes.data?.url) {
      const urls = clarityRes.data.url;
      const totalRageClicks = urls.reduce((sum: number, u: any) => sum + (u.rageClicks || 0), 0);
      const totalScriptErrors = urls.reduce((sum: number, u: any) => sum + (u.scriptErrors || 0), 0);

      if (totalRageClicks > 10) {
        risks.push(
          isZh
            ? `Clarity 监测到用户存在 ${totalRageClicks} 次愤怒点击行为，提示交互摩擦卡点。`
            : `Clarity captured ${totalRageClicks} rage clicks, suggesting responsiveness blocks.`
        );
      }
      if (totalScriptErrors > 0) {
        risks.push(
          isZh
            ? `检测到着陆页存在 ${totalScriptErrors} 次 JavaScript 异常脚本错误。`
            : `JS exceptions detected on landing paths (${totalScriptErrors} script errors).`
        );
      }
    }

    // 计算整体健康度
    let health: "ok" | "watch" | "needs_attention" = "ok";
    const hasP0 = recommendedActions.some((a) => a.priority === "P0");
    const hasP1 = recommendedActions.some((a) => a.priority === "P1");

    if (hasP0 || risks.length >= 2) {
      health = "needs_attention";
    } else if (hasP1 || risks.length > 0) {
      health = "watch";
    }

    // 主副标题文案
    let headline = isZh
      ? "状态良好：网站曝光及转化漏斗表现稳定。"
      : "Healthy: Stable organic traffic and funnel performance.";
    if (health === "needs_attention") {
      headline = isZh
        ? "需要关注：检测到激活转化流失和体验卡点。"
        : "Needs Attention: Drop-offs and user friction detected.";
    } else if (health === "watch") {
      headline = isZh
        ? "继续观察：存在轻微的点击流失或需要优化的内容词汇。"
        : "Watching: Slight drop-offs or metadata optimizations needed.";
    }

    // 6. 脱敏后的数据分发与响应
    return Response.json({
      code: 0,
      data: {
        generatedAt: new Date().toISOString(),
        range: { numOfDays },
        sources: {
          gsc: gscRes,
          ga4: ga4Res,
          clarity: clarityRes,
        },
        brief: {
          headline,
          health,
          highlights,
          risks,
          recommendedActions,
        },
      },
    });

  } catch (error: any) {
    return Response.json({
      code: 3,
      message: `Internal server error during Daily Brief generation: ${error.message || "Unknown error"}`,
    });
  }
}
