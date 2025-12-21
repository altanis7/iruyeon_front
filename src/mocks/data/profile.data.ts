import { MockStorage } from "./storage";
import type { Profile } from "@/features/profile/api/profileApi";

// 초기 Mock 프로필 데이터 (기존 profileApi의 mockProfiles에서 이동)
const initialProfiles: Profile[] = [
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

export const profilesStorage = new MockStorage<Profile[]>(
  "profiles",
  initialProfiles,
);

/**
 * ID로 프로필 찾기
 */
export function findProfileById(id: string): Profile | undefined {
  const profiles = profilesStorage.get();
  return profiles.find(p => p.id === id);
}

/**
 * 프로필 추가
 */
export function addProfile(profile: Omit<Profile, "id">): Profile {
  const newProfile: Profile = {
    ...profile,
    id: String(Date.now()),
  };

  profilesStorage.update(profiles => [...profiles, newProfile]);
  return newProfile;
}

/**
 * 프로필 업데이트
 */
export function updateProfile(
  id: string,
  updates: Partial<Profile>,
): Profile | null {
  let updatedProfile: Profile | null = null;

  profilesStorage.update(profiles => {
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return profiles;

    updatedProfile = { ...profiles[index], ...updates };
    const newProfiles = [...profiles];
    newProfiles[index] = updatedProfile;
    return newProfiles;
  });

  return updatedProfile;
}

/**
 * 프로필 삭제
 */
export function deleteProfile(id: string): boolean {
  let deleted = false;

  profilesStorage.update(profiles => {
    const filtered = profiles.filter(p => p.id !== id);
    deleted = filtered.length < profiles.length;
    return filtered;
  });

  return deleted;
}
