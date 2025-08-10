import React from "react";

export default function GoogleAuthButton() {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = `${process.env.VITE_BACKEND_URL || ''}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn-primary"
      style={{ width: '100%', marginTop: '8px' }}
    >
      Sign in with Google
    </button>
  );
}
