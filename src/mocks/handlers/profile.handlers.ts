import { http } from "msw";
import type {
  Profile,
  SearchProfileParams,
} from "@/features/profile/api/profileApi";
import { calculateAge } from "@/features/profile/api/profileApi";
import {
  profilesStorage,
  findProfileById,
  addProfile,
  updateProfile,
  deleteProfile,
} from "../data/profile.data";
import { addClientFromProfile } from "../data/client.data";
import {
  createSuccessResponse,
  createErrorResponse,
  simulateDelay,
} from "../utils/response";

const BASE_URL = import.meta.env.VITE_API_URL;

export const profileHandlers = [
  /**
   * GET /api/v0/profiles
   * 프로필 목록 조회
   */
  http.get(`${BASE_URL}/api/v0/profiles`, async () => {
    await simulateDelay(300);
    const profiles = profilesStorage.get();
    return createSuccessResponse(profiles);
  }),

  /**
   * GET /api/v0/profiles/:id
   * 프로필 상세 조회
   */
  http.get(`${BASE_URL}/api/v0/profiles/:id`, async ({ params }) => {
    await simulateDelay(200);
    const { id } = params;

    const profile = findProfileById(id as string);

    if (!profile) {
      return createErrorResponse("프로필을 찾을 수 없습니다.", 404);
    }

    return createSuccessResponse(profile);
  }),

  /**
   * POST /api/v0/profiles/search
   * 프로필 검색
   */
  http.post<never, SearchProfileParams>(
    `${BASE_URL}/api/v0/profiles/search`,
    async ({ request }) => {
      await simulateDelay(300);

      const body = await request.json();
      const { keyword } = body;

      const profiles = profilesStorage.get();

      if (!keyword?.trim()) {
        return createSuccessResponse(profiles);
      }

      const lowerKeyword = keyword.toLowerCase();

      const filtered = profiles.filter(profile => {
        const age = calculateAge(profile.birthYear);
        return (
          profile.job?.toLowerCase().includes(lowerKeyword) ||
          profile.education?.toLowerCase().includes(lowerKeyword) ||
          profile.region?.toLowerCase().includes(lowerKeyword) ||
          profile.religion?.toLowerCase().includes(lowerKeyword) ||
          age.toString().includes(lowerKeyword) ||
          profile.birthYear.toString().includes(lowerKeyword)
        );
      });

      return createSuccessResponse(filtered);
    },
  ),

  /**
   * POST /api/v0/profiles
   * 프로필 생성
   */
  http.post<never, Omit<Profile, "id">>(
    `${BASE_URL}/api/v0/profiles`,
    async ({ request }) => {
      await simulateDelay(500);

      const body = await request.json();
      const newProfile = addProfile(body);

      // Client 스토리지에도 추가
      addClientFromProfile({
        id: newProfile.id,
        name: newProfile.name,
        birthYear: newProfile.birthYear,
        job: newProfile.job,
        university: newProfile.university,
        address: newProfile.address,
        gender: newProfile.gender,
        height: newProfile.height,
        imageIdList: newProfile.imageIdList,
      });

      return createSuccessResponse(newProfile, "프로필이 생성되었습니다.");
    },
  ),

  /**
   * PUT /api/v0/profiles/:id
   * 프로필 수정
   */
  http.put<{ id: string }, Partial<Profile>>(
    `${BASE_URL}/api/v0/profiles/:id`,
    async ({ params, request }) => {
      await simulateDelay(500);

      const { id } = params;
      const body = await request.json();

      const updated = updateProfile(id, body);

      if (!updated) {
        return createErrorResponse("프로필을 찾을 수 없습니다.", 404);
      }

      return createSuccessResponse(updated, "프로필이 수정되었습니다.");
    },
  ),

  /**
   * DELETE /api/v0/profiles/:id
   * 프로필 삭제
   */
  http.delete(`${BASE_URL}/api/v0/profiles/:id`, async ({ params }) => {
    await simulateDelay(200);

    const { id } = params;
    const deleted = deleteProfile(id as string);

    if (!deleted) {
      return createErrorResponse("프로필을 찾을 수 없습니다.", 404);
    }

    return createSuccessResponse(null, "프로필이 삭제되었습니다.");
  }),
];
