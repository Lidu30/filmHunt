import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { router, useNavigation } from "expo-router"
import { reactiveModel } from "../bootstrapping"
import { logOut, connectToPersistence } from "../firestoreModel"
import { ProfileView } from "../views/profileView"


export const Profile = observer(() => {
  const navigation = useNavigation()
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

  // hiding the tab bar while editing
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: edit ? "none" : "flex",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 25,
        marginHorizontal: "10%",
        borderRadius: 15,
        width: "80%",
        alignSelf: "center",
        borderTopWidth: 0,
        shadowOpacity: 0.5,
        height: 60,
        paddingTop: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
        elevation: 2,
      },
    })
  }, [edit])

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
