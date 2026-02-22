/**
 * ProfileFormData -> UpdateClientRequest 변환 유틸리티
 * 폼 데이터를 PATCH API 요청 형식으로 변환
 */
import type { UpdateClientRequest } from "../api/profileApi";
import type { ProfileFormData } from "../schemas/profileFormSchema";

/**
 * ProfileFormData를 UpdateClientRequest로 변환
 * clientId를 주입하고, family 필드 매핑 처리
 */
export function convertFormDataToUpdateRequest(
  formData: ProfileFormData,
  clientId: number,
): UpdateClientRequest {
  return {
    clientId,

    // 필수 필드
    name: formData.name,
    phoneNumber: formData.phoneNumber,
    gender: formData.gender,
    birthYear: formData.birthYear,
    address: formData.address,
    eduLevel: formData.eduLevel,
    job: formData.job,
    height: formData.height,
    religion: formData.religion,
    maritalStatus: formData.maritalStatus,

    // 선택 필드 (빈 문자열은 undefined로 변환)
    imageIdList: formData.imageIdList?.length ? formData.imageIdList : undefined,
    university: formData.university || undefined,
    highSchool: formData.highSchool || undefined,
    major: formData.major || undefined,
    jobDetail: formData.jobDetail || undefined,
    previousJob: formData.previousJob || undefined,
    property: formData.property || undefined,
    hobby: formData.hobby || undefined,
    personality: formData.personality || undefined,
    idealType: formData.idealType || undefined,
    homeTown: formData.homeTown || undefined,
    info: formData.info || undefined,
    minPreferredAge: formData.minPreferredAge ?? undefined,
    maxPreferredAge: formData.maxPreferredAge ?? undefined,
    totalMeetingCnt: formData.totalMeetingCnt ?? undefined,

    // 가족 정보: FamilyMember[] -> UpdateClientRequest.family[]
    family: formData.family?.length
      ? formData.family.map(f => ({
          relationship: f.relationship,
          name: f.name,
          birthYear: f.birthYear ?? 0,
          address: f.address ?? "",
          property: f.property ?? "",
          university: f.university ?? "",
          job: f.job ?? null,
          jobDetail: f.jobDetail ?? "",
          religion: f.religion ?? "",
          info: f.info ?? null,
        }))
      : undefined,
  };
}
