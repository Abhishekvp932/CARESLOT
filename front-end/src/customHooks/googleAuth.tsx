export const useGoogleAuth = ()=>{
    const handleGoogleLogin = ()=>{
         window.location.href = "http://localhost:3000/api/auth/google";
    }
    return handleGoogleLogin
}