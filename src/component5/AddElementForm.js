import { Button, Form, Input } from 'antd';
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
            <Input onChange={(e)=>setInputValue(e.target.value)} id='element-input' placeholder='Enter text' type='text' value={inputValue|| null}></Input>
            <button type='submit'>save</button>
            <Button onClick={()=>setShowInput(false)}>cancel</Button>    
          </form>
        </div>
    )
}

export default AddElementForm