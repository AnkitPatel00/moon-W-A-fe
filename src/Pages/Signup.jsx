import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { signupUser } from "../../features/user/userSlice"
import '../index.css'
import { useDispatch, useSelector } from "react-redux"

const Signup = () => {

  const dispatch = useDispatch()

  const { signupState, signupMessage, signupError } = useSelector((state) => state.userState)

  const initialData = { name: "", email: "", password: "" }

  const [formData,setFormData]= useState(initialData)
  
  const handleForm = (e) => {
    const { id, value } = e.target
    setFormData((prev)=>({...prev,[id]:value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.password)
    {
      dispatch(signupUser(formData))
    }
  }


  useEffect(() => {
    if(signupState==="success")
    setFormData(initialData)
  },[signupState])


  return (
    <>
      <div className="login-form-container bg-body-tertiary">
        
        <form onSubmit={handleSubmit} className="login-form bg-white rounded">
          <h3 className="text-center mb-5 display-6">Workasana Signup</h3>
          <label htmlFor="name" className="form-label">Name:</label>
        <input value={formData.name} className="form-control mb-3" type="text" onChange={handleForm} id="name"  placeholder="Name" required/>
        <label htmlFor="email" className="form-label">Email:</label>
        <input value={formData.email} className="form-control mb-3" type="email" onChange={handleForm} id="email"  placeholder="name@example.com" required/>
        <label htmlFor="password" className="form-label">Password:</label>
        <input value={formData.password} className="form-control" type="password" onChange={handleForm} id="password" required/>
          <button disabled={signupState==="loading"?true:false} className="mt-3 btn btn-primary">{signupState==="loading"?"Please Wait":"Signup"}</button>
          <Link to="/login" className="mt-3 btn btn-secondary ms-3">Login</Link>
          {signupMessage && <p className="text-info mt-2">{signupMessage}</p>}
          {signupError && <p className="text-danger mt-2">{signupError}</p>}
      </form>
      </div>
   
    </>
)

}
export default Signup