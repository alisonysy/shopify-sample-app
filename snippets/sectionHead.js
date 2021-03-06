import { Button } from '@shopify/polaris';
import { useState, useEffect } from 'react';

function SectionHead(props){
  const [active,setActive] = useState(props.sectionActive);

  useEffect(()=>{
    props.handleToggle(active);
  },[active]);

  return (
    <div style={{display:'flex',flexFlow:'row wrap',alignItems:'center',justifyContent:'space-between',padding:'1.5em 1em 1em 1em'}}>
      <div style={{fontSize:'20px'}}>{props.headerTxt}</div>
      <Button
        onClick={() => setActive(!active)}
        ariaExpanded={active}
        ariaControls="basic-collapsible"
      >
        <span style={{transition:'all .3s ease-in'}}>
          { active? 
            <svg 
              viewBox="0 0 448 512" aria-hidden="true" 
              focusable="false" xmlns="http://www.w3.org/2000/svg" 
              role="img"
              style={{height:'1.5em',width:'1.5em'}}
            >
              <path 
                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"
                fill='#000'></path>
            </svg>
            :
            <svg
              viewBox="0 0 448 512" aria-hidden="true" 
              focusable="false" xmlns="http://www.w3.org/2000/svg" 
              role="img"
              style={{height:'1.5em',width:'1.5em'}}
            >
              <path
                d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                fill='#000'></path>
            </svg>
          }
          
        </span>
      </Button>
    </div>
  )
}

export default SectionHead;