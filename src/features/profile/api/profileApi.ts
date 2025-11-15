/**
 * 프로필 API 및 타입 정의
 */

/**
 * 가족 구성원 정보
 */
export interface FamilyMember {
  relation: string; // 관계 ("부", "모", "형제", "자매", "남매", "기타")
  customRelation?: string; // "기타" 선택 시 커스텀 관계명
  birthYear?: number; // 출생년도
  job?: string; // 직업
  jobDetail?: string; // 직업 세부 (현/전)
  education?: string; // 학력 티어
  school?: string; // 학교명
  major?: string; // 전공
  religion?: string; // 종교
  notes?: string; // 기타 특이사항
}

// 프로필 타입 정의 (확장 가능한 구조)
export interface Profile {
  id: string;
  // 사진 관련
  photos: string[];
  mainPhotoIndex: number;
  // 회원 기본 정보
  birthYear: number; // 출생년도
  marriageType: string; // 성혼유형 ("초혼", "재혼")
  job: string; // 직업
  jobDetail?: string; // 직업 세부 (현/전)
  education: string; // 학력 티어
  school?: string; // 학교명
  major?: string; // 전공
  height?: string; // 키 (cm)
  assets: string; // 재산
  religion: string; // 종교
  region?: string; // 지역
  hobbies?: string; // 취미
  characteristics?: string; // 특징
  hometown?: string; // 본가
  hasChildren: string; // 아이 유무 ("유", "무")
  notes?: string; // 기타 특이사항
  familyMembers: FamilyMember[]; // 가족 정보 (최대 5명)
  // 희망 상대 조건
  preferredAgeMin?: number; // 희망 나이 최소 (출생년도)
  preferredAgeMax?: number; // 희망 나이 최대 (출생년도)
  preferredMarriageTypes?: string[]; // 희망 성혼유형
  preferredJobs?: string[]; // 희망 직업 (다중)
  preferredEducationTier?: string; // 희망 학력 (~이상)
  preferredSchools?: string[]; // 희망 학교 (다중)
  preferredReligions?: string[]; // 희망 종교 (다중)
  preferredRegion?: string; // 희망 지역
  preferredMinHeight?: string; // 희망 키 이상
  preferredAssets?: string[]; // 희망 재산 (다중)
  preferredNotes?: string; // 희망 상대 기타 특이사항
  // 레거시 필드 (호환성)
  name?: string;
  weight?: number;
  preferredJob?: string[];
  preferredEducation?: string[];
  preferredReligion?: string[];
}

// 나이 계산 유틸리티
export const calculateAge = (birthYear: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear + 1; // 한국 나이
};

// 검색 파라미터
export interface SearchProfileParams {
  keyword: string;
}

