import React, { useState } from "react"
import { router } from "expo-router"
import { observer } from "mobx-react-lite"
import { signUp } from "../firestoreModel"
import { SignupView } from "../views/signupView"

export const SignupPresenter = observer(() => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  return (
    <SignupView
      signup={() => {
        if (password !== password2) {
          console.error("Passwords do not match")
          return
        }

        signUp(email, password, name, phone)
          .then(() => {
            router.replace("/(tabs)/home")
          })
          .catch((error) => {
            alert("Sign-up failed: " + error.message)
          })
      }}
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
    ></SignupView>
  )

})

export default SignupPresenter;
