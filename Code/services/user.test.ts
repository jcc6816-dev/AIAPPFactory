import { afterEach, describe, expect, it, vi } from "vitest";

import { saveUser } from "./user";

const userMocks = vi.hoisted(() => ({
  findUserByEmailMock: vi.fn(),
  insertUserMock: vi.fn(),
  increaseCreditsMock: vi.fn(),
}));

vi.mock("@/models/user", () => ({
  findUserByEmail: userMocks.findUserByEmailMock,
  findUserByUuid: vi.fn(),
  insertUser: userMocks.insertUserMock,
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("./credit", async () => {
  const actual = await vi.importActual<typeof import("./credit")>("./credit");
  return {
    ...actual,
    increaseCredits: userMocks.increaseCreditsMock,
  };
});

describe("saveUser", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("marks a newly inserted user for sign-up tracking", async () => {
    userMocks.findUserByEmailMock.mockResolvedValue(undefined);
    userMocks.insertUserMock.mockResolvedValue(undefined);
    userMocks.increaseCreditsMock.mockResolvedValue(undefined);

    const user = {
      uuid: "user_new",
      email: "new@example.com",
      nickname: "New",
      avatar_url: "",
      created_at: "2026-06-02T00:00:00.000Z",
    };
    const result = await saveUser(user);

    expect(result).toEqual({ user, isNewUser: true });
    expect(userMocks.insertUserMock).toHaveBeenCalledWith(user);
    expect(userMocks.increaseCreditsMock).toHaveBeenCalledWith(
      expect.objectContaining({ user_uuid: "user_new" })
    );
  });

  it("reuses an existing user for login tracking", async () => {
    userMocks.findUserByEmailMock.mockResolvedValue({
      id: 7,
      uuid: "user_existing",
      email: "existing@example.com",
      nickname: "Existing",
      avatar_url: "",
      created_at: "2026-05-01T00:00:00.000Z",
    });

    const user = {
      uuid: "generated_uuid",
      email: "existing@example.com",
      nickname: "Existing",
      avatar_url: "",
      created_at: "2026-06-02T00:00:00.000Z",
    };
    const result = await saveUser(user);

    expect(result).toEqual({ user, isNewUser: false });
    expect(result.user.uuid).toBe("user_existing");
    expect(userMocks.insertUserMock).not.toHaveBeenCalled();
    expect(userMocks.increaseCreditsMock).not.toHaveBeenCalled();
  });
});
