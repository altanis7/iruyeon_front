import { MockStorage } from "./storage";
import type { ReceivedMatch } from "@/features/match/api/matchApi";

/**
 * 받은 매칭 초기 데이터
 */
const initialReceivedMatches: ReceivedMatch[] = [
  {
    matchId: 1,
    matchStatus: "CANCELED",
    message: "다른분과 매칭됐는데 진지하게 만나고 있답니다.",
    memberClientResponseDTO: {
      memberId: 2,
      memberName: "염사장",
      memberImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/33137e94-7133-48e1-82fe-c14d279ce77d.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T070502Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=537da5a234459a118f6b9232c512dc6759debdee2a533c6e4b91fd4b2daa742c",
      clientId: 5,
      clientName: "최우식",
      clientImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/8a1fca80-0149-47a2-b131-ec68d5d64971.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T070502Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=c1372a29bd07a663230229021c889c9ec020b5c6550271574ddb24f34c421819",
      age: "32세 (1993년생)",
      address: "서울특별시 마포구 합정동",
      university: "서강대학교",
      job: "대기업",
      gender: "남자",
    },
    openAt: "2025-11-11T14:49:20.740483",
    reply: null,
  },
  {
    matchId: 2,
    matchStatus: "REJECTED",
    message: "류진님에게 관심있으세요~",
    memberClientResponseDTO: {
      memberId: 2,
      memberName: "염사장",
      memberImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/33137e94-7133-48e1-82fe-c14d279ce77d.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T070502Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=537da5a234459a118f6b9232c512dc6759debdee2a533c6e4b91fd4b2daa742c",
      clientId: 6,
      clientName: "박보검",
      clientImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/09e44ef9-85fa-47b8-b793-69d2bbe8f168.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T070502Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=39df874b66dfa70c659521ca5f36c19e395a899e0ff99f9e70c41a6accb3d573",
      age: "32세 (1993년생)",
      address: "서울특별시 종로구",
      university: "서강대학교",
      job: "대기업",
      gender: "남자",
    },
    openAt: "2025-11-11T16:03:48.902454",
    reply: "현재 만나고 있는 남성분이 계시다고 합니다.",
  },
];

/**
 * 보낸 매칭 초기 데이터
 */
const initialSentMatches: ReceivedMatch[] = [
  {
    matchId: 3,
    matchStatus: "CANCELED",
    message: "혹시 이성으로서 관심 있으실까요?",
    memberClientResponseDTO: {
      memberId: 1,
      memberName: "염대표",
      memberImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/1345672f-772f-46d0-817e-03c746eef483.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T065153Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=a4e5e3c6c73beb8378c4c4a0df997677265273bb008d81d5e21be494874589f4",
      clientId: 1,
      clientName: "염류선",
      clientImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/047916f2-02c4-4667-a4a0-c1bec1264866.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T065153Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=a5818f283cd60d3dcf6b9bc8c69eb394b0d31c8c0a0a1182d13341e403582f44",
      age: "28세 (1997년생)",
      address: "서울특별시 강남구 테헤란로 123",
      university: "서울대학교",
      job: "대기업",
      gender: "여자",
    },
    openAt: "2025-11-11T14:49:20.740483",
    reply: null,
  },
  {
    matchId: 4,
    matchStatus: "REJECTED",
    message: "서로 잘 맞을 것 같아요!",
    memberClientResponseDTO: {
      memberId: 1,
      memberName: "염대표",
      memberImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/1345672f-772f-46d0-817e-03c746eef483.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T065153Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=a4e5e3c6c73beb8378c4c4a0df997677265273bb008d81d5e21be494874589f4",
      clientId: 2,
      clientName: "염류진",
      clientImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/47190b30-fdc4-456e-94c9-0ad444de778b.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T065153Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=01a5e401eceff0758cbb03d1939d6819f75afab810116705b5093ef65b64be20",
      age: "30세 (1995년생)",
      address: "서울특별시 강남구 테헤란로 123",
      university: "와플대학",
      job: "프리랜서",
      gender: "여자",
    },
    openAt: "2025-11-11T15:06:10.527607",
    reply: "다른 분과 연락중이라고 하네요.",
  },
];

export const receivedMatchesStorage = new MockStorage<ReceivedMatch[]>(
  "receivedMatches",
  initialReceivedMatches,
);

/**
 * 매칭 완료 초기 데이터
 */
const initialMatchedMatches: ReceivedMatch[] = [
  {
    matchId: 5,
    matchStatus: "MATCHED",
    message: "서로 잘 맞는 것 같아서 매칭했어요!",
    memberClientResponseDTO: {
      memberId: 1,
      memberName: "염대표",
      memberImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/1345672f-772f-46d0-817e-03c746eef483.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T055230Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=12877c4b5ac28813972f7caa51af4ce3df11219222296a302c844b854ff1d85f",
      clientId: 1,
      clientName: "염류선",
      clientImage:
        "https://iruyeon-official.s3.ap-northeast-2.amazonaws.com/images/origin/047916f2-02c4-4667-a4a0-c1bec1264866.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251111T055230Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=AKIAQDWC2HANL4RABBBV%2F20251111%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=6d8b7a6c271ab80051ed8a875ab8b3a8abab1facce2e99642fb0b5deb19bafdd",
      age: "28세 (1997년생)",
      address: "서울특별시 강남구 테헤란로 123",
      university: "서울대학교",
      job: "대기업",
      gender: "여자",
    },
    openAt: "2025-11-11T14:52:30.270217",
    reply: null,
  },
];

export const receivedMatchesStorage = new MockStorage<ReceivedMatch[]>(
  "receivedMatches",
  initialReceivedMatches,
);

export const sentMatchesStorage = new MockStorage<ReceivedMatch[]>(
  "sentMatches",
  initialSentMatches,
);

export const matchedMatchesStorage = new MockStorage<ReceivedMatch[]>(
  "matchedMatches",
  initialMatchedMatches,
);

/**
 * 페이지네이션된 받은 매칭 목록 반환
 */
export function getPaginatedMatches(page: number, size: number) {
  const allMatches = receivedMatchesStorage.get();
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const list = allMatches.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allMatches.length / size);

  return {
    totalPages,
    currentPage: page,
    list,
  };
}

/**
 * 페이지네이션된 보낸 매칭 목록 반환
 */
export function getPaginatedSentMatches(page: number, size: number) {
  const allMatches = sentMatchesStorage.get();
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const list = allMatches.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allMatches.length / size);

  return {
    totalPages,
    currentPage: page,
    list,
  };
}

/**
 * 페이지네이션된 매칭 완료 목록 반환
 */
export function getPaginatedMatchedMatches(page: number, size: number) {
  const allMatches = matchedMatchesStorage.get();
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const list = allMatches.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allMatches.length / size);

  return {
    totalPages,
    currentPage: page,
    list,
  };
}
