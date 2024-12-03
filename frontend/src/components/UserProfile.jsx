import React, {useState} from 'react'
import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';


const UserProfile = () => {

  const { authUser, isUpdatingProfile, updateProfile, updateUserName } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null); 
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  

  const handleImageUpload = async (event) => {
    
    const file = event.target.files[0];

    if(!file)
      toast.error("Upload a picture!");
      
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = async () =>{
        const base64Image = fileReader.result;
        setSelectedImg(base64Image);
        await(updateProfile({profilePic : base64Image}));
      }
  };


  const handleNameUpdate = async (event) => {
   
    event.preventDefault();

    if(!updatedName || updatedName.trim().length < 3){
      toast.error("Name should contain atleast 3 characters!");
      return;
    }
    await updateUserName(updatedName);
    setIsEditingName(false);
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.user.profilePic || "/profile.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>




          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-secondary flex items-center gap-2 font-bold">
                <User className="w-4 h-4" />
                  Name
              </div>
              {isEditingName ? (
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="input input-bordered w-full placeholder:align-middle placeholder:leading-normal"
                    placeholder="Harry Potter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleNameUpdate(e);
                      } else if (e.key === "Escape") {
                        setIsEditingName(false);
                      }
                    }}
                  />
                  <button
                    onClick={handleNameUpdate}
                    className="btn btn-success"
                    disabled={isUpdatingProfile}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.user.fullName}</p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="btn btn-primary"
                  >
                    Update Name
                  </button>
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-secondary flex items-center gap-2 font-bold">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.user.email}</p>
            </div>
          </div>




          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.user.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile
