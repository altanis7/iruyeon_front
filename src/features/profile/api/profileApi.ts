/**
 * 프로필 API 및 타입 정의
 */

// 프로필 타입 정의 (확장 가능한 구조)
export interface Profile {
  id: string;
  photoUrl: string;
  job: string;
  age: number;
  education: string;
  // 추후 확장 가능한 필드들
  name?: string;
  height?: number;
  weight?: number;
  region?: string;
  religion?: string;
  marriageType?: string;
  // ... 기타 필드들
}

// 검색 파라미터
export interface SearchProfileParams {
  keyword: string;
}

// 목업 데이터
const mockProfiles: Profile[] = [
  {
    id: "1",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    job: "의사",
    age: 32,
    education: "서울대학교",
    name: "김철수",
    region: "서울",
  },
  {
    id: "2",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    job: "변호사",
    age: 29,
    education: "연세대학교",
    name: "이영희",
    region: "경기",
  },
  {
    id: "3",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    job: "교사",
    age: 28,
    education: "고려대학교",
    name: "박민수",
    region: "부산",
  },
  {
    id: "4",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    job: "디자이너",
    age: 30,
    education: "홍익대학교",
    name: "최지은",
    region: "서울",
  },
  {
    id: "5",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    job: "개발자",
    age: 31,
    education: "KAIST",
    name: "정현우",
    region: "대전",
  },
  {
    id: "6",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    job: "회계사",
    age: 27,
    education: "성균관대학교",
    name: "강수진",
    region: "서울",
  },
  {
    id: "7",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
    job: "약사",
    age: 33,
    education: "이화여자대학교",
    name: "윤서연",
    region: "인천",
  },
  {
    id: "8",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
    job: "공무원",
    age: 29,
    education: "한양대학교",
    name: "장동건",
    region: "서울",
  },
  {
    id: "9",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",
    job: "간호사",
    age: 26,
    education: "중앙대학교",
    name: "오하나",
    region: "경기",
  },
  {
    id: "10",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=10",
    job: "엔지니어",
    age: 34,
    education: "포항공과대학교",
    name: "한재석",
    region: "포항",
  },
];

// API 함수들 (현재는 목업, 추후 실제 API로 교체)
export const profileApi = {
  /**
   * 프로필 목록 조회
   */
  getProfiles: async (): Promise<Profile[]> => {
    // 실제 API 호출 시뮬레이션 (지연 추가)
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProfiles;
  },

  /**
   * 프로필 상세 조회
   */
  getProfileById: async (id: string): Promise<Profile | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const profile = mockProfiles.find((p) => p.id === id);
    return profile || null;
  },

  /**
   * 프로필 검색
   * 검색 기준: 나이, 직업, 학벌, 종교, 지역
   */
  searchProfiles: async (params: SearchProfileParams): Promise<Profile[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const { keyword } = params;

    if (!keyword.trim()) {
      return mockProfiles;
    }

    const lowerKeyword = keyword.toLowerCase();

    return mockProfiles.filter((profile) => {
      return (
        profile.job.toLowerCase().includes(lowerKeyword) ||
        profile.education.toLowerCase().includes(lowerKeyword) ||
        (profile.region && profile.region.toLowerCase().includes(lowerKeyword)) ||
        (profile.religion && profile.religion.toLowerCase().includes(lowerKeyword)) ||
        profile.age.toString().includes(lowerKeyword)
      );
    });
  },

  /**
   * 프로필 삭제
   */
  deleteProfile: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // 실제 구현 시 서버에 삭제 요청
    const index = mockProfiles.findIndex((p) => p.id === id);
    if (index > -1) {
      mockProfiles.splice(index, 1);
    }
  },

  /**
   * 프로필 생성 (추후 구현)
   */
  createProfile: async (profile: Omit<Profile, "id">): Promise<Profile> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newProfile: Profile = {
      ...profile,
      id: String(Date.now()),
    };
    mockProfiles.push(newProfile);
    return newProfile;
  },

  /**
   * 프로필 수정 (추후 구현)
   */
  updateProfile: async (
    id: string,
    updates: Partial<Profile>,
  ): Promise<Profile> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockProfiles.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("프로필을 찾을 수 없습니다.");
    }
    mockProfiles[index] = { ...mockProfiles[index], ...updates };
    return mockProfiles[index];
  },
};
