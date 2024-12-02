import {create} from "zustand"
import { axiosInstance } from "../utils/axios.js"
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({

    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    onlineUsers : [],

    isCheckingAuth : true,

    checkAuth : async () => {
        try {
            
            const response = await axiosInstance.get("/auth/check")
            set({authUser : response.data})
        } catch (error) {
            console.log("Error in checkAuth ", error);
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false})
        }
    },

    signUp : async (userData) => {
        
        try {
            set({isSigningUp : true});
            const response = await axiosInstance.post("/auth/signup", userData)
            set({authUser : response.data});
            toast.success("Account Created Successfully!");

        } catch (error) {
            console.log("Error in Signup :- ",error.message);
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }finally{
            set({isSigningUp : false});
        } 
    },


    login : async (userData) => {
        
        try {
            set({isLoggingIn : true});
            const response = await axiosInstance.post("/auth/login", userData);
            set({authUser : response.data});
            toast.success("Logged In Successfully!");
        } catch (error) {
            console.log("Error in login :- ", error.message);
            toast.error(error.response.data.message);    
        }finally{
            set({isLoggingIn : false});
        }
    },

    logout : async () => {

        try{
            const response = await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success("Looged Out Successfully!");
        }catch(error){
            console.log("Error in logout :- ", error.message);
            toast.error(error.response.data.message);
        }
    },

    updateProfile : async(userData) => {

        set({isUpdatingProfile : true});

        try {
            const response = await axiosInstance.put("/auth/updateprofile", userData);
            set({authUser : response.data});
            toast.success("Profile Picture Update Successfully!");
        } catch (error) {
            console.log("Error in updateProfile :- ", error.message);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile : false});
        }
    }
}))