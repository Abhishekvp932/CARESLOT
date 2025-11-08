export const useGoogleAuth = ()=>{
    const handleGoogleLogin = ()=>{
         window.location.href = "https://careslot.ddns.net/api/auth/google";
    }
    return handleGoogleLogin
}

