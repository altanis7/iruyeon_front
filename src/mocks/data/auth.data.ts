import { MockStorage } from "./storage";

export interface MockUser {
  id: string;
  email: string;
  pwd: string; // 실제로는 해시되어야 하지만, Mock에서는 평문
  name: string;
  phoneNumber: string;
  gender: string;
  company: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// 초기 Mock 사용자 (테스트용)
const initialUsers: MockUser[] = [
  {
    id: "1",
    email: "test@example.com",
    pwd: "password123", // Mock용 평문
    name: "김테스트",
    phoneNumber: "010-1234-5678",
    gender: "male",
    company: "테스트회사",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
];

export const usersStorage = new MockStorage<MockUser[]>("users", initialUsers);

/**
 * 이메일로 사용자 찾기
 */
export function findUserByEmail(email: string): MockUser | undefined {
  const users = usersStorage.get();
  return users.find(user => user.email === email);
}

/**
 * 사용자 추가
 */
export function addUser(user: Omit<MockUser, "id" | "createdAt">): MockUser {
  const newUser: MockUser = {
    ...user,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };

  usersStorage.update(users => [...users, newUser]);
  return newUser;
}

/**
 * 로그인 검증
 */
export function validateLogin(email: string, password: string): MockUser | null {
  const user = findUserByEmail(email);

  if (!user) return null;
  if (user.pwd !== password) return null;
  if (user.status !== "approved") return null; // 승인된 사용자만 로그인 가능

  return user;
}
