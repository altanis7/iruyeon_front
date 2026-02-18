import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { clientApi, type Profile } from "../api/profileApi";
import type { ProfileFormData } from "../schemas/profileFormSchema";

/**
 * ProfileFormData를 Profile 타입으로 변환
 */
function convertFormDataToProfile(
  formData: ProfileFormData
): Omit<Profile, "id"> {
  return {
    imageIdList: formData.imageIdList?.length ? formData.imageIdList : undefined,
    name: formData.name,
    phoneNumber: formData.phoneNumber,
    gender: formData.gender,
    birthYear: formData.birthYear,
    address: formData.address,
    eduLevel: formData.eduLevel,
    university: formData.university || undefined,
    highSchool: formData.highSchool || undefined,
    major: formData.major || undefined,
    job: formData.job,
    jobDetail: formData.jobDetail || undefined,
    previousJob: formData.previousJob || undefined,
    height: formData.height,
    religion: formData.religion,
    property: formData.property || undefined,
    hobby: formData.hobby || undefined,
    personality: formData.personality || undefined,
    idealType: formData.idealType || undefined,
    maritalStatus: formData.maritalStatus,
    homeTown: formData.homeTown || undefined,
    info: formData.info || undefined,
    minPreferredAge: formData.minPreferredAge ?? undefined,
    maxPreferredAge: formData.maxPreferredAge ?? undefined,
    totalMeetingCnt: formData.totalMeetingCnt ?? undefined,
    family: formData.family?.length ? formData.family : undefined,
  };
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: ProfileFormData) => {
      const profileData = convertFormDataToProfile(formData);
      return clientApi.createClient(profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("프로필이 등록되었습니다.");
      navigate("/profile");
    },
    onError: (error: Error) => {
      console.error("클라이언트 생성 실패:", error);
      toast.error(error.message || "프로필 등록에 실패했습니다.");
    },
  });
}
