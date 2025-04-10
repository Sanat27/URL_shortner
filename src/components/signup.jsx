import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../ui/card";
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { BeatLoader } from 'react-spinners';
import Error from './error';
  import *as Yup from "yup";
import useFetch from '@/hooks/use-fetch';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/context';
import {signup } from '@/db/apiauth';

const Signup = () => {
    const [errors, setErrors] = useState({});
        const [formData, setFormData] = useState({
            name:"",
            email:"",
            password:"",
            profile_pic:null,

        });

        const navigate = useNavigate();
        let [searchParams]=useSearchParams();
        const longLink = searchParams.get("createNew");


        const handleInputChange = (e)=>{
            const{name,value,files} =e.target;
            setFormData((prevState)=>({
                ...prevState,
                [name]:files ? files[0]: value,
            }));
        };
           const {loading,data,error,fn: fnSignup}=useFetch(signup,formData);
           const{fetchUser}=UrlState();
           useEffect(() => {
             if(error===null && data){
            
                navigate(`/dashboard?${longLink ?`createNew=${longLink}` : ""}`);
               fetchUser();
             }
            
           }, [error, loading]);
           
            const handleSignup = async ()=>{
                        setErrors([]);
                        try{
                            const schema= Yup.object().shape({
                                name:Yup.string()
                                .required("Name is Required"),
                                email:Yup.string()
                                .email("Invalid Email")
                                .required("Email is Required"),
                                password:Yup.string()
                                .min(6,"Password must be at least 6 characters")
                                .required("Password is Required"),
                                profile_pic : Yup.mixed()
                                .required("Profile picture is required")
                            });
                            await schema.validate(formData,{abortEarly:true});
                            //api call
                            await fnSignup();
                        }
                        catch(error){
                            const newErrors={};

                           if(error?.inner){
                            error.inner.forEach((err)=> {
                                newErrors[err.path]= err.message;
                            });
                            setErrors(newErrors);}
                            else{
                                setErrors({api:error.message});
                            }
                        }
                    
                
            };
        
        
  return (
    <Card>
    <CardHeader>
      <CardTitle>Signup</CardTitle>
      <CardDescription>Create a new account
      </CardDescription>
      {error && <Error message={error.message}/>}
    </CardHeader>
    <CardContent className="space-y-2">
    <div className="space-y-1">
            <Input name="name" type="text" placeholder="Enter Name"
            onChange={handleInputChange}/>
             </div>
          {errors.name && <Error message={errors.name}/>}
          
            <div className="space-y-1">
            <Input name="email" type="email" placeholder="Enter Email"
            onChange={handleInputChange}/>
             </div>
          {errors.email &&<Error message={errors.email}/>}
          
           
            <div className="space-y-1">
            <Input name="password" type="password" placeholder="Enter Password"
                        onChange={handleInputChange}/>
                         </div>
     { errors.password && <Error message={errors.password}/>}

     <div className="space-y-1">
            <Input name="profile_pic" type="file" accept="image/*"
                        onChange={handleInputChange}/>
                         </div>
     { errors.profile_pic && <Error message={errors.profile_pic}/>}
           
    </CardContent>
    <CardFooter>
        <Button onClick={handleSignup}>
            
            {loading ? (<BeatLoader size={10} color="#36d7b7" />):"Create Account"}</Button>
    </CardFooter>
  </Card>
  
  );
};

export default Signup;