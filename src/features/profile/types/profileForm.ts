/**
 * 프로필 생성 폼 관련 타입 정의
 */

/**
 * 가족 구성원 정보
 */
export interface FamilyMember {
  // 관계 ("부", "모", "형제", "자매", "남매", "기타")
  relation: string;
  // "기타" 선택 시 커스텀 관계명
  customRelation?: string;
  // 나이 (출생년도)
  birthYear?: number;
  // 직업
  job?: string;
  // 직업 세부 (현/전)
  jobDetail?: string;
  // 학력 (티어)
  education?: string;
  // 학력 세부 - 학교
  school?: string;
  // 학력 세부 - 과
  major?: string;
  // 종교
  religion?: string;
  // 기타 특이사항
  notes?: string;
}

/**
 * 회원 프로필 정보 (Step 1)
 */
export interface UserProfileData {
  // 사진
  photos: string[];
  mainPhotoIndex: number;
  // 1. 나이 (출생년도)
  birthYear: number;
  // 2. 성혼유형 ("초혼", "재혼")
  marriageType: string;
  // 3. 직업
  job: string;
  // 4. 직업 세부 (현/전)
  jobDetail?: string;
  // 5. 학력 (티어)
  education: string;
  // 6. 학력 세부 - 학교
  school?: string;
  // 6. 학력 세부 - 과
  major?: string;
  // 7. 키
  height?: string;
  // 8. 재산
  assets: string;
  // 9. 종교
  religion: string;
  // 10. 지역
  region?: string;
  // 11. 취미
  hobbies?: string;
  // 12. 특징
  characteristics?: string;
  // 13. 본가
  hometown?: string;
  // 14. 아이 유무
  hasChildren: string;
  // 15. 기타 특이사항
  notes?: string;
  // 16. 가족 정보 (최대 5명)
  familyMembers: FamilyMember[];
}

/**
 * 희망 상대 조건 (Step 2)
 */
export interface PreferredConditions {
  // 1. 나이 (출생년도 범위)
  ageMin?: number;
  ageMax?: number;
  // 2. 성혼유형 (다중 선택)
  marriageTypes?: string[];
  // 3. 직업 (다중 선택)
  jobs?: string[];
  // 4. 학력 (단일 선택 - "~이상" 개념)
  educationTier?: string;
  // 5. 학교 (다중 선택)
  schools?: string[];
  // 6. 종교 (다중 선택)
  religions?: string[];
  // 7. 지역
  region?: string;
  // 8. 키 이상
  minHeight?: string;
  // 9. 재산 (다중 선택)
  assets?: string[];
  // 10. 기타 특이사항
  notes?: string;
}

/**
 * 전체 프로필 폼 데이터
 */
export interface ProfileFormData {
  userProfile: UserProfileData;
  preferredConditions: PreferredConditions;
}
