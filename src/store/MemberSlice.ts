import { Member } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  status: boolean;
  member: Member | null;
} = {
  status: false,
  member: null,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setUserMember: (state, action: PayloadAction<Member>) => {
      state.status = true;
      state.member = action.payload;
    },
    resetMember: (state) => {
      state.status = false;
      state.member = null;
    },
  },
});

export const { setUserMember, resetMember } = memberSlice.actions;

export default memberSlice.reducer;
