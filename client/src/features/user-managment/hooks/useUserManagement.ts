import User from "@/types/models/User"
import { useState } from "react"

const useUserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  return {
    selectedUser,
    setSelectedUser,
  }
}

export default useUserManagement
