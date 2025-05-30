import React, { useState } from "react"
import { useRouter } from "expo-router"
import { observer } from "mobx-react-lite"
import { signUp } from "../firestoreModel"
import { SignupView } from "../views/signupView"

export const SignupPresenter = observer(() => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  const handleSignup = async () => {
    setError("")
    
    if (!name || !email || !password || !password2) {
      setError("Please fill in all fields")
      return
    }

    if (password !== password2) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      await signUp(email, password, name, phone)
      router.replace("/(tabs)/home")
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.")
    }
  }

  return (
    <SignupView
      signup={handleSignup}
      error={error}
      setName={setName}
      name={name}
      setPhone={setPhone}
      phone={phone}
      setUser={setEmail}
      user={email}
      setPass={setPassword}
      pass={password}
      setPass2={setPassword2}
      pass2={password2}
    />
  )
})

export default SignupPresenter