/**
 * 프로필 생성 폼 Zod 검증 스키마
 */
import { z } from "zod";

/**
 * 가족 구성원 스키마 (기획서 기준 - 간소화)
 */
export const familyMemberSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  relationship: z.string().min(1, "관계를 선택해주세요"),
  job: z.string().optional(),
  birthYear: z.number().optional(),
  religion: z.string().optional(),
  jobDetail: z.string().optional(),
  address: z.string().optional(),
  university: z.string().optional(),
  property: z.string().optional(),
  info: z.string().optional(),
});

/**
 * 프로필 스키마 (단일 Step)
 * 필수 필드: 10개 (name, phoneNumber, gender, birthYear, address, eduLevel, job, height, religion, maritalStatus)
 */
export const profileSchema = z.object({
  // ===== 필수 필드 (10개) =====
  name: z.string().min(1, "이름을 입력해주세요"),
  phoneNumber: z.string().min(1, "전화번호를 입력해주세요"),
  gender: z.string().min(1, "성별을 선택해주세요"),
  birthYear: z.number().min(1950, "출생년도를 확인해주세요"),
  address: z.string().min(1, "거주지를 입력해주세요"),
  eduLevel: z.string().min(1, "학력을 선택해주세요"),
  job: z.string().min(1, "직업을 선택해주세요"),
  height: z.number().min(1, "키를 입력해주세요"),
  religion: z.string().min(1, "종교를 선택해주세요"),
  maritalStatus: z.string().min(1, "혼인 여부를 선택해주세요"),

  // ===== 선택 필드 =====
  // 사진
  imageIdList: z
    .array(z.number())
    .max(3, "사진은 최대 3장까지 등록 가능합니다")
    .optional(),

  // 학력 상세
  university: z.string().optional(),
  highSchool: z.string().optional(),
  major: z.string().optional(),

  // 직업 상세
  jobDetail: z.string().optional(),
  previousJob: z.string().optional(),

  // 재산/취미
  property: z.string().optional(),
  hobby: z.string().optional(),

  // 성격/이상형 (키워드 선택 → 쉼표 연결 문자열)
  personality: z.string().optional(),
  idealType: z.string().optional(),

  // 본가/기타
  homeTown: z.string().optional(),
  info: z
    .string()
    .max(100, "기타 특이사항은 최대 100자까지 입력 가능합니다")
    .optional(),

  // 희망 상대
  minPreferredAge: z.number().optional(),
  maxPreferredAge: z.number().optional(),

  // 만남 횟수
  totalMeetingCnt: z.number().min(0, "만남 횟수는 0 이상이어야 합니다").optional(),

  // 가족
  family: z.array(familyMemberSchema).optional(),
});

export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