// 목업 데이터 (새로운 타입 구조에 맞게 수정)
const mockProfiles: Profile[] = [
  {
    id: "1",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=1"],
    mainPhotoIndex: 0,
    birthYear: 1993,
    marriageType: "초혼",
    job: "의사",
    education: "서울대/연세대/고려대",
    school: "서울대",
    assets: "10억이상 100억미만",
    religion: "기독교",
    hasChildren: "무",
    familyMembers: [],
    name: "김철수",
    region: "서울",
  },
  {
    id: "2",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=2"],
    mainPhotoIndex: 0,
    birthYear: 1996,
    marriageType: "초혼",
    job: "변호사",
    education: "서울대/연세대/고려대",
    school: "연세대",
    assets: "10억이상 100억미만",
    religion: "가톨릭",
    hasChildren: "무",
    familyMembers: [],
    name: "이영희",
    region: "경기",
  },
  {
    id: "3",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=3"],
    mainPhotoIndex: 0,
    birthYear: 1997,
    marriageType: "초혼",
    job: "교육",
    education: "중앙대/경희대/외대/시립대",
    school: "경희대",
    assets: "1억이상 10억미만",
    religion: "불교",
    hasChildren: "무",
    familyMembers: [],
    name: "박민수",
    region: "부산",
  },
  {
    id: "4",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=4"],
    mainPhotoIndex: 0,
    birthYear: 1995,
    marriageType: "초혼",
    job: "문화/예술",
    education: "건국대/동국대/홍익대",
    school: "홍익대",
    assets: "1억이상 10억미만",
    religion: "그 외",
    hasChildren: "무",
    familyMembers: [],
    name: "최지은",
    region: "서울",
  },
  {
    id: "5",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=5"],
    mainPhotoIndex: 0,
    birthYear: 1994,
    marriageType: "재혼",
    job: "개발원",
    education: "서강대/성균관대/한양대/GIST",
    school: "한양대",
    assets: "10억이상 100억미만",
    religion: "그 외",
    hasChildren: "유",
    familyMembers: [],
    name: "정현우",
    region: "대전",
  },
  {
    id: "6",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=6"],
    mainPhotoIndex: 0,
    birthYear: 1998,
    marriageType: "초혼",
    job: "회계사",
    education: "서울대/연세대/고려대",
    school: "고려대",
    assets: "10억이상 100억미만",
    religion: "기독교",
    hasChildren: "무",
    familyMembers: [],
    name: "강수진",
    region: "서울",
  },
  {
    id: "7",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=7"],
    mainPhotoIndex: 0,
    birthYear: 1992,
    marriageType: "초혼",
    job: "간호사",
    education: "국립대",
    school: "국립대",
    assets: "1억이상 10억미만",
    religion: "가톨릭",
    hasChildren: "무",
    familyMembers: [],
    name: "윤서연",
    region: "인천",
  },
  {
    id: "8",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=8"],
    mainPhotoIndex: 0,
    birthYear: 1996,
    marriageType: "초혼",
    job: "공기업/기관",
    education: "국립대",
    school: "국립대",
    assets: "1억이상 10억미만",
    religion: "그 외",
    hasChildren: "무",
    familyMembers: [],
    name: "장동건",
    region: "서울",
  },
  {
    id: "9",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=9"],
    mainPhotoIndex: 0,
    birthYear: 1999,
    marriageType: "초혼",
    job: "간호사",
    education: "그 외",
    school: "그 외",
    assets: "1억미만",
    religion: "기독교",
    hasChildren: "무",
    familyMembers: [],
    name: "오하나",
    region: "경기",
  },
  {
    id: "10",
    photos: ["https://api.dicebear.com/7.x/avataaars/svg?seed=10"],
    mainPhotoIndex: 0,
    birthYear: 1991,
    marriageType: "초혼",
    job: "연구원",
    education: "카이스트/포항공대/유니스트",
    school: "포항공대",
    assets: "1억이상 10억미만",
    religion: "불교",
    hasChildren: "무",
    familyMembers: [],
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
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProfiles;
  },

  /**
   * 프로필 상세 조회
   */
  getProfileById: async (id: string): Promise<Profile | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const profile = mockProfiles.find(p => p.id === id);
    return profile || null;
  },

  /**
   * 프로필 검색
   * 검색 기준: 나이, 직업, 학벌, 종교, 지역
   */
  searchProfiles: async (params: SearchProfileParams): Promise<Profile[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const { keyword } = params;

    if (!keyword.trim()) {
      return mockProfiles;
    }

    const lowerKeyword = keyword.toLowerCase();

    return mockProfiles.filter(profile => {
      const age = calculateAge(profile.birthYear);
      return (
        profile.job.toLowerCase().includes(lowerKeyword) ||
        profile.education.toLowerCase().includes(lowerKeyword) ||
        (profile.region &&
          profile.region.toLowerCase().includes(lowerKeyword)) ||
        (profile.religion &&
          profile.religion.toLowerCase().includes(lowerKeyword)) ||
        age.toString().includes(lowerKeyword) ||
        profile.birthYear.toString().includes(lowerKeyword)
      );
    });
  },

  /**
   * 프로필 삭제
   */
  deleteProfile: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // 실제 구현 시 서버에 삭제 요청
    const index = mockProfiles.findIndex(p => p.id === id);
    if (index > -1) {
      mockProfiles.splice(index, 1);
    }
  },

  /**
   * 프로필 생성 (추후 구현)
   */
  createProfile: async (profile: Omit<Profile, "id">): Promise<Profile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
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
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProfiles.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("프로필을 찾을 수 없습니다.");
    }
    mockProfiles[index] = { ...mockProfiles[index], ...updates };
    return mockProfiles[index];
  },
};
