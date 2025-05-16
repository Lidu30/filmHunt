import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { router } from "expo-router"
import { reactiveModel } from "../bootstrapping"
import { logOut, connectToPersistence } from "../firestoreModel"
import { ProfileView } from "../views/profileView"


export const Profile = observer(() => {
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(reactiveModel.userDetails.name)
  const [email, setEmail] = useState(reactiveModel.userDetails.email)
  const [phone, setPhone] = useState(reactiveModel.userDetails.phone)

useEffect(() => {
    setName(reactiveModel.userDetails.name || "");
    setEmail(reactiveModel.userDetails.email || "");
    setPhone(reactiveModel.userDetails.phone || "");
  }, [
    reactiveModel.userDetails.id,
    reactiveModel.userDetails.name,
    reactiveModel.userDetails.email,
    reactiveModel.userDetails.phone,
  ]);

  const handleLogout = async () => {
    await logOut()
    router.replace("/login")
  }

  const handleSave = async () => {
    try {
      reactiveModel.setUserDetails({ id: reactiveModel.userDetails.id, name, email, phone })
      await connectToPersistence()
      setEdit(false)
    } catch (err) {
      alert("Save failed: " + err.message)
    }
  }

  return (
    <ProfileView
      edit={edit}
      setEdit={() => setEdit(true)}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      phone={phone}
      setPhone={setPhone}
      save={handleSave}
      logout={handleLogout}
    />
  )
})

export default Profile
