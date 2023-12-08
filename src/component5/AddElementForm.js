import React, { useEffect, useState } from 'react';

const AddElementForm = (props)=>{
    const {handleForm,setShowInput, label = ""} = props
    const[inputValue,setInputValue]= useState("")
    useEffect(()=>{
      label && setInputValue(label)
    },[])
    return(
        <div>
          <form onSubmit={(e)=>handleForm(e)}>
            <input onChange={(e)=>setInputValue(e.target.value)} id='element-input' placeholder='Enter text' type='text' value={inputValue|| null}></input>
            <button type='submit'>save</button>
            <button onClick={()=>setShowInput(false)}>cancel</button>    
          </form>
        </div>
    )
}

export default AddElementForm