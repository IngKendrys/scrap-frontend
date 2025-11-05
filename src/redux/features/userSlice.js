import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  token: Cookies.get("token") || null,
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
        console.log("Setting user with payload:", action.payload);
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      Cookies.set("token", token, { expires: 7 }); // dura 7 días
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove("token");
      Cookies.remove("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
