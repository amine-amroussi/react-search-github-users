import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({children}) => {
    // Get and Set the states
    // Github states
    const [githubUser , setGithubUser] = useState(mockUser)
    const [repose , setRepose] = useState(mockRepos)
    const [followers , setFollowers] = useState(mockFollowers)
    // Resquests & Loading states
    const [requests , setRequests] = useState(0)
    const [isLoading , setIsLoading] = useState(false)
    // Error state
    const [error , setError] = useState({show : false , msg : ''})

    // Function to search a users
    const searchGithubUser = async user => {
        // set function toggleError to default 
        toggleError(false , "")
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`)
        .catch(err => console.log(err))
        if (response) {
            const {login , followers_url} = response.data;
            setGithubUser(response.data)
            
            await Promise.allSettled([axios(`${followers_url}?per_page=100`) , axios(`${rootUrl}/users/${login}/repos?per_page=100`)])
                .then(results => {
                    const [followers , repose] = results
                    console.log(followers , repose);
                    const status = "fulfilled"
                    if (repose.status === status  ) {
                        setRepose(repose.value.data)
                    }
                    if (followers.status === status) {
                        setFollowers(followers.value.data)
                    }
                })
                .catch(err => console.log(err))
        }else{
            toggleError(true , "There is no user with this username ! ")
        }
        setIsLoading(false)
    }

    // set UseEffect & functions 
    // chek the rate
    const checkRequests = ()=> {
        axios(`${rootUrl}/rate_limit`)
        .then(({data}) => {
            let {rate : {remaining}} = data;
            setRequests(remaining)
            if (remaining === 0) {
                toggleError(true , "sorry , you are exceeded your hourly rate limit ! ")
            }
        })
        .catch(err => console.log(err))
    }

    // ToggleError 
    const toggleError = (show = false , msg = "") => {
        setError({show , msg})
    }

    useEffect( checkRequests , [] )

    return <GithubContext.Provider value={{
        githubUser ,
        repose ,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading

        }} > {children} </GithubContext.Provider>
}

export {GithubProvider , GithubContext}