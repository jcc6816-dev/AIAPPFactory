import { describe, expect, it } from "vitest";

import {
  answerSettingsAgentQuery,
  buildSettingsAgentResponses,
} from "./settings-agent";

const user = {
  uuid: "user_1",
  email: "mike@example.com",
  nickname: "Mike",
};

describe("settings-agent", () => {
  it("builds free plan allowance responses", () => {
    const responses = buildSettingsAgentResponses(user, {
      isPaidUser: false,
      maxForms: 100,
      currentFormCount: 8,
      canCreate: true,
    });

    expect(responses.allowance).toContain("免费版");
    expect(responses.allowance).toContain("还能创建 92 个场景");
    expect(responses.account).toContain("user_1");
    expect(responses.defaultResponse).toContain("不会修改账户");
  });

  it("builds paid plan allowance responses", () => {
    const responses = buildSettingsAgentResponses(user, {
      isPaidUser: true,
      maxForms: null,
      currentFormCount: 108,
      canCreate: true,
    });

    expect(responses.allowance).toContain("专业版");
    expect(responses.allowance).toContain("不限量");
  });

  it("answers settings queries by intent without using an LLM", () => {
    const responses = buildSettingsAgentResponses(user, {
      isPaidUser: false,
      maxForms: 100,
      currentFormCount: 100,
      canCreate: false,
    });

    expect(answerSettingsAgentQuery("我现在还能创建几个场景？", responses)).toContain(
      "免费额度已用完"
    );
    expect(answerSettingsAgentQuery("API Key 在哪里？", responses)).toContain("API Keys");
    expect(answerSettingsAgentQuery("怎么邀请团队成员？", responses)).toContain("团队协作");
    expect(answerSettingsAgentQuery("我的账户邮箱是什么？", responses)).toContain(
      "mike@example.com"
    );
  });
});
