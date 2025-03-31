import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Filter, FilterIcon } from "lucide-react";
import Error from "@/components/error";
import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import { UrlState } from "@/context";
import { getClicksForUrls } from "@/db/apiClicks";
import LinkCard from "@/components/link-card";
import CreateLink from "@/components/create-link";
import { supabaseUrl } from "@/db/supabase";

const Dashboard = () => {

  const [searchQuery, setSearchQuery] = useState("")
    const {user}=UrlState()
   const {loading,error,data:url,fn:fnUrls}= useFetch(getUrls,user.id);
  const {
    loading:loadingClicks,
      data: clicks,
      fn:fnClicks,
  }=useFetch(
    getClicksForUrls,
    url?.map((url)=>url.id)
  )
    useEffect(() => {
      fnUrls();
    }, []);

    useEffect(() => {
      if(url?.length)
      fnClicks()
    }, [url?.length]);


    const filteredUrls = url?.filter((url)=>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

    

  return (<div className="flex flex-col gap-8 mx-4">
      {loading || loadingClicks && <BarLoader width={"100%"} color="#36d7b7"/>
      }
    <div className="grid grid-cols-2 gap-4 ">  
    <Card>
  <CardHeader>
    <CardTitle>Links Created</CardTitle>
  </CardHeader>
  <CardContent>
    <p>{url?.length}</p>
  </CardContent>
</Card>
<Card>
  <CardHeader>
    <CardTitle>Total Clicks</CardTitle>
  </CardHeader>
  <CardContent>
    <p>{clicks?.length}</p>
  </CardContent>
</Card> 
 </div>
 <div className="flex justify-between mx-4">
  <h1 className="text-4xl font-extrabold">
    My Links  </h1>
    <CreateLink/>
 </div>
 <div className="relative">
  <Input type="text" placeholder="Filter Links..." 
    value={searchQuery}
  onChange={(e)=>setSearchQuery(e.target.value)}
  />
  <Filter className="absolute top-2 right-2 p-1"/>
 </div>
 { error && <Error message={error?.message}/>}
{(filteredUrls || []).map((url,i)=>{
  return <LinkCard key={i} url={url} fetchUrls={fnUrls}/>;
})}
    </div>
  );
};

export default Dashboard;