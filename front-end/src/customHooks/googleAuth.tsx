export const useGoogleAuth = ()=>{
    const handleGoogleLogin = ()=>{
         window.location.href = "https://www.careslot.site/api/auth/google";
    }
    return handleGoogleLogin
}

