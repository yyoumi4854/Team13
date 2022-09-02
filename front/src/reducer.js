export function loginReducer(userState, action) {
  switch (action.type) {
    //로그인
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
      };

    //로그아웃
    case "LOGOUT":
      return {
        user: null,
      };

    // 사용자 정보 업데이트
    case "UPDATE_USER":
      return {
        user: {
          ...userState.user,
          imgUrl: action.payload.imgUrl,
          name: action.payload.name,
          email: action.payload.email,
          description: action.payload.description,
        },
      };

    //회원탈퇴
    case "DELETE_USER":
      return {
        user: null,
      };
    default:
      return userState;
  }
}
