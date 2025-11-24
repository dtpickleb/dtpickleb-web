import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
// import { EnumOption } from "@/app/features/enums/api";
// import { fetchAllEnums } from "@/app/features/enums/enumsSlice";
// import { useEffect } from "react";
// import { isAuthedClient } from "@/lib/auth-cookies";

// Typed hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// TODO: Re-enable after backend caching is implemented
// Hook to ensure enums are loaded after login
// export const useInitializeEnums = () => {
//   const dispatch = useAppDispatch();
//   const { initialized } = useAppSelector((state) => state.enums);

//   useEffect(() => {
//     if (!initialized && isAuthedClient()) {
//       dispatch(fetchAllEnums());
//     }
//   }, [dispatch, initialized]);
// };

// Hook to access all enums
// export const useEnums = () => {
//   const { data, loading, error, initialized } = useAppSelector(
//     (state) => state.enums
//   );

//   return {
//     enums: data,
//     loading,
//     error,
//     initialized,
//   };
// };

// Specific enum hooks for convenience
// export const useGenderEnum = (): EnumOption[] => {
//   const { enums } = useEnums();
//   return enums?.gender || [];
// };

// export const useSkillLevelEnum = (): EnumOption[] => {
//   const { enums } = useEnums();
//   return enums?.skillLevel || [];
// };

// export const useMatchFormatEnum = (): EnumOption[] => {
//   const { enums } = useEnums();
//   return enums?.matchFormat || [];
// };

// export const useTournamentStatusEnum = (): EnumOption[] => {
//   const { enums } = useEnums();
//   return enums?.tournamentStatus || [];
// };

// export const useRegistrationStatusEnum = (): EnumOption[] => {
//   const { enums } = useEnums();
//   return enums?.registrationStatus || [];
// };

// export const useBracketFormatEnum = (): EnumOption[] => {
//   const { enums } = useEnums();
//   return enums?.bracketFormat || [];
// };
