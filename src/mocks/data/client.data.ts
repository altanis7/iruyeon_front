import { MockStorage } from "./storage";
import type { ClientListItem } from "@/features/profile/api/profileApi";

// Mock 데이터 생성을 위한 샘플 데이터
const koreanNames = [
  "김철수",
  "이영희",
  "박민수",
  "최지은",
  "정현우",
  "강수진",
  "윤서연",
  "장동건",
  "오하나",
  "한재석",
  "송미나",
  "임태준",
  "조은비",
  "백승호",
  "홍서진",
  "양준혁",
  "전소연",
  "노민지",
  "하준서",
  "서예린",
];

const maskedNames = [
  "김*수",
  "이*희",
  "박*수",
  "최*은",
  "정*우",
  "강*진",
  "윤*연",
  "장*건",
  "오*나",
  "한*석",
  "송*나",
  "임*준",
  "조*비",
  "백*호",
  "홍*진",
  "양*혁",
  "전*연",
  "노*지",
  "하*서",
  "서*린",
];

const jobs = [
  "의사",
  "변호사",
  "교사",
  "대기업",
  "개발원",
  "회계사",
  "간호사",
  "공기업/기관",
  "연구원",
  "금융",
  "공무원",
  "약사",
  "세무사",
  "교수",
  "엔지니어",
];

const universities = [
  "서울대학교",
  "연세대학교",
  "고려대학교",
  "카이스트",
  "포항공대",
  "성균관대학교",
  "한양대학교",
  "이화여자대학교",
  "경희대학교",
  "중앙대학교",
  "서강대학교",
  "건국대학교",
  "동국대학교",
  "홍익대학교",
  "숙명여자대학교",
];

const addresses = [
  "서울특별시 강남구",
  "서울특별시 서초구",
  "서울특별시 송파구",
  "서울특별시 한남동",
  "서울특별시 청담동",
  "서울특별시 마포구",
  "서울특별시 잠실",
  "서울특별시 동작구",
  "경기도 성남시",
  "경기도 용인시",
  "경기도 분당구",
  "부산광역시 해운대구",
  "인천광역시 연수구",
  "대전광역시 유성구",
  "경기도 수원시",
];

const genders = ["남자", "여자"];

const memberNames = ["류대표", "김매니저", "이컨설턴트", "박상담사", "최대표"];

/**
 * Mock 클라이언트 데이터 생성
 */
function generateMockClients(count: number): ClientListItem[] {
  return Array.from({ length: count }, (_, i) => {
    const clientId = i + 1;
    const genderIndex = i % 2;
    const gender = genders[genderIndex];

    return {
      memberId: (i % memberNames.length) + 1,
      memberName: memberNames[i % memberNames.length],
      memberImage: `https://api.dicebear.com/7.x/initials/svg?seed=member${(i % memberNames.length) + 1}`,
      clientId,
      clientName: maskedNames[i % maskedNames.length],
      clientImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientId}&gender=${gender === "남자" ? "male" : "female"}`,
      address: addresses[i % addresses.length],
      university: universities[i % universities.length],
      job: jobs[i % jobs.length],
      gender,
      height: gender === "남자" ? 170 + (i % 20) : 160 + (i % 15),
      birthYear: 1985 + (i % 15),
    };
  });
}

// 초기 클라이언트 데이터 (25개 생성)
const initialClients = generateMockClients(25);

export const clientsStorage = new MockStorage<ClientListItem[]>(
  "clients",
  initialClients,
);

/**
 * 페이지네이션된 클라이언트 목록 반환
 */
export function getPaginatedClients(page: number, size: number) {
  const allClients = clientsStorage.get();
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const list = allClients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allClients.length / size);

  return {
    totalPages,
    currentPage: page,
    list,
  };
}

/**
 * Profile을 ClientListItem으로 변환하여 추가
 */
export function addClientFromProfile(profile: {
  id?: string;
  name: string;
  birthYear: number;
  job: string;
  university?: string;
  address: string;
  gender: string;
  height: number;
  imageIdList?: number[];
}): ClientListItem {
  const allClients = clientsStorage.get();
  const clientId = allClients.length + 1;

  // 기본 매니저 정보 (실제로는 로그인한 사용자 정보를 사용해야 함)
  const defaultMemberId = 1;
  const defaultMemberName = "류대표";

  const newClient: ClientListItem = {
    memberId: defaultMemberId,
    memberName: defaultMemberName,
    memberImage: `https://api.dicebear.com/7.x/initials/svg?seed=member${defaultMemberId}`,
    clientId,
    clientName: maskName(profile.name), // 이름 마스킹
    clientImage:
      profile.imageIdList && profile.imageIdList.length > 0
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientId}`
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientId}&gender=${profile.gender === "남자" ? "male" : "female"}`,
    address: profile.address,
    university: profile.university || "미입력",
    job: profile.job,
    gender: profile.gender,
    height: profile.height,
    birthYear: profile.birthYear,
  };

  // 맨 앞에 추가 (최신순)
  clientsStorage.update(clients => [newClient, ...clients]);

  return newClient;
}

/**
 * 이름 마스킹 함수 (예: "김철수" -> "김*수")
 */
function maskName(name: string): string {
  if (name.length <= 2) {
    return name[0] + "*";
  }
  return name[0] + "*" + name.slice(2);
}
