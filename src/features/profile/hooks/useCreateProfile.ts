/**
 * 프로필 생성 Mutation Hook
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { profileApi, type Profile } from "../api/profileApi";
import type { ProfileFormData } from "../schemas/profileFormSchema";

/**
 * ProfileFormData를 Profile 타입으로 변환
 */
function convertFormDataToProfile(
  formData: ProfileFormData
): Omit<Profile, "id"> {
  return {
    imageIdList: formData.imageIdList || [],
    name: formData.name,
    phoneNumber: formData.phoneNumber,
    gender: formData.gender,
    birthYear: formData.birthYear,
    address: formData.address,
    eduLevel: formData.eduLevel,
    university: formData.university,
    highSchool: formData.highSchool,
    major: formData.major,
    job: formData.job,
    jobDetail: formData.jobDetail,
    previousJob: formData.previousJob,
    height: formData.height,
    religion: formData.religion,
    property: formData.property,
    hobby: formData.hobby,
    personality: formData.personality,
    idealType: formData.idealType,
    maritalStatus: formData.maritalStatus,
    homeTown: formData.homeTown,
    info: formData.info,
    minPreferredAge: formData.minPreferredAge,
    maxPreferredAge: formData.maxPreferredAge,
    family: formData.family || [],
  };
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: ProfileFormData) => {
      const profileData = convertFormDataToProfile(formData);
      return profileApi.createProfile(profileData);
    },
    onSuccess: () => {
      // 프로필 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["profiles"] });

      // 성공 토스트
      // toast({
      //   title: "프로필 생성 완료",
      //   description: "프로필이 성공적으로 생성되었습니다.",
      // });

      // 프로필 목록 페이지로 이동
      navigate("/profile");
    },
    onError: (error: Error) => {
      // 실패 토스트
      // toast({
      //   variant: "destructive",
      //   title: "프로필 생성 실패",
      //   description: error.message || "프로필 생성 중 오류가 발생했습니다.",
      // });
      console.error("프로필 생성 실패:", error);
    },
  });
}
