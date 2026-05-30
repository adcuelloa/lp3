import type { Cat, View } from "@/types";

export type AppState = {
  view: View;
  isAddOpen: boolean;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  editCat: Cat | null;
  adoptingCat: Cat | null;
  appliedCatIds: Set<number>;
};

export type AppAction =
  | { type: "SET_VIEW"; view: View }
  | { type: "SET_ADD_OPEN"; open: boolean }
  | { type: "SET_LOGIN_OPEN"; open: boolean }
  | { type: "SET_REGISTER_OPEN"; open: boolean }
  | { type: "SET_EDIT_CAT"; cat: Cat | null }
  | { type: "SET_ADOPTING_CAT"; cat: Cat | null }
  | { type: "MARK_APPLIED"; catId: number };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "SET_ADD_OPEN":
      return { ...state, isAddOpen: action.open };
    case "SET_LOGIN_OPEN":
      return { ...state, isLoginOpen: action.open };
    case "SET_REGISTER_OPEN":
      return { ...state, isRegisterOpen: action.open };
    case "SET_EDIT_CAT":
      return { ...state, editCat: action.cat };
    case "SET_ADOPTING_CAT":
      return { ...state, adoptingCat: action.cat };
    case "MARK_APPLIED":
      return { ...state, appliedCatIds: new Set(state.appliedCatIds).add(action.catId) };
    default:
      return state;
  }
}

export const initialState: AppState = {
  view: "cats",
  isAddOpen: false,
  isLoginOpen: false,
  isRegisterOpen: false,
  editCat: null,
  adoptingCat: null,
  appliedCatIds: new Set(),
};

export const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};
