import React, { useState } from "react"
import { useRouter } from "expo-router"
import { observer } from "mobx-react-lite"
import { reactiveModel } from "../bootstrapping"
import { signIn, connectToPersistence } from "../firestoreModel"
import { LoginView } from "../views/loginView"
import { reaction } from "mobx"

export const LoginPresenter = observer(() => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.")
      return
    }

    try {
      await signIn(email, password)  
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("No account found with that email. Please sign up first.")
          break
        case "auth/wrong-password":
          alert("Incorrect password. Please try again.")
          break
        case "auth/invalid-email":
          alert("That doesn’t look like a valid email address.")
          break
        case "auth/user-disabled":
          alert("This account has been disabled. Contact support.")
          break
        default:
          alert("Login failed. Please try again.")
      }    }
  }

  return (
    <LoginView
      user={email}
      setUser={setEmail}
      pass={password}
      setPass={setPassword}
      onLogin={handleLogin}
      onNavigateToSignup={() => router.push("/signup")}
    />
  )
})

export default LoginPresenter;