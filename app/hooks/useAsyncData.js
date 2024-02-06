import {useEffect, useState} from "react";
import filterItemsByList from "../utility/filterItemsByList";


function useAsyncData(fetchFunction){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    useEffect(()=>{
        const loadData = async ()=>{
            try{
                setLoading(true);
                const response = await fetchFunction();
                setData(response);
            }catch (e) {
                setError(e);
            }finally {
                setLoading(false);
            }
        }
        loadData();
    },[fetchFunction])
    return {data,loading,error,setData}
}

export default useAsyncData;