import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import {  Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
// import {ExampleChart} from "./Charts";

const Repos = () => {

  const {repose} = React.useContext(GithubContext);
  // console.log(repose);
 
  let languages = repose.reduce((total , item)=>{
    const {language , stargazers_count} = item;
    if (!language) return total
    if (!total[language]) {
      total[language] = {label : language , value : 1 , stars : stargazers_count}
    }else{

      total[language] = {
        ...total[language] ,
         value:total[language].value + 1 , 
        stars : total[language].stars + stargazers_count
      }
    }
    return total 
  } , {})

  // Set function to get the values from the objects an sote them !
  const getObjectsValues = (objects) => {
    const object = Object.values(objects)
      .sort((a , b) => b.value - a.value)
      .slice(0 , 5)

      return object
  }

  // console.log(languages);

  // const mostUsed = Object.values(languages).sort((a,b)=> b.value - a.value).slice(0 , 5)
  const mostUsed = getObjectsValues(languages)

  // most stars per languages

  const mostPopular = Object.values(languages)
    .sort((a,b)=> b.stars - a.stars )
    .map(item => { return {...item , value : item.stars}} )
    .slice( 0 , 5 )
  
    // Stars , forks
    let {stars , forks} = repose.reduce((total , item)=>{
      const {stargazers_count , name , forks} = item;
      total.stars[stargazers_count] = {label : name , value : stargazers_count}
      total.forks[forks] = {label : name , value : forks}
      return total
    },{
      stars : {} , forks : {}
    })

    const reposeStars = getObjectsValues(stars)
    const forked = getObjectsValues(forks)

    // const reposeStars = Object.values(stars)
    //   .sort((a , b) => b.value - a.value )
    //   .slice(0 , 5)


  // const chartData = [
  //   {
  //     label: "HTML",
  //     value: "15"
  //   },
  //   {
  //     label: "CSS",
  //     value: "33"
  //   },
  //   {
  //     label: "Javascrip",
  //     value: "52"
  //   },
  // ];  

  return <section className="section" >
    <Wrapper className="section-center" >
      {/* <ExampleChart data ={chartData} /> */}
      <Pie3D data ={mostUsed} />
      <Column3D data={reposeStars} />
      <Doughnut2D data={mostPopular} />
      <Bar3D data = {forked} />
    </Wrapper>
  </section> ;
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
