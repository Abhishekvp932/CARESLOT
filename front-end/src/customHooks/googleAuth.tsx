export const useGoogleAuth = ()=>{
    const handleGoogleLogin = ()=>{
         window.location.href = "https://careslot-j0bz.onrender.com/api/auth/google";
    }
    return handleGoogleLogin
}

