/**
 * ClientDetail -> ProfileFormData 변환 유틸리티
 * 상세 조회 API 응답을 폼 데이터로 변환
 */
import type { ClientDetail, ClientInfoDetail, ClientInfoFamilyMember, ClientFamilyMember } from "../api/profileApi";
import type { ProfileFormData } from "../schemas/profileFormSchema";

/**
 * ClientDetail.age 문자열에서 birthYear 추출
 * 형식: "33세 (1993년생)" -> 1993
 */
export function parseBirthYearFromAge(age: string): number {
  // 1차: "YYYY년생" 패턴에서 추출
  const yearMatch = age.match(/(\d{4})년생/);
  if (yearMatch) {
    return Number(yearMatch[1]);
  }

  // 2차: "N세" 패턴에서 나이 추출 후 역산 (한국 나이 기준)
  const ageMatch = age.match(/(\d+)세/);
  if (ageMatch) {
    const koreanAge = Number(ageMatch[1]);
    return new Date().getFullYear() - koreanAge + 1;
  }

  // fallback: 현재 연도 (파싱 실패 시)
  return new Date().getFullYear();
}

/**
 * ClientDetail API 응답을 ProfileFormData로 변환
 */
export function clientDetailToFormData(client: ClientDetail | ClientInfoDetail): ProfileFormData {
  return {
    // 필수 필드
    name: client.name,
    phoneNumber: client.phoneNumber ?? "",
    gender: client.gender,
    birthYear: parseBirthYearFromAge(client.age),
    address: client.address,
    eduLevel: client.eduLevel,
    job: client.job,
    height: client.height,
    religion: client.religion,
    maritalStatus: client.maritalStatus,

    // 선택 필드
    imageIdList: [], // 이미지 ID는 URL에서 추출 불가, 추후 구현 시 별도 처리 필요
    university: client.university || undefined,
    highSchool: client.highSchool || undefined,
    major: client.major || undefined,
    jobDetail: client.jobDetail || undefined,
    previousJob: client.previousJob || undefined,
    property: client.property || undefined,
    hobby: client.hobby || undefined,
    personality: client.personality || undefined,
    idealType: client.idealType || undefined,
    homeTown: client.homeTown || undefined,
    info: client.info || undefined,
    minPreferredAge: client.minPreferredAge || undefined,
    maxPreferredAge: client.maxPreferredAge || undefined,
    totalMeetingCnt: undefined, // ClientDetail에 없음

    // 가족 정보: ClientFamilyMember[] -> FamilyMember[]
    family: client.families?.map(f => {
      const isInfoFamily = "age" in f;
      return {
        name: f.name,
        relationship: f.relationship,
        job: f.job ?? undefined,
        birthYear: isInfoFamily
          ? parseBirthYearFromAge((f as ClientInfoFamilyMember).age)
          : (f as ClientFamilyMember).birthYear,
        religion: f.religion,
        jobDetail: f.jobDetail || undefined,
        address: f.address || undefined,
        university: f.university || undefined,
        property: f.property || undefined,
        info: f.info ?? undefined,
      };
    }) ?? [],
  };
}
