import { MockStorage } from "./storage";
import type {
  ClientListItem,
  ClientDetail,
  ClientFamilyMember,
  MyClientListItem,
} from "@/features/profile/api/profileApi";

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

/**
 * 클라이언트 상세 정보 생성 함수
 */
function generateDetailedClient(clientId: number): ClientDetail {
  // 먼저 myClients에서 찾기 (우선순위: 내 회원의 경우 올바른 memberId 사용)
  const myClients = myClientsStorage.get();
  const myClient = myClients.find(c => c.clientId === clientId);

  // myClient가 없으면 initialClients에서 찾기
  const listItem = myClient || initialClients.find(c => c.clientId === clientId);
  if (!listItem) throw new Error(`Client ${clientId} not found`);

  const currentYear = new Date().getFullYear();
  const age = currentYear - listItem.birthYear + 1;
  const isMale = listItem.gender === "남자";

  // 가족 구성원 2-3명 생성 (부모는 기본, 형제는 짝수 ID만)
  const families: ClientFamilyMember[] = [
    {
      relationship: "아버지",
      name: `${listItem.clientName[0]}*장`,
      birthYear: listItem.birthYear - 30,
      address: listItem.address,
      property: "자가",
      university: universities[(clientId + 5) % universities.length],
      job: null,
      jobDetail: jobs[(clientId + 2) % jobs.length],
      religion: ["기독교", "천주교", "불교", "무교"][clientId % 4],
      info: null,
    },
    {
      relationship: "어머니",
      name: "이*숙",
      birthYear: listItem.birthYear - 28,
      address: listItem.address,
      property: "",
      university: "",
      job: null,
      jobDetail: "주부",
      religion: ["기독교", "천주교", "불교", "무교"][clientId % 4],
      info: null,
    },
  ];

  // 짝수 ID면 형제 추가
  if (clientId % 2 === 0) {
    families.push({
      relationship: isMale ? "남동생" : "언니",
      name: `${listItem.clientName[0]}*현`,
      birthYear: listItem.birthYear + (isMale ? -2 : 3),
      address: addresses[(clientId + 3) % addresses.length],
      property: "",
      university: universities[(clientId + 7) % universities.length],
      job: null,
      jobDetail: jobs[(clientId + 5) % jobs.length],
      religion: ["기독교", "천주교", "불교", "무교"][clientId % 4],
      info: null,
    });
  }

  return {
    id: clientId,
    memberId: myClient ? myClient.memberId : listItem.memberId,
    name: listItem.clientName,
    address: listItem.address,
    age: `${age}세 (${listItem.birthYear}년생)`,
    height: listItem.height,
    religion: ["기독교", "천주교", "불교", "무교"][clientId % 4],
    eduLevel: ["학사", "석사", "박사"][clientId % 3],
    highSchool: ["휘문고등학교", "대원고등학교", "경기고등학교"][clientId % 3],
    university: listItem.university,
    job: listItem.job,
    jobDetail: ["삼성전자", "현대자동차", "네이버"][(clientId - 1) % 3],
    previousJob: clientId % 3 === 0 ? jobs[(clientId + 3) % jobs.length] : "",
    info: "화목한 가정에서 자랐으며, 성실하고 책임감 있는 성격입니다.",
    homeTown: addresses[(clientId + 2) % addresses.length].split(" ")[0],
    gender: listItem.gender,
    status: "ACTIVE",
    minPreferredAge: age - 3,
    maxPreferredAge: age + 5,
    idealType: ["유머감각, 배려심", "진솔함, 책임감"][clientId % 2],
    personality: ["외향적, 긍정적", "차분함, 성실함"][clientId % 2],
    property: ["5억", "10억", "15억"][clientId % 3],
    major: ["경영학과", "컴퓨터공학과", "물리학과"][clientId % 3],
    hobby: ["러닝, 헬스", "독서, 영화감상", "등산, 요리"][clientId % 3],
    maritalStatus: clientId % 5 === 0 ? "재혼" : "초혼",
    phoneNumber: null,
    profileImages:
      clientId % 3 === 0
        ? []
        : Array.from(
            { length: Math.min(3, (clientId % 3) + 1) },
            (_, i) =>
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientId}-${i}&gender=${isMale ? "male" : "female"}`,
          ),
    families,
  };
}

// 상세 데이터 캐시
const detailedClientsMap = new Map<number, ClientDetail>();

/**
 * 클라이언트 상세 정보 조회
 */
export function getClientDetail(clientId: number): ClientDetail | null {
  // 캐시 확인
  if (detailedClientsMap.has(clientId)) {
    return detailedClientsMap.get(clientId)!;
  }

  // 생성 및 캐싱
  try {
    const detail = generateDetailedClient(clientId);
    detailedClientsMap.set(clientId, detail);
    return detail;
  } catch {
    return null;
  }
}

/**
 * 내 회원 목록 Mock 데이터
 */
const initialMyClients: MyClientListItem[] = [
  {
    memberId: 1,
    memberName: "염대표",
    memberImage: null,
    clientId: 12,
    clientName: "수*",
    clientImage: null,
    address: "서울 서초구",
    university: "서울대학교",
    job: "기타",
    gender: "여자",
    height: 163,
    birthYear: 1994,
    status: "ACTIVE",
  },
  {
    memberId: 1,
    memberName: "염대표",
    memberImage: null,
    clientId: 10,
    clientName: "박*검",
    clientImage: null,
    address: "서울특별시 마포구",
    university: "성균관대학교",
    job: "대기업",
    gender: "남자",
    height: 184,
    birthYear: 1993,
    status: "ACTIVE",
  },
  {
    memberId: 1,
    memberName: "염대표",
    memberImage: null,
    clientId: 9,
    clientName: "장*영",
    clientImage:
      "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/5c4dde88-dfbb-4ccd-b031-3bc6658e72ed.avif",
    address: "서울특별시 한남동",
    university: "이화여자대학교",
    job: "대기업",
    gender: "여자",
    height: 170,
    birthYear: 2000,
    status: "ACTIVE",
  },
  {
    memberId: 1,
    memberName: "염대표",
    memberImage: null,
    clientId: 8,
    clientName: "변*석",
    clientImage:
      "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/d2fe6921-5111-4695-b879-ef094a81b268.jpg",
    address: "서울특별시 잠실",
    university: "연세대학교",
    job: "대기업",
    gender: "남자",
    height: 185,
    birthYear: 1990,
    status: "INACTIVE",
  },
  {
    memberId: 1,
    memberName: "염대표",
    memberImage: null,
    clientId: 7,
    clientName: "김*니",
    clientImage:
      "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/d424a718-5733-4264-a93f-a2a2c289a120.jpeg",
    address: "서울특별시 청담동",
    university: "시카고대학교",
    job: "대기업",
    gender: "여자",
    height: 163,
    birthYear: 1996,
    status: "INACTIVE",
  },
  {
    memberId: 1,
    memberName: "염대표",
    memberImage: null,
    clientId: 6,
    clientName: "박*검",
    clientImage:
      "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/007b6330-a5d2-4a2a-9f2d-fd7b18ab4a32.jpg",
    address: "서울특별시 마포구",
    university: "성균관대학교",
    job: "대기업",
    gender: "남자",
    height: 184,
    birthYear: 1993,
    status: "INACTIVE",
  },
  {
    memberId: 1,
    memberName: "염대표",
    memberImage: null,
    clientId: 5,
    clientName: "수*",
    clientImage:
      "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/99fdb260-6ada-4009-9173-3889d57de2c3.jpg",
    address: "서울특별시 청담동",
    university: "서강대학교",
    job: "대기업",
    gender: "여자",
    height: 168,
    birthYear: 1994,
    status: "INACTIVE",
  },
];

export const myClientsStorage = new MockStorage<MyClientListItem[]>(
  "myClients",
  initialMyClients,
);

/**
 * 페이지네이션된 내 회원 목록 반환
 */
export function getPaginatedMyClients(page: number, size: number) {
  const allClients = myClientsStorage.get();
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
 * ========================================
 * Client Management Functions (상태 전환, 수정, 삭제)
 * ========================================
 */

/**
 * 클라이언트 상태 토글 (ACTIVE ↔ INACTIVE)
 */
export function toggleClientStatus(memberId: number): {
  clientId: number;
  newStatus: "ACTIVE" | "INACTIVE";
} | null {
  const myClients = myClientsStorage.get();
  const clientIndex = myClients.findIndex(c => c.memberId === memberId);

  if (clientIndex === -1) return null;

  const client = myClients[clientIndex];
  const newStatus = client.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  // Update status in myClients
  myClientsStorage.update(clients => {
    const updated = [...clients];
    updated[clientIndex] = { ...updated[clientIndex], status: newStatus };
    return updated;
  });

  // Also update in detailedClientsMap cache if exists
  const detailData = detailedClientsMap.get(client.clientId);
  if (detailData) {
    detailData.status = newStatus;
    detailedClientsMap.set(client.clientId, detailData);
  }

  return {
    clientId: client.clientId,
    newStatus,
  };
}

/**
 * 클라이언트 정보 업데이트
 */
export function updateClientDetail(
  clientId: number,
  updates: Partial<ClientDetail>,
): ClientDetail | null {
  const currentDetail = getClientDetail(clientId);
  if (!currentDetail) return null;

  const updatedDetail: ClientDetail = {
    ...currentDetail,
    ...updates,
  };

  // Update cache
  detailedClientsMap.set(clientId, updatedDetail);

  // Update in clientsStorage (list data)
  const allClients = clientsStorage.get();
  const listIndex = allClients.findIndex(c => c.clientId === clientId);
  if (listIndex !== -1) {
    clientsStorage.update(clients => {
      const updated = [...clients];
      updated[listIndex] = {
        ...updated[listIndex],
        clientName: updates.name ? maskName(updates.name) : updated[listIndex].clientName,
        address: updates.address || updated[listIndex].address,
        university: updates.university || updated[listIndex].university,
        job: updates.job || updated[listIndex].job,
        gender: updates.gender || updated[listIndex].gender,
        height: updates.height !== undefined ? updates.height : updated[listIndex].height,
        birthYear: updates.birthYear || updated[listIndex].birthYear,
      };
      return updated;
    });
  }

  // Update in myClientsStorage if exists
  const myClients = myClientsStorage.get();
  const myClientIndex = myClients.findIndex(c => c.clientId === clientId);
  if (myClientIndex !== -1) {
    myClientsStorage.update(clients => {
      const updated = [...clients];
      updated[myClientIndex] = {
        ...updated[myClientIndex],
        clientName: updates.name ? maskName(updates.name) : updated[myClientIndex].clientName,
        address: updates.address || updated[myClientIndex].address,
        university: updates.university || updated[myClientIndex].university,
        job: updates.job || updated[myClientIndex].job,
        gender: updates.gender || updated[myClientIndex].gender,
        height: updates.height !== undefined ? updates.height : updated[myClientIndex].height,
        birthYear: updates.birthYear || updated[myClientIndex].birthYear,
      };
      return updated;
    });
  }

  return updatedDetail;
}

/**
 * 클라이언트 삭제
 */
export function deleteClientById(clientId: number): boolean {
  // Remove from cache
  detailedClientsMap.delete(clientId);

  // Remove from clientsStorage
  const allClients = clientsStorage.get();
  const filteredClients = allClients.filter(c => c.clientId !== clientId);
  if (filteredClients.length < allClients.length) {
    clientsStorage.save(filteredClients);
  }

  // Remove from myClientsStorage
  const myClients = myClientsStorage.get();
  const filteredMyClients = myClients.filter(c => c.clientId !== clientId);
  if (filteredMyClients.length < myClients.length) {
    myClientsStorage.save(filteredMyClients);
    return true;
  }

  return false;
}
