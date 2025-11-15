/**
 * 프로필 생성 폼 Zod 검증 스키마
 */
import { z } from "zod";

/**
 * 가족 구성원 스키마
 */
export const familyMemberSchema = z.object({
  relation: z.string().min(1, "관계를 선택해주세요"),
  customRelation: z.string().optional(),
  birthYear: z.number().optional(),
  job: z.string().optional(),
  jobDetail: z.string().optional(),
  education: z.string().optional(),
  school: z.string().optional(),
  major: z.string().optional(),
  religion: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * 회원 프로필 스키마 (Step 1)
 */
export const userProfileSchema = z.object({
  // 사진 (필수: 최소 1장, 최대 5장)
  photos: z
    .array(z.string())
    .min(1, "최소 1장의 사진을 등록해주세요")
    .max(5, "사진은 최대 5장까지 등록 가능합니다"),
  mainPhotoIndex: z.number().min(0),
  // 기본 정보 (필수)
  birthYear: z.number().min(1950, "출생년도를 확인해주세요"),
  marriageType: z.string().min(1, "성혼유형을 선택해주세요"),
  job: z.string().min(1, "직업을 선택해주세요"),
  jobDetail: z.string().optional(),
  education: z.string().min(1, "학력을 선택해주세요"),
  school: z.string().optional(),
  major: z.string().optional(),
  height: z.string().optional(),
  assets: z.string().min(1, "재산을 선택해주세요"),
  religion: z.string().min(1, "종교를 선택해주세요"),
  region: z.string().optional(),
  hobbies: z.string().optional(),
  characteristics: z.string().optional(),
  hometown: z.string().optional(),
  hasChildren: z.string().min(1, "아이 유무를 선택해주세요"),
  notes: z.string().optional(),
  // 가족 정보 (최대 5명)
  familyMembers: z
    .array(familyMemberSchema)
    .max(5, "가족은 최대 5명까지 등록 가능합니다"),
});

/**
 * 희망 상대 조건 스키마 (Step 2)
 */
export const preferredConditionsSchema = z.object({
  ageMin: z.number().optional(),
  ageMax: z.number().optional(),
  marriageTypes: z.array(z.string()).optional(),
  jobs: z.array(z.string()).optional(),
  educationTier: z.string().optional(),
  schools: z.array(z.string()).optional(),
  religions: z.array(z.string()).optional(),
  region: z.string().optional(),
  minHeight: z.string().optional(),
  assets: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

/**
 * 전체 프로필 폼 스키마
 */
export const profileFormSchema = z.object({
  userProfile: userProfileSchema,
  preferredConditions: preferredConditionsSchema,
});

export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type PreferredConditionsFormData = z.infer<
  typeof preferredConditionsSchema
>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
